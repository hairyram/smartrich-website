# SmartRich Technologies Website - Zoho Catalyst Deployment Guide

This guide covers deploying the SmartRich marketing website to Zoho Catalyst using AppSail.

## Prerequisites

- Zoho account with Catalyst access (sign up at https://catalyst.zoho.com)
- Node.js 18+ installed locally
- Catalyst CLI installed (`npm install -g zcatalyst-cli`)

## Overview

Zoho Catalyst is a serverless platform that provides:
- Automatic scaling
- Built-in database (Data Store)
- Integrated authentication
- Zero infrastructure management
- Pay-per-use pricing

---

## Step 1: Prepare the Application

### 1.1 Install Catalyst SDK

```bash
npm install zcatalyst-sdk-node
```

### 1.2 Modify Server Entry Point

Create `catalyst-index.js` in the project root:

```javascript
const express = require('express');
const { createServer } = require('http');
const app = express();

// Import your existing routes
const { registerRoutes } = require('./dist/routes');

// Catalyst uses this environment variable for the port
const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (built frontend)
app.use(express.static('dist/public'));

// Initialize server
const httpServer = createServer(app);

// Register API routes
registerRoutes(httpServer, app).then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

### 1.3 Update package.json

Add a Catalyst-specific start script:

```json
{
  "scripts": {
    "start": "node catalyst-index.js",
    "build": "vite build && esbuild server/index.ts --bundle --platform=node --outdir=dist --external:pg-native",
    "build:catalyst": "npm run build"
  }
}
```

---

## Step 2: Set Up Catalyst Project

### 2.1 Login to Catalyst CLI

```bash
catalyst login
```

This opens a browser for authentication.

### 2.2 Initialize Catalyst Project

In your project directory:

```bash
catalyst init
```

Follow the prompts:
1. Select your Catalyst project (or create new)
2. Choose **AppSail** as the service type
3. Select **Node.js** runtime
4. Set the build directory to your project root
5. Set startup command: `npm start`

This creates `catalyst.json` and `app-config.json` files.

### 2.3 Configure app-config.json

```json
{
  "runtime": "nodejs18",
  "command": "npm start",
  "stack": "node18",
  "build": {
    "command": "npm run build:catalyst",
    "output_directory": "."
  },
  "env_variables": {
    "NODE_ENV": "production"
  }
}
```

---

## Step 3: Database Setup

Zoho Catalyst offers two database options:

### Option A: Use Catalyst Data Store (Recommended for Simple Apps)

Catalyst provides a built-in NoSQL-like data store. Modify your storage layer:

```javascript
const catalyst = require('zcatalyst-sdk-node');

async function createContactSubmission(req, data) {
  const app = catalyst.initialize(req);
  const datastore = app.datastore();
  const table = datastore.table('ContactSubmissions');
  
  return await table.insertRow({
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    createdAt: new Date().toISOString()
  });
}
```

Create the table in Catalyst Console:
1. Go to **Catalyst Console** → **Data Store**
2. Create table **ContactSubmissions** with columns:
   - `name` (Text)
   - `email` (Text)
   - `phone` (Text)
   - `message` (Text)
   - `createdAt` (DateTime)

### Option B: Use External PostgreSQL (Keep Current Setup)

You can connect to an external PostgreSQL database (like Neon, Supabase, or a self-hosted instance):

1. Set up your PostgreSQL database externally
2. Add environment variables in Catalyst Console

---

## Step 4: Environment Variables

### 4.1 Configure in Catalyst Console

Go to **Catalyst Console** → **Project Settings** → **Environment Variables**

Add the following:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` |
| `RECAPTCHA_SECRET_KEY` | `your-recaptcha-secret` |
| `VITE_RECAPTCHA_SITE_KEY` | `your-recaptcha-site-key` |
| `SESSION_SECRET` | `your-session-secret` |

### 4.2 Access in Code

Environment variables are automatically available via `process.env`:

```javascript
const secretKey = process.env.RECAPTCHA_SECRET_KEY;
```

---

## Step 5: Build and Deploy

### 5.1 Build the Application

```bash
npm run build:catalyst
```

### 5.2 Deploy to Catalyst

```bash
catalyst deploy
```

The CLI will:
1. Upload your code
2. Run the build command
3. Deploy to Catalyst's infrastructure
4. Provide a live URL

### 5.3 Verify Deployment

After deployment, you'll receive a URL like:
```
https://your-project.zohocatalyst.com
```

Visit this URL to verify your website is live.

---

## Step 6: Custom Domain Setup

### 6.1 Add Domain in Catalyst Console

1. Go to **Catalyst Console** → **Manage** → **Domain**
2. Click **Add Domain**
3. Enter your domain (e.g., `thesmartrich.com`)
4. Catalyst provides DNS records to configure

### 6.2 Configure DNS

Add the following DNS records at your domain registrar:

| Type | Name | Value |
|------|------|-------|
| CNAME | www | `your-project.zohocatalyst.com` |
| CNAME | @ | `your-project.zohocatalyst.com` |

SSL certificates are automatically provisioned.

---

## Step 7: Database Migration

If using external PostgreSQL, run migrations before first deployment:

```bash
# Set DATABASE_URL locally first
export DATABASE_URL="your-database-url"
npm run db:push
```

---

## Monitoring & Logs

### View Logs

Via CLI:
```bash
catalyst logs
```

Via Console:
1. Go to **Catalyst Console** → **Logs**
2. Filter by service and time range

### Metrics

Catalyst automatically tracks:
- Request count
- Response times
- Error rates
- Resource usage

---

## Project Structure for Catalyst

```
smartrich-website/
├── catalyst.json          # Catalyst project config
├── app-config.json        # AppSail configuration
├── catalyst-index.js      # Catalyst entry point
├── package.json
├── dist/                  # Built application
│   ├── public/           # Frontend assets
│   └── *.js              # Backend code
├── client/               # React source
├── server/               # Express source
└── shared/               # Shared types
```

---

## Pricing

Zoho Catalyst pricing (as of 2025):

| Component | Free Tier | Paid |
|-----------|-----------|------|
| AppSail Requests | 125,000/month | Pay per request |
| Data Store | 5 GB | Pay per GB |
| File Store | 5 GB | Pay per GB |
| Custom Domain | ✓ | ✓ |

For a marketing website with low-medium traffic, the free tier is often sufficient.

---

## Troubleshooting

### Common Issues

**1. Port binding error**
```
Error: EADDRINUSE
```
Solution: Ensure you're using `X_ZOHO_CATALYST_LISTEN_PORT`:
```javascript
const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 5000;
```

**2. Module not found**
Solution: Ensure all dependencies are in `package.json` and `node_modules` is included in deployment.

**3. Database connection failed**
Solution: Verify DATABASE_URL is correctly set in Catalyst environment variables.

**4. Build fails**
Solution: Test build locally first:
```bash
npm run build:catalyst
npm start
```

---

## Security Checklist

- [ ] Environment variables set in Catalyst Console (not in code)
- [ ] HTTPS enabled (automatic with Catalyst)
- [ ] reCAPTCHA configured for contact form
- [ ] Database credentials secured
- [ ] Session secret is strong and random
- [ ] Production environment has no debug logs

---

## Useful Commands

```bash
# Login to Catalyst
catalyst login

# Initialize project
catalyst init

# Deploy application
catalyst deploy

# View logs
catalyst logs

# Open Catalyst Console
catalyst console

# Check deployment status
catalyst functions:list
```

---

## Support

- **Catalyst Documentation**: https://docs.catalyst.zoho.com
- **Community Forum**: https://catalyst.zoho.com/community
- **SDK Reference**: https://docs.catalyst.zoho.com/en/sdk/nodejs/v2/overview/
