# Krishisense

Production-ready farmer soil analysis app with secure auth, Gemini multimodal soil photo classification, MongoDB persistence, Cloudinary image storage, and admin review dashboards.

## What It Does

- Farmers register/login with JWT authentication.
- Farmers upload soil photos plus crop/land details.
- Gemini analyzes uploaded photos and returns soil type, confidence, risk, nutrients, irrigation guidance, and recommendations.
- Cloudinary stores uploaded soil images permanently.
- MongoDB stores users, reports, statuses, AI results, and image metadata.
- Each farmer can add multiple farms and switch between farm-specific soil reports, loans, market orders, disease checks, and insurance.
- Farmers can create crop activity tasks, set due dates, and track completion separately for each farm.
- Admins review reports, users, loans, insurance, and report status.

## Required Services

Create these before deploying:

- MongoDB Atlas database and connection string.
- Cloudinary account with cloud name, API key, API secret.
- Google AI Studio Gemini API key.
- Cloudflare Turnstile widget with a site key and secret key (required for production login and signup).
- Render or Vercel project connected to `PlatBoy/krishsense`.

Configure secrets such as `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `MONGODB_URI` in the host's environment settings. Do not commit credentials to the repository.

Create a Cloudflare Turnstile widget for the domains where the app will run, then set `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in the host environment. Keep the secret key private. Production login and signup fail closed until both are configured; challenge tokens are verified server-side and are checked for the expected form action and hostname. Login and signup also have separate rate limits.

For local development, leave both Turnstile variables unset to disable the challenge. Cloudflare's [Turnstile docs](https://developers.cloudflare.com/turnstile/get-started/) explain how to create and test a widget.

Existing farmer accounts get a default farm created the first time they sign in after this update. Their existing records are assigned to that farm.
