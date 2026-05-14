# WITA Website

## Local setup
1. Install dependencies:
   - `npm install`
2. Copy env template:
   - `cp .env.example .env.local`
3. Start dev server:
   - `npm run dev:clean`

Note:
- The project is tested on Node 22 LTS.
- On newer Node versions (for example Node 26), startup now warns but still continues.

## Admin dashboard
The admin portal is now a single control center with a side menu:
- KPI Dashboard
- Manage News
- Manage Events
- Gallery Uploads
- API Health

Route:
- `/admin/dashboard`

## OAuth security
Admin access is protected with Google OAuth and an email allowlist.

Protected pages:
- `/admin`
- `/admin/dashboard`
- `/admin/news` (redirects to `/admin/dashboard`)

Protected APIs:
- `GET /api/admin/dashboard`
- `GET /api/admin/health`
- `GET /api/contact-messages`
- `GET /api/newsletter-subscribers`
- `POST /api/news`
- `PUT /api/news/:id`
- `DELETE /api/news/:id`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `GET /api/gallery`
- `POST /api/gallery/upload`
- `DELETE /api/gallery/:id`

Public APIs used by website pages/forms:
- `GET /api/news`
- `GET /api/events`
- `POST /api/contact-messages`
- `POST /api/newsletter-subscribers`

## Localhost bypass (temporary)
If you need to work locally before OAuth is configured, you can bypass admin auth checks only in local dev:
- Set `WITA_DEV_BYPASS_ADMIN=1` in `.env.local`
- Keep `NEXTAUTH_URL` on localhost (for example `http://localhost:3000`)

Safety guard:
- Bypass is automatically disabled in production (`NODE_ENV=production`)
- Bypass only activates when `NEXTAUTH_URL` points to localhost

## Required environment variables
Set these in `.env.local`:
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `WITA_ADMIN_EMAILS` (comma-separated admin emails)

Example:
- `WITA_ADMIN_EMAILS=admin@womenintourismafrica.com,ops@womenintourismafrica.com`

## Google OAuth callback URL
In Google Cloud Console, add:
- `http://localhost:3000/api/auth/callback/google`

Production example:
- `https://your-domain.com/api/auth/callback/google`
