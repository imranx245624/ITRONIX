# ITRONIX-2K26 — A Simulated Future

Official website for Guru Nanak College's annual techfest **ITRONIX-2K26** (March 20–22, 2026).

## 🚀 Features

- **Multi-Route Architecture** — Separate pages for Home, Events, Workshops, Sponsors, and Registration
- **Canvas Hero Animation** — Neon particles, holographic blobs, and grid overlays with parallax effects
- **Responsive Design** — Mobile-first, optimized for all devices (320px–1280px+)
- **Framer Motion Animations** — Smooth entrance, hover, and scroll-triggered animations
- **Registration Form** — Client-side validation, SendGrid email integration with fallback
- **SEO Optimized** — Meta tags, Open Graph, sitemap, robots.txt
- **Accessibility** — WCAG 2.1 AA compliant, keyboard navigation, ARIA labels
- **Performance** — <600KB payload, Lighthouse 90+ accessibility score

## 📋 Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4** — Custom theme with neon palette
- **Framer Motion** — Advanced animations
- **TypeScript** — Type-safe development
- **Google Fonts** — Rajdhani, Poppins, JetBrains Mono

## 🎨 Color Palette

| Name | Hex | Purpose |
|------|-----|---------|
| Deep Night | `#04040B` | Background |
| Neon Cyan | `#00D1C1` | Primary accent |
| Neon Magenta | `#FF4EC8` | Secondary accent |
| Cyber Orange | `#FF8C42` | Tertiary accent |
| Holo Pale | `#C8FFF1` | Light accents |
| Muted Text | `#B9DDF0` | Body text |

## 📁 Project Structure

\`\`\`
app/
├── api/
│   └── register/route.ts      # Registration form API endpoint
├── layout.tsx                  # Root layout with fonts & metadata
├── globals.css                 # Global styles & theme variables
├── page.tsx                    # Home page (Hero + Highlights)
├── events/page.tsx             # Events page with schedule
├── workshops/page.tsx          # Workshops page
├── sponsors/page.tsx           # Sponsors & packages page
└── register/page.tsx           # Registration page

components/
├── Header.tsx                  # Navigation & branding
├── Hero.tsx                    # Canvas animation + title reveal
├── Highlights.tsx              # Key highlights grid (home)
├── EventsPage.tsx              # Events page content + schedule
├── EventCard.tsx               # Individual event card
├── WorkshopsPage.tsx           # Workshops page content
├── WorkshopCard.tsx            # Individual workshop card
├── SponsorsPage.tsx            # Sponsor packages & logos page
├── RegisterPage.tsx            # Registration page wrapper
├── RegisterForm.tsx            # Form component with validation
└── Footer.tsx                  # Footer with links

data/
├── events.json                 # Events database
└── workshops.json              # Workshops database

utils/
└── canvas-animation.ts         # Canvas animation logic

public/
├── sitemap.xml                 # SEO sitemap
├── robots.txt                  # SEO robots directive
├── og-image.jpg                # OpenGraph image (1200x630)
└── [other assets]
\`\`\`

## 🗺️ Routes

| Route | Purpose |
|-------|---------|
| `/` | Home with hero and highlights |
| `/events` | Featured events with 3-day schedule |
| `/workshops` | Learning workshops |
| `/sponsors` | Sponsorship packages and partners |
| `/register` | Registration form (supports `?event=X` and `?workshop=Y` params) |

## 🚀 Deployment

### On v0.app
1. Create a new Next.js project
2. Install dependencies: `framer-motion`
3. Set environment variables (see below)
4. Deploy to Vercel with one click

### Environment Variables

\`\`\`env
# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=G_XXXXXXXXXX

# Optional: SendGrid Email
SENDGRID_API_KEY=sg-...
\`\`\`

**Note:** Site works perfectly without these variables. Emails fallback to console logging.

## 📧 Registration Email Setup

The registration form includes SendGrid integration with automatic fallback:

### Without Environment Variables
- ✅ Form accepts submissions
- ✅ Client-side validation works
- ✅ Emails logged to console (development mode)
- ✅ No errors or blocking

### With SendGrid API Key
- ✅ Personalized confirmation emails to participants
- ✅ Admin notifications to itronix@gurunanak.edu.in
- ✅ Full registration details in email body
- ✅ Professional email templates

### Setup SendGrid (Optional)

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Generate API key
3. Add to Vercel environment variables: `SENDGRID_API_KEY=sk-...`
4. Update sender email in `/app/api/register/route.ts` if needed

## 🔧 Customization

### Update Events
Edit `/data/events.json`:

\`\`\`json
{
  "id": "unique-id",
  "title": "Event Name",
  "description": "Event description",
  "team_size": 4,
  "prize": "₹30,000"
}
\`\`\`

### Update Workshops
Edit `/data/workshops.json` or modify `/components/WorkshopsPage.tsx` directly.

### Update Sponsors
Modify `/components/SponsorsPage.tsx` to add sponsor logos and update tier pricing.

### Change Colors
Update CSS variables in `/app/globals.css`:

\`\`\`css
:root {
  --deep-night: #04040B;
  --neon-cyan: #00D1C1;
  --neon-magenta: #FF4EC8;
  --cyber-orange: #FF8C42;
  --holo-pale: #C8FFF1;
  --muted-text: #B9DDF0;
}
\`\`\`

### Update Fonts
Modify font imports in `/app/layout.tsx` and update `/app/globals.css` @theme section.

## 📊 Performance Targets

- **Lighthouse Accessibility:** 90+
- **Lighthouse Performance:** 70+
- **First Contentful Paint:** <1.5s
- **Cumulative Layout Shift:** <0.1

## ♿ Accessibility

- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen reader support with ARIA labels
- ✅ `prefers-reduced-motion` respected
- ✅ Color contrast WCAG AA compliant
- ✅ Semantic HTML structure
- ✅ Form validation with error messages
- ✅ Proper heading hierarchy

## 🐛 Troubleshooting

### White strip showing on hero
- Verify `bg-deep-night` class is on hero section
- Check that dark gradient overlay is applied
- Clear browser cache and reload

### Navigation not working
- Ensure all route pages exist in `/app`
- Verify imports use `next/link` component
- Check browser console for routing errors

### Form submissions failing
- Check API endpoint `/api/register` is working
- Verify phone field is not empty (required field)
- Check network tab in DevTools for 400/500 errors

### Emails not sending
- Verify `SENDGRID_API_KEY` is set in environment
- Check SendGrid dashboard for delivery status
- Without the key, emails log to console

### Animations stuttering
- Reduce particle count in `/utils/canvas-animation.ts`
- Check DevTools Performance tab for bottlenecks
- Verify GPU acceleration is enabled

## 📄 License

© 2026 ITRONIX-2K26 — Guru Nanak College of Arts, Science & Commerce

## 📞 Support

For issues or questions:
- Email: itronix@gurunanak.edu.in
- GitHub Issues: (add your repo)

---

**Built with ❤️ using Next.js, Tailwind CSS, and Framer Motion**
