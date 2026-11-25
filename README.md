<p align="center">
    <img src="backend/assets/generallogo.png" alt="Sliwka logo" width="96" />
</p>

<h1 align="center">E-Commerce Sliwka</h1>

<h3 align="center">An electronics online store with Stripe checkout and a role-based admin panel.</h3>

<p align="center">
    <a href="https://github.com/EisOokami/E-CommerceSliwka/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/EisOokami/E-CommerceSliwka?style=social" /></a>
    <a href="https://github.com/EisOokami/E-CommerceSliwka/commits"><img alt="Last commit" src="https://img.shields.io/github/last-commit/EisOokami/E-CommerceSliwka" /></a>
    <a href="./LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen" /></a>
    <a href="https://github.com/EisOokami"><img alt="Made by EisOokami" src="https://img.shields.io/badge/made%20by-EisOokami-ff69b4" /></a>
</p>

<h4 align="center">🚧 Status: in active development 🚧</h4>

<p align="center">
    <a href="#about">About</a> •
    <a href="#features">Features</a> •
    <a href="#started">Getting Started</a> •
    <a href="#tech">Tech Stack</a> •
    <a href="#contribute">Contribute</a> •
    <a href="#author">Author</a> •
    <a href="#license">License</a>
</p>

<h2 id="about">📖 About</h2>

**Sliwka** is a full-stack online store for electronics: smartphones, smartwatches, cameras, headphones, computers, laptops and gaming gear. Customers browse the catalog, compare product variants, keep a wishlist and pay through Stripe Checkout. Store staff manage products, orders, customers and coupons in a separate admin panel with roles, permissions and an audit log.

The repository contains two applications:

| Folder      | What it is                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------- |
| `frontend/` | Next.js app: the storefront and the admin panel at `/admin`                                       |
| `backend/`  | Express REST API on PostgreSQL (Drizzle ORM): store, checkout, admin, uploads and background jobs |

<h2 id="started">🚀 Getting Started</h2>

