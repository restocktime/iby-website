# Deployment Guide for Isaac Benyakar Portfolio

This site is built with Astro and optimized for deployment on Cloudflare Pages.

## Quick Deployment to Cloudflare Pages

### Option 1: Git Integration (Recommended)
1. Push this repository to GitHub, GitLab, or Bitbucket
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** `18` or higher

### Option 2: Direct Upload
1. Run `npm run build` locally
2. Upload the `dist/` folder to Cloudflare Pages
3. Set up custom domain and SSL

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build locally
npm run preview

# Type checking
npm run type-check

# Lint check
npm run lint
```

## Configuration Checklist

### Before Deployment:
- [ ] Update Sanity project ID in `astro.config.mjs`
- [ ] Replace placeholder Calendly URL in `/contact` page
- [ ] Add actual project images to `/public` folder
- [ ] Update contact email and social links
- [ ] Review and update project data in `/src/data/projects.ts`

### Post-Deployment:
- [ ] Set up custom domain in Cloudflare Pages
- [ ] Configure SSL/TLS (automatic with Cloudflare)
- [ ] Test all pages and functionality
- [ ] Submit sitemap to Google Search Console
- [ ] Set up analytics (Google Analytics, Plausible, etc.)

## Performance Optimizations Included

✅ Static-first architecture with Astro
✅ Tailwind CSS for minimal bundle size
✅ Optimized headers for caching
✅ SEO-friendly URLs and meta tags
✅ Structured data (JSON-LD) for rich snippets
✅ Responsive images and lazy loading
✅ Security headers via `_headers` file

## Environment Variables

No environment variables are required for basic functionality. If you add Sanity CMS integration or analytics, you may need:

```env
# Optional - for enhanced Sanity integration
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production

# Optional - for analytics
GA_TRACKING_ID=your-ga-id
```

## Monitoring and Analytics

### Recommended Tools:
- **Performance:** Lighthouse CI, WebPageTest
- **Analytics:** Google Analytics 4, Plausible, or Fathom
- **Uptime:** Pingdom, UptimeRobot
- **Error Tracking:** Sentry (if adding dynamic features)

### Core Web Vitals Targets:
- **LCP:** < 2.5s
- **FID:** < 100ms  
- **CLS:** < 0.1
- **Speed Index:** < 3.0s

## SEO Optimization

### Included SEO Features:
- Semantic HTML structure
- Open Graph and Twitter meta tags
- JSON-LD structured data for Person, Organization, Service
- XML sitemap (auto-generated)
- Robots.txt with proper directives
- Canonical URLs
- Breadcrumb navigation

### Manual SEO Tasks:
1. Submit to Google Search Console
2. Create and submit sitemap
3. Set up Google My Business (if applicable)
4. Build backlinks from relevant sources
5. Monitor search performance and rankings

## Troubleshooting

### Build Errors:
- Ensure Node.js version is 18+
- Check for TypeScript errors with `npm run type-check`
- Verify all imports and file paths are correct

### Deployment Issues:
- Check Cloudflare Pages build logs
- Verify build output directory is `dist`
- Ensure all environment variables are set correctly

### Performance Issues:
- Run Lighthouse audit
- Check image sizes and formats
- Verify caching headers are working
- Test Core Web Vitals

## Content Updates

### Adding New Projects:
1. Update `/src/data/projects.ts`
2. Add project images to `/public/projects/`
3. Create individual project pages in `/src/pages/projects/`
4. Test build and deploy

### Updating Contact Information:
1. Update `/src/components/layout/Layout.astro` footer
2. Update `/src/pages/contact.astro` 
3. Update structured data in `/src/components/seo/StructuredData.astro`

## Support

For technical issues with this deployment:
1. Check Astro documentation: https://docs.astro.build
2. Check Cloudflare Pages docs: https://developers.cloudflare.com/pages
3. Review build logs for specific error messages

---

**Ready to launch?** Follow the deployment steps above and transform your online presence! 🚀