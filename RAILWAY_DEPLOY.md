<!-- @format -->

# Railway Deployment Guide

## Frontend Deployment

This frontend is configured to deploy on Railway automatically.

### Configuration Files:

- `nixpacks.toml` - Railway build configuration
- `railway.json` - Alternative Railway configuration
- `.env.production` - Production environment variables

### Build Process:

1. Railway runs `npm run build` to create production bundle
2. Railway serves the app using `npm run preview` on the assigned PORT
3. App is available at the Railway-provided URL

### Environment Variables to Set in Railway:

```
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
VITE_APP_TITLE=Falcon Security Limited
VITE_APP_DESCRIPTION=Professional Security Guard Services
NODE_ENV=production
```

### Manual Deploy Commands:

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Start production server (used by Railway)
npm start
```

### Docker Deployment:

If using Dockerfile (Railway auto-detects this):
- Fixed Docker build to install all dependencies including TypeScript
- Uses `npm ci` (not `--only=production`) to get build tools
- Builds app with `npm run build` then serves with `npm run preview`

### Troubleshooting:

- **Build fails with "tsc: not found"**: Fixed in Dockerfile - now installs all deps
- Ensure PORT environment variable is available (Railway provides this)
- Make sure VITE_API_BASE_URL points to your deployed backend
- Check that all environment variables are set in Railway dashboard
- If nixpacks fails, Railway will automatically try Dockerfile
