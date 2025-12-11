# ITRONIX-2K26 Deployment Checklist

## Pre-Deployment

- [ ] Test all routes locally (`npm run dev`)
- [ ] Verify hero background (no white strip)
- [ ] Test registration form with validation
- [ ] Check mobile responsiveness
- [ ] Verify animations with Lighthouse
- [ ] Update event/workshop data in JSON files
- [ ] Add sponsor logos and names
- [ ] Configure email contact details

## Vercel Deployment

### 1. Connect Repository

\`\`\`bash
# Push code to GitHub
git add .
git commit -m "Production-ready ITRONIX-2K26"
git push origin main
\`\`\`

### 2. Link to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import GitHub repository
4. Click "Deploy"

### 3. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

\`\`\`
SENDGRID_API_KEY = sk-...
NEXT_PUBLIC_GA_ID = G-...
\`\`\`

**Optional:** If variables are not set, the site still works with fallback behavior.

### 4. Configure Domain

1. Vercel Dashboard → Domains
2. Add custom domain: `itronix2k26.com` (or your domain)
3. Update DNS records (if applicable)
4. SSL certificate auto-generates

## Post-Deployment

- [ ] Test all pages on production domain
- [ ] Verify forms submit correctly
- [ ] Check Google Analytics (if configured)
- [ ] Test email notifications (if SendGrid configured)
- [ ] Lighthouse audit (target: 90+ Accessibility)
- [ ] Mobile device testing
- [ ] Share with team

## Monitoring

### Analytics
- Check user traffic and engagement
- Monitor registration submissions
- Track page performance

### Error Tracking
- Monitor Vercel analytics dashboard
- Check error logs in Vercel dashboard
- Review form submission rates

### Email Delivery
- Verify confirmation emails reach participants
- Monitor SendGrid delivery reports
- Check spam filters

## Scaling (If Needed)

- Database integration for storing registrations
- Rate limiting on `/api/register` endpoint
- Caching strategy for static pages
- CDN optimization for images

## Rollback

If issues occur:

\`\`\`bash
# Revert to previous deployment
# Go to Vercel Dashboard → Deployments
# Click the previous successful build
# Click "Promote to Production"
\`\`\`

## Support & Maintenance

- **Contact Email:** itronix@gurunanak.edu.in
- **Issues:** Create GitHub issues in repository
- **Feedback:** File feature requests on GitHub

## Performance Targets

- **Lighthouse Performance:** 60+
- **Lighthouse Accessibility:** 90+
- **Lighthouse SEO:** 90+
- **First Contentful Paint:** < 1.5s
- **Cumulative Layout Shift:** < 0.1

## Security

- HTTPS enabled by default on Vercel
- No sensitive data in environment variables
- Form validation on client & server
- CORS headers properly configured
- CSP (Content Security Policy) headers set

---

Ready to go live! 🚀
