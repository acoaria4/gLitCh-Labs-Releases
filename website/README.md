# gLitCh Labs Studio Website

Modern studio marketing site (glass UI) for gLitCh Labs.

Preview path on GitHub Pages:

`https://acoaria4.github.io/gLitCh-Labs-Releases/website/`

## Pages

| Page | Path |
|------|------|
| Home | `website/index.html` |
| About | `website/about.html` |
| Contact | `website/contact.html` |
| Expenses | `website/products/expenses.html` |
| AURA | `website/products/aura.html` |

## Local preview

Open `website/index.html` in a browser, or serve the repo root:

```bash
# from repo root
npx --yes serve .
```

Then visit `/website/`.

## Promote to root (when ready)

1. Move contents of `website/` up to the repo root (keeping existing `expenses/` and `aura/` paths).
2. Replace or merge the current root `index.html` with this studio homepage.
3. Commit and push; GitHub Pages will serve the new home at the Pages URL.

## Custom domain (deferred)

When you’re ready to attach a domain (e.g. `glitchlabs.com`):

1. Buy the domain (Cloudflare Registrar, Namecheap, etc.).
2. Repo **Settings → Pages → Custom domain** → enter your domain.
3. At the registrar, add GitHub Pages DNS:
   - Apex: GitHub `A` / `AAAA` records (see [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site))
   - `www`: `CNAME` → `acoaria4.github.io`
4. After DNS propagates, enable **Enforce HTTPS**.
5. Add a `CNAME` file at the Pages root containing your domain name.

Until then, keep using the `*.github.io` URL above.
