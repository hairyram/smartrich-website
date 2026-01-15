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

Create `catalyst-index.ts` in the project root:

```typescript
import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from './server/routes';

const app = express();

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
    "start": "tsx catalyst-index.ts",
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

## Step 3: Database Setup with Catalyst Data Store

Replace the PostgreSQL storage with Catalyst's built-in Data Store.

### 3.1 Create Tables in Catalyst Console

Go to **Catalyst Console** → **Data Store** and create these tables:

**Table 1: Users**
| Column Name | Data Type |
|-------------|-----------|
| ROWID | (auto-generated) |
| username | Text |
| password | Text |

**Table 2: ContactSubmissions**
| Column Name | Data Type |
|-------------|-----------|
| ROWID | (auto-generated) |
| name | Text |
| email | Text |
| phone | Text |
| message | Text |
| createdAt | Text |

### 3.2 Replace server/storage.ts

Create a new file `server/storage-catalyst.ts` with the complete implementation:

```typescript
// server/storage-catalyst.ts
// Complete Catalyst Data Store implementation for all IStorage methods

import type { Request } from 'express';
import catalyst from 'zcatalyst-sdk-node';

// Types (matching your existing schema)
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  createdAt: Date;
}

export interface InsertContactSubmission {
  name: string;
  email: string;
  phone: string;
  message?: string | null;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
}

// Catalyst request context type
type CatalystRequest = Record<string, unknown>;

// Helper to get Catalyst app from request
let currentRequest: CatalystRequest | null = null;

export function setCatalystRequest(req: Request) {
  // Cast Express Request to the type Catalyst expects
  currentRequest = req as unknown as CatalystRequest;
}

function getCatalystApp() {
  if (!currentRequest) {
    throw new Error('Catalyst request not set. Call setCatalystRequest(req) first.');
  }
  return catalyst.initialize(currentRequest);
}

export class CatalystStorage implements IStorage {
  
  // ============ USER METHODS ============
  
  async getUser(id: string): Promise<User | undefined> {
    try {
      const app = getCatalystApp();
      const datastore = app.datastore();
      const table = datastore.table('Users');
      
      const row = await table.getRow(parseInt(id));
      if (!row) return undefined;
      
      return {
        id: row.ROWID.toString(),
        username: row.username,
        password: row.password
      };
    } catch (error) {
      console.error('getUser error:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const app = getCatalystApp();
      const zcql = app.zcql();
      
      // Use ZCQL (Zoho's SQL-like query language) to search
      const query = `SELECT ROWID, username, password FROM Users WHERE username = '${username.replace(/'/g, "''")}'`;
      const result = await zcql.executeZCQLQuery(query);
      
      if (!result || result.length === 0) return undefined;
      
      const row = result[0].Users;
      return {
        id: row.ROWID.toString(),
        username: row.username,
        password: row.password
      };
    } catch (error) {
      console.error('getUserByUsername error:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const app = getCatalystApp();
    const datastore = app.datastore();
    const table = datastore.table('Users');
    
    const row = await table.insertRow({
      username: insertUser.username,
      password: insertUser.password
    });
    
    return {
      id: row.ROWID.toString(),
      username: row.username,
      password: row.password
    };
  }

  // ============ CONTACT SUBMISSION METHODS ============

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const app = getCatalystApp();
    const datastore = app.datastore();
    const table = datastore.table('ContactSubmissions');
    
    const now = new Date().toISOString();
    
    const row = await table.insertRow({
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      message: submission.message || '',
      createdAt: now
    });
    
    return {
      id: parseInt(row.ROWID),
      name: row.name,
      email: row.email,
      phone: row.phone,
      message: row.message || null,
      createdAt: new Date(row.createdAt)
    };
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    try {
      const app = getCatalystApp();
      const zcql = app.zcql();
      
      const query = 'SELECT ROWID, name, email, phone, message, createdAt FROM ContactSubmissions ORDER BY createdAt DESC';
      const result = await zcql.executeZCQLQuery(query);
      
      if (!result || result.length === 0) return [];
      
      return result.map((item: any) => {
        const row = item.ContactSubmissions;
        return {
          id: parseInt(row.ROWID),
          name: row.name,
          email: row.email,
          phone: row.phone,
          message: row.message || null,
          createdAt: new Date(row.createdAt)
        };
      });
    } catch (error) {
      console.error('getContactSubmissions error:', error);
      return [];
    }
  }
}

export const storage = new CatalystStorage();
```

### 3.3 Update server/routes.ts for Catalyst

Modify your routes to pass the request object to Catalyst:

```typescript
// At the top of server/routes.ts
import { setCatalystRequest } from './storage-catalyst';

// Add middleware before your routes
app.use((req, res, next) => {
  setCatalystRequest(req);
  next();
});
```

### 3.4 Switch Storage Implementation

When deploying to Catalyst, update your imports:

```typescript
// For Catalyst deployment, change:
import { storage } from './storage';

// To:
import { storage, setCatalystRequest } from './storage-catalyst';
```

### 3.5 Important Notes

1. **ROWID**: Catalyst uses `ROWID` as the auto-generated primary key (similar to `id` in PostgreSQL)
2. **ZCQL**: Catalyst's query language is similar to SQL but with some differences
3. **Request Context**: Catalyst SDK needs the Express request object to authenticate
4. **Data Types**: Use Text for most fields; Catalyst will handle conversion

---

## Step 4: Initial Deployment

Deploy your app first to create the AppSail service in Catalyst Console.

### 4.1 Build the Application

```bash
npm run build:catalyst
```

### 4.2 Deploy to Catalyst

```bash
catalyst deploy
```

The CLI will:
1. Upload your code
2. Run the build command
3. Deploy to Catalyst's infrastructure
4. Provide a live URL

After deployment, you'll receive a URL like:
```
https://your-project.zohocatalyst.com
```

**Note:** The app may not work correctly yet because environment variables are not configured. That's expected - we'll add them in the next step.

---

## Step 5: Configure Environment Variables

Now that your AppSail app exists in the Console, you can configure environment variables.

### 5.1 Open Configuration in Catalyst Console

Go to **Catalyst Console** → **Your AppSail App** → **Configuration** tab → **Environment Variables**

### 5.2 Add Environment Variables

Click **Create Variable** to add each variable. You can set different values for Development and Production environments using the dropdown at the top.

Add the following (no database URL needed when using Catalyst Data Store):

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `RECAPTCHA_SECRET_KEY` | `your-recaptcha-secret` |
| `VITE_RECAPTCHA_SITE_KEY` | `your-recaptcha-site-key` |
| `SESSION_SECRET` | `your-session-secret` |

### 5.3 Redeploy with Environment Variables

After adding environment variables, redeploy your app:

```bash
catalyst deploy
```

### 5.4 Verify Deployment

Visit your app URL to verify the website is working correctly with environment variables configured.

### 5.5 Access in Code

Environment variables are automatically available via `process.env`:

```javascript
const secretKey = process.env.RECAPTCHA_SECRET_KEY;
```

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

## Step 7: Verify Data Store Tables

After deployment, verify your tables are created in Catalyst Console:

1. Go to **Catalyst Console** → **Data Store**
2. Confirm **Users** and **ContactSubmissions** tables exist
3. Check column definitions match the schema above

No manual migration is needed - Catalyst Data Store tables are created through the console.

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
├── catalyst-index.ts      # Catalyst entry point
├── package.json
├── dist/                  # Built application
│   ├── public/           # Frontend assets
│   └── *.js              # Backend code
├── client/               # React source
├── server/               # Express source
│   └── storage-catalyst.ts  # Catalyst Data Store implementation
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
