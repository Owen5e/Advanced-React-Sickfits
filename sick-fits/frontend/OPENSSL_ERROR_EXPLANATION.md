# OpenSSL Error Explanation and Solutions

## What's Happening

You're encountering an OpenSSL compatibility error between:

- **Node.js v22.13.0** (very recent version)
- **Next.js v10.0.3** (older version from your package.json)

The error `error:0308010C:digital envelope routines::unsupported` occurs because:

1. **Node.js v17+** updated to OpenSSL v3.0, which deprecated certain legacy cryptographic algorithms
2. **Next.js v10.0.3** (released in 2020) uses Webpack 5 with older cryptographic functions
3. The older hashing algorithms used by Webpack are no longer supported in newer OpenSSL versions

## Solutions (Choose One)

### Option 1: Use Legacy OpenSSL Provider (Quick Fix)

Add the `--legacy-openssl-provider` flag to your Node.js commands:

```json
"scripts": {
  "dev": "NODE_OPTIONS='--openssl-legacy-provider' next -p 7777",
  "build": "NODE_OPTIONS='--openssl-legacy-provider' next build",
  "start": "NODE_OPTIONS='--openssl-legacy-provider' next start -p 7777"
}
```

### Option 2: Downgrade Node.js (Temporary Solution)

Use Node.js v16.x or earlier:

- Install Node.js v16 LTS
- Or use nvm to switch: `nvm use 16`

### Option 3: Upgrade Next.js (Recommended Long-term)

Upgrade to Next.js v12+ which has better OpenSSL v3 compatibility:

```bash
npm install next@latest react@latest react-dom@latest
```

**Note:** This may require updating other dependencies and potentially refactoring some code.

### Option 4: Use .nvmrc File

Create a `.nvmrc` file to lock Node.js version for this project:

```
16.20.2
```

Then run: `nvm use`

## Recommended Approach

For immediate development: Use **Option 1** (legacy provider flag)
For long-term maintenance: Plan to upgrade to **Option 3** (newer Next.js)
