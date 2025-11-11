# Deployment Guide

This guide covers deploying the CSV Runner Dashboard to various platforms.

## Quick Deploy Options

### 1. Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications and is built by the creators of Next.js.

#### Prerequisites
- GitHub account
- Vercel account (free tier available)

#### Steps

**Option A: Deploy from GitHub**
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/csv-runner-dashboard.git
   git push -u origin main
   ```

2. Visit [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"

**Option B: Deploy with Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts, and your app will be live in minutes!

**Custom Domain (Optional)**
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as instructed

---

### 2. Netlify

#### Steps
1. Build the project:
   ```bash
   npm run build
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```

4. Follow prompts:
   - Build command: `npm run build`
   - Publish directory: `.next`

---

### 3. GitHub Pages (Static Export)

GitHub Pages can host static sites. We'll need to configure Next.js for static export.

#### Configuration Changes

1. Update `next.config.js`:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
     basePath: '/csv-runner-dashboard', // Replace with your repo name
   };
   
   module.exports = nextConfig;
   ```

2. Build static export:
   ```bash
   npm run build
   ```

3. Deploy to GitHub Pages:
   ```bash
   # Install gh-pages
   npm install --save-dev gh-pages
   
   # Add to package.json scripts
   "deploy": "gh-pages -d out"
   
   # Deploy
   npm run deploy
   ```

4. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Source: `gh-pages` branch
   - Save

---

### 4. Docker Deployment

For containerized deployment on any platform.

#### Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Create .dockerignore

```
# .dockerignore
node_modules
.next
.git
.gitignore
README.md
.env*.local
```

#### Build and Run

```bash
# Build
docker build -t csv-runner-dashboard .

# Run
docker run -p 3000:3000 csv-runner-dashboard
```

---

### 5. AWS Amplify

#### Steps
1. Push code to GitHub
2. Go to AWS Amplify Console
3. Click "New App" → "Host web app"
4. Connect GitHub repository
5. Build settings (auto-detected):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
6. Deploy

---

### 6. Railway

#### Steps
1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Initialize and deploy:
   ```bash
   railway init
   railway up
   ```

---

### 7. DigitalOcean App Platform

#### Steps
1. Push code to GitHub
2. Go to DigitalOcean → App Platform
3. Create New App
4. Connect GitHub repository
5. Configure:
   - Build Command: `npm run build`
   - Run Command: `npm start`
6. Deploy

---

## Environment Variables

This application doesn't require any environment variables for core functionality. However, if you add features like analytics or API integrations, document them here:

```bash
# .env.example
# NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id_here
```

---

## Build Optimization

### Production Build
```bash
npm run build
```

This creates an optimized production build in `.next/` directory.

### Performance Tips
1. **Enable Compression**: Most hosting platforms enable gzip/brotli automatically
2. **CDN**: Use a CDN for static assets (Vercel/Netlify do this automatically)
3. **Caching**: Leverage browser caching for static resources

---

## Monitoring & Analytics

### Add Analytics (Optional)

**Google Analytics**
1. Install package:
   ```bash
   npm install @next/third-parties
   ```

2. Add to `app/layout.tsx`:
   ```tsx
   import { GoogleAnalytics } from '@next/third-parties/google'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>{children}</body>
         <GoogleAnalytics gaId="G-XXXXXXXXXX" />
       </html>
     )
   }
   ```

**Vercel Analytics**
```bash
npm install @vercel/analytics
```

Add to layout:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## Troubleshooting

### Build Fails
- Ensure all dependencies are in `package.json`
- Check Node.js version (v18+ required)
- Clear cache: `rm -rf .next node_modules && npm install`

### Runtime Errors
- Check browser console for errors
- Verify CSV parsing works with sample data
- Ensure all imports are correct

### Performance Issues
- Reduce CSV file size
- Optimize chart rendering
- Use React.memo for expensive components

---

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] CSV upload works
- [ ] Charts render properly
- [ ] Error messages display correctly
- [ ] Mobile responsiveness verified
- [ ] Sample CSV downloads
- [ ] All links work
- [ ] Dark mode functions (if implemented)
- [ ] Accessibility tested (keyboard navigation)
- [ ] Browser compatibility checked

---

## Security Considerations

1. **No Server-Side Secrets**: This app processes everything client-side
2. **No Database**: No data persistence, no security concerns
3. **HTTPS**: Always use HTTPS in production (automatic on Vercel/Netlify)
4. **CSP Headers**: Consider adding Content Security Policy headers

Example CSP header (in `next.config.js`):
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};
```

---

## Maintenance

### Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

### Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor error rates (Sentry, LogRocket)
- Track performance (Lighthouse CI)

---

## Support & Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

---

**Last Updated**: November 2025