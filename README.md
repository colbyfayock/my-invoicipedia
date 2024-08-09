# Invoicipedia - Course Walkthrough

- Next.js
- Clerk
- Xata

## Getting Started

### Configure Environment Variables

```
XATA_DATABASE_URL=""

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""

NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/dashboard"

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
```

### Install Dependencies

```
npm install --legacy-peer-deps
```

`--legacy-peer-deps` is currently required because of conflicts due to the @rc versions of React and Next.js.

#### Clerk

* Enable Organizations

#### Xata

* Enable Postgres when creating new database

### Generate & Run Migrations

```
npx drizzle-kit generate -- dotenv_config_path='.env.local'
npx drizzle-kit push -- dotenv_config_path='.env.local'
```

### Start Application

```
npm run dev
```

And your app will now be available at http://localhost:3000!