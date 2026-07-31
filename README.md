# Dylan's portfolio

A minimalist Next.js portfolio with a native content editor at `/edit`.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Fill in the three environment variables.
3. Run:

```bash
npm install
npm run dev
```

Without a Blob token, the public site still renders the built-in content. The
editor requires all three variables to publish or upload images.

## Deploy to Vercel

1. Import this GitHub repository into Vercel. Vercel detects Next.js
   automatically; leave the framework, build, and output settings at their
   defaults.
2. In the project dashboard, open **Storage**, create a **Public Blob** store,
   and connect it to this project. Vercel adds `BLOB_READ_WRITE_TOKEN`. The
   public store is intentional: it serves gallery images directly, and the JSON
   file contains only the same content already shown on the public site.
3. In **Settings → Environment Variables**, add:
   - `EDITOR_PASSWORD`: the password used at `/edit`
   - `EDITOR_SESSION_SECRET`: a long random value, such as the output of
     `openssl rand -hex 32`
4. Apply the variables to Production and Preview, then redeploy.
5. Visit `/edit`, sign in, and press **publish** once to seed the Blob store
   with the portfolio's built-in content.

Images are uploaded directly from the browser to Vercel Blob using multipart
uploads. The original file bytes and resolution are retained.

## Custom domain

After the production deployment succeeds, open **Settings → Domains**, add the
domain, and follow the DNS records Vercel shows for your registrar. Add both the
apex domain and `www` if you want Vercel to redirect one to the other.
