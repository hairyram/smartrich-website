# SmartRich Technologies Website - Google Cloud Deployment Guide

This guide covers deploying the SmartRich marketing website to Google Cloud Platform.

## Prerequisites

- Google Cloud Platform account with billing enabled
- `gcloud` CLI installed and authenticated
- Node.js 20+ installed locally
- PostgreSQL database (Cloud SQL or external)

## Option 1: Cloud Run (Recommended)

Cloud Run is the simplest option for containerized Node.js applications.

### Step 1: Set Up Cloud SQL PostgreSQL

```bash
# Create a Cloud SQL instance
gcloud sql instances create smartrich-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-south1

# Create database
gcloud sql databases create smartrich --instance=smartrich-db

# Create user
gcloud sql users create smartrich_user \
  --instance=smartrich-db \
  --password=YOUR_SECURE_PASSWORD
```

### Step 2: Create Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 5000

CMD ["node", "dist/index.js"]
```

### Step 3: Build and Push Container

```bash
# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Build and push
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/smartrich-website

# Or use Artifact Registry (recommended)
gcloud artifacts repositories create smartrich --repository-format=docker --location=asia-south1
gcloud builds submit --tag asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/smartrich/website
```

### Step 4: Deploy to Cloud Run

```bash
gcloud run deploy smartrich-website \
  --image gcr.io/YOUR_PROJECT_ID/smartrich-website \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 5000 \
  --set-env-vars "NODE_ENV=production" \
  --set-secrets "DATABASE_URL=smartrich-db-url:latest,RECAPTCHA_SECRET_KEY=recaptcha-secret:latest,SESSION_SECRET=session-secret:latest" \
  --add-cloudsql-instances YOUR_PROJECT_ID:asia-south1:smartrich-db
```

### Step 5: Set Up Secrets in Secret Manager

```bash
# Create secrets
echo -n "postgresql://smartrich_user:PASSWORD@/smartrich?host=/cloudsql/PROJECT:asia-south1:smartrich-db" | \
  gcloud secrets create smartrich-db-url --data-file=-

echo -n "your-recaptcha-secret-key" | \
  gcloud secrets create recaptcha-secret --data-file=-

echo -n "your-session-secret" | \
  gcloud secrets create session-secret --data-file=-
```

---

## Option 2: App Engine

### Step 1: Create app.yaml

```yaml
runtime: nodejs20

env_variables:
  NODE_ENV: "production"

instance_class: F2

automatic_scaling:
  min_instances: 0
  max_instances: 2

vpc_access_connector:
  name: projects/YOUR_PROJECT_ID/locations/asia-south1/connectors/smartrich-connector
```

### Step 2: Deploy

```bash
gcloud app deploy
```

---

## Option 3: Compute Engine (VM)

For more control, deploy on a VM:

```bash
# Create VM
gcloud compute instances create smartrich-server \
  --machine-type=e2-small \
  --zone=asia-south1-a \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --tags=http-server,https-server

# SSH and set up
gcloud compute ssh smartrich-server --zone=asia-south1-a
```

On the VM:
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and build
git clone YOUR_REPO_URL
cd smartrich-website
npm install
npm run build

# Create .env file with your variables
cat > .env << EOF
DATABASE_URL=your-database-url
RECAPTCHA_SECRET_KEY=your-secret
VITE_RECAPTCHA_SITE_KEY=your-site-key
SESSION_SECRET=your-session-secret
EOF

# Use PM2 for process management
sudo npm install -g pm2
pm2 start dist/index.js --name smartrich
pm2 startup
pm2 save
```

---

## Environment Variables Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PGHOST` | Database host |
| `PGPORT` | Database port (usually 5432) |
| `PGUSER` | Database username |
| `PGPASSWORD` | Database password |
| `PGDATABASE` | Database name |
| `SESSION_SECRET` | Random string for session encryption |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v3 secret key |
| `VITE_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v3 site key |

---

## Database Migration

After deployment, run the database migration:

```bash
# If using Cloud Run, run as a one-off job
gcloud run jobs create smartrich-migrate \
  --image gcr.io/YOUR_PROJECT_ID/smartrich-website \
  --set-secrets "DATABASE_URL=smartrich-db-url:latest" \
  --command "npm" \
  --args "run,db:push"

gcloud run jobs execute smartrich-migrate
```

---

## Custom Domain Setup

1. Go to Cloud Run console
2. Select your service
3. Click "Manage Custom Domains"
4. Add your domain (e.g., thesmartrich.com)
5. Update DNS with the provided records

---

## SSL/HTTPS

Cloud Run provides automatic HTTPS with managed SSL certificates. For custom domains, certificates are automatically provisioned.

---

## Monitoring

Enable Cloud Monitoring:

```bash
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
```

View logs:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=smartrich-website" --limit 50
```

---

## Cost Estimate (Monthly)

| Service | Estimated Cost |
|---------|---------------|
| Cloud Run (low traffic) | $0 - $10 |
| Cloud SQL (db-f1-micro) | ~$10 |
| Cloud Storage (assets) | < $1 |
| **Total** | **~$15-25/month** |

Cloud Run has a generous free tier - 2 million requests/month free.

---

## Security Checklist

- [ ] Enable Cloud Armor for DDoS protection
- [ ] Set up Identity-Aware Proxy if admin pages are added
- [ ] Enable VPC connector for Cloud SQL
- [ ] Use Secret Manager for all sensitive values
- [ ] Enable audit logging
- [ ] Set up uptime monitoring alerts