<h3>Prerequisites</h3>

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/) 22 or newer with npm
- [PostgreSQL](https://www.postgresql.org/) 18 or newer (the schema uses the built-in `uuidv7()` function)
- A [Stripe](https://stripe.com/) account; a test secret key is enough for development
- Optional: a Google OAuth client (Google sign-in), an SMTP mailbox (verification emails) and a [Gemini API key](https://ai.google.dev/) (AI helpers)

<h3>Cloning</h3>

```bash
git clone https://github.com/EisOokami/E-CommerceSliwka.git
cd E-CommerceSliwka
```

<h3>Installing dependencies</h3>

Each application has its own `package.json`; the root one only holds release tooling.

```bash
npm --prefix backend install
npm --prefix frontend install
```

<h3>Environment variables</h3>

**Backend** (`backend/.env`, commented template: `backend/.env.example`)

| Variable                                                          | Description                                                                                                                                                                                                                                                                        |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`, `PORT`                                                | Runtime mode and API port (`3001`)                                                                                                                                                                                                                                                 |
| `DATABASE_URL`                                                    | PostgreSQL connection string, e.g. `postgres://user:password@localhost:5432/sliwka`                                                                                                                                                                                                |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`                         | Secrets for signing customer access and refresh tokens                                                                                                                                                                                                                             |
| `CSRF_SECRET`                                                     | Secret for CSRF tokens                                                                                                                                                                                                                                                             |
| `COOKIE_SECRET`                                                   | Secret for signed admin cookies, at least 32 characters                                                                                                                                                                                                                            |
| `MFA_ENCRYPTION_KEY`                                              | Base64-encoded 32-byte key that encrypts 2FA secrets (`openssl rand -base64 32`)                                                                                                                                                                                                   |
| `ADMIN_ORIGINS`                                                   | Comma-separated exact origins allowed to call the admin API (HTTPS in production)                                                                                                                                                                                                  |
| `FRONTEND_URL`                                                    | Public storefront URL, used for redirects and Stripe return URLs                                                                                                                                                                                                                   |
| `TERMS_VERSION`, `PRIVACY_VERSION`                                | Versions of the Terms of Service and Privacy Policy published at `/terms` and `/privacy` (e.g. `1.0`). After a bump every account accepts the new versions: at the next password or Google sign-in, or in a dialog if it is already signed in. The API does not start without them |
| `CORS_URLS`, `HOSTS`                                              | Comma-separated allowed origins and hosts                                                                                                                                                                                                                                          |
| `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD`                   | Mailbox used by Nodemailer (`EMAIL_SERVICE` is a Nodemailer well-known service such as `gmail`)                                                                                                                                                                                    |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`                        | Optional: any SMTP server instead of `EMAIL_SERVICE`, e.g. a transactional e-mail provider with a data processing agreement. Port defaults to `587`; set `EMAIL_SECURE=true` for implicit TLS (port `465`)                                                                         |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | Google sign-in. The redirect URI is `<API URL>/api/auth/google/callback`                                                                                                                                                                                                           |
| `STRIPE_KEY`                                                      | Stripe **test-mode** secret key (`sk_test_...` or `rk_test_...`). This is a demo store: the API refuses to start with a live key. Leave empty to disable checkout                                                                                                                  |
| `STRIPE_AUTOMATIC_TAX`, `STRIPE_SHIPPING_RATE_IDS`                | Optional: set `true` to turn on Stripe Tax (off by default, because it makes Stripe ask for the customer's address); comma-separated shipping rate IDs                                                                                                                             |
| `GEMINI_API_KEY`, `GEMINI_MODEL`                                  | AI helpers in the admin panel                                                                                                                                                                                                                                                      |
| `UPLOAD_DIR`, `MAX_IMAGE_BYTES`                                   | Where uploaded images are stored (`./uploads`) and the size limit (5 MB by default)                                                                                                                                                                                                |
| `TRUST_PROXY`                                                     | Comma-separated addresses or subnets of trusted proxies in front of the API, e.g. the Next.js server (`loopback`, `172.18.0.0/16`). Only these may set `X-Forwarded-For`; takes precedence over `TRUST_PROXY_HOPS`                                                                 |
| `TRUST_PROXY_HOPS`                                                | Legacy: number of trusted hops. Spoofable if the API is reachable directly, prefer `TRUST_PROXY`                                                                                                                                                                                   |

**Frontend** (`frontend/.env`, commented template: `frontend/.env.example`)

| Variable                                                                                                               | Description                                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `API_URL`                                                                                                              | API address used by the Next.js server, e.g. `http://localhost:3001`                                                                                                                                                                                                                                                      |
| `ADMIN_API_ORIGIN`                                                                                                     | Optional: API address for the admin panel and fallback for `API_URL`                                                                                                                                                                                                                                                      |
| `NEXT_PUBLIC_API_URL`                                                                                                  | Public API address used by the browser for Google sign-in (`<NEXT_PUBLIC_API_URL>/api/auth/google`). Without it the " Continue with Google" button is hidden. Set the API's `GOOGLE_REDIRECT_URI` to `<API URL>/api/auth/google/callback` and its `FRONTEND_URL` to the storefront, which finishes sign-in at `/callback` |
| `ADMIN_CLIENT_IP_HEADER`                                                                                               | Optional: header with the real client IP when the app runs behind a proxy (admin rate limits)                                                                                                                                                                                                                             |
| `CLIENT_IP_HEADER`                                                                                                     | Header set by the reverse proxy in front of Next.js with the real client IP (e.g. `x-real-ip`). It is forwarded to the API so rate limits count each customer separately. Next.js must be reachable only through that proxy                                                                                               |
| `NEXT_PUBLIC_SITE_URL`                                                                                                 | Public address of the store, shown in the Privacy Policy (`/privacy`) and Terms of Service (`/terms`)                                                                                                                                                                                                                     |
| `TERMS_VERSION`, `PRIVACY_VERSION`                                                                                     | Versions shown on `/terms` and `/privacy` (default `1.0`). Keep them equal to the API values                                                                                                                                                                                                                              |
| `LEGAL_OPERATOR`, `LEGAL_CONTACT_EMAIL`                                                                                | Operator (data controller) and contact e-mail named in `/privacy` and `/terms`                                                                                                                                                                                                                                            |
| `LEGAL_SERVER_PROVIDER`, `LEGAL_BACKUP_RETENTION`, `LEGAL_STRIPE_ENTITY`                                               | Server provider and country, backup retention and the Stripe contracting entity named in the documents. Empty `LEGAL_*` values are shown on the pages as highlighted `[DO UZUPEŁNIENIA: …]` placeholders. The defaults live in `frontend/src/components/layout/main/legalDocument/LegalDocument.tsx`                      |
| `LEGAL_LAST_TERMS_UPDATED`, `LEGAL_EFFECTIVE_TERMS_DATE`, `LEGAL_LAST_PRIVACY_UPDATED`, `LEGAL_EFFECTIVE_PRIVACY_DATE` | Dates shown in the Terms of Service and Privacy Policy, e.g. `20 listopada 2026 r.`                                                                                                                                                                                                                                       |
| `LEGAL_REPOSITORY_URL`, `LEGAL_LICENSE_URL`                                                                            | Repository and license links in the Terms of Service (default: `github.com/EisOokami/ECommerceSliwka`)                                                                                                                                                                                                                    |

<h3>Preparing the database</h3>

Create an empty PostgreSQL database, point `DATABASE_URL` at it and create the schema:

```bash
npm --prefix backend run db:initialize
```

On an existing database, apply new migrations with:

```bash
npm --prefix backend run db:migrate
```

> [!NOTE]
> There is no sign-up form for administrators. The first super admin has to be added to the `admins` table manually; after that, super admins create other administrators in the panel.

<h3>Starting</h3>

Start the API in one terminal:

```bash
npm --prefix backend run dev        # or: npm --prefix backend run build && npm --prefix backend start
```

Start the web app in a second terminal:

```bash
npm --prefix frontend run dev
```

Open [http://localhost:3000](http://localhost:3000) for the store and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

<h3>Useful scripts</h3>

| Where       | Command                              | What it does                           |
| ----------- | ------------------------------------ | -------------------------------------- |
| `backend/`  | `npm run dev`                        | Start the API with hot reload          |
| `backend/`  | `npm run build` / `npm start`        | Compile TypeScript and run `dist/`     |
| `backend/`  | `npm run db:initialize`              | Create the schema in an empty database |
| `backend/`  | `npm run db:migrate`                 | Apply pending SQL migrations           |
| `backend/`  | `npm run lint` / `npm run typecheck` | ESLint and TypeScript checks           |
| `frontend/` | `npm run dev`                        | Start Next.js with Turbopack           |
| `frontend/` | `npm run build` / `npm start`        | Production build and server            |
| `frontend/` | `npm run lint` / `npm run typecheck` | ESLint and TypeScript checks           |

<h2 id="tech">💻 Tech Stack</h2>

#### **Frontend** ([Next.js 15](https://nextjs.org/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/))

- **[Tailwind CSS](https://tailwindcss.com/)** and **[Sass](https://sass-lang.com/)** for styling
- **[Zustand](https://zustand.docs.pmnd.rs/)** for client state
- **[Zod](https://zod.dev/)** for validation
- **[Recharts](https://recharts.org/)** for admin charts
- **[Embla Carousel](https://www.embla-carousel.com/)** and **[Splide](https://splidejs.com/)** for sliders
- **[React Photo View](https://github.com/MinJieLiu/react-photo-view)**, **[React Responsive Pagination](https://github.com/jonelantha/react-responsive-pagination)**, **[React Accordion](https://szhsin.github.io/react-accordion/)**, **[Sonner](https://sonner.emilkowal.ski/)** and **[React Icons](https://react-icons.github.io/react-icons/)**

> See [frontend/package.json](./frontend/package.json)

#### **Backend** ([Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/))

- **[PostgreSQL](https://www.postgresql.org/)** with **[Drizzle ORM](https://orm.drizzle.team/)** and **[node-postgres](https://node-postgres.com/)**
- **[Stripe](https://stripe.com/docs/api)** for payments
- **[jose](https://github.com/panva/jose)** (JWT), **[Argon2](https://github.com/ranisalt/node-argon2)**, **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)**, **[otplib](https://github.com/yeojz/otplib)** and **[qrcode](https://github.com/soldair/node-qrcode)** for authentication and 2FA
- **[Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs)** for Google sign-in
- **[Google Gen AI SDK](https://github.com/googleapis/js-genai)** for the AI helpers
- **[Multer](https://github.com/expressjs/multer)**, **[file-type](https://github.com/sindresorhus/file-type)** and **[Sharp](https://sharp.pixelplumbing.com/)** for image uploads
- **[Nodemailer](https://nodemailer.com/)** for emails
- **[Helmet](https://helmetjs.github.io/)**, **[express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)**, **[hpp](https://github.com/analog-nico/hpp)**, **[host-validation](https://github.com/brannondorsey/host-validation)**
- **[Zod](https://zod.dev/)** with **[drizzle-zod](https://orm.drizzle.team/docs/zod)** for validation

> See [backend/package.json](./backend/package.json)

#### **Utils**

- Releases: **[semantic-release](https://semantic-release.gitbook.io/)**
- Code style: **[ESLint](https://eslint.org/)**, **[Prettier](https://prettier.io/)**

<h2 id="contribute">📫 Contribute</h2>

1. Fork the project and clone your fork
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/) (`feat: ...`, `fix: ...`); releases are generated from them
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request that explains the problem or feature, and add screenshots for visual changes

The repository includes templates for [bug reports, feature requests](./.github/ISSUE_TEMPLATE) and [pull requests](./.github/PULL_REQUEST_TEMPLATE.md).

<h3>Documentation that might help</h3>

[📝 How to create a Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)

[💾 Commit pattern](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)

<h2 id="author">👤 Author</h2>

<table>
    <tr>
        <td align="center">
            <a href="https://github.com/EisOokami">
                <img src="https://github.com/EisOokami.png" width="100" alt="EisOokami" /><br />
                <sub><b>EisOokami</b></sub>
            </a>
        </td>
    </tr>
</table>

<h2 id="license">📝 License</h2>

This project is distributed under the [MIT License](./LICENSE).
