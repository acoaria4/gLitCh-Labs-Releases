# gLitCh Labs Studio Website

Modern studio marketing site (glass UI) for gLitCh Labs.

This folder **mirrors the eventual repo root layout** so promoting it later keeps relative links and store policy paths stable.

Preview on GitHub Pages:

`https://acoaria4.github.io/gLitCh-Labs-Releases/website/`

## Layout (mirrors root)

```
website/
  index.html
  about.html
  contact.html
  css/  js/  assets/
  expenses/
    index.html           # studio Expenses page
    privacy.html         # store policy copy
    support.html
    delete-account.html
    invite.html
    assets/
  aura/
    index.html           # studio AURA page
    privacy.html
```

## Pages

| Page | Path |
|------|------|
| Home | `website/index.html` |
| About | `website/about.html` |
| Contact | `website/contact.html` |
| Expenses | `website/expenses/` |
| AURA | `website/aura/` |

## Local preview

Open `website/index.html` in a browser, or serve the repo root:

```bash
# from repo root
npx --yes serve .
```

Then visit `/website/`.

## Promote to root (when ready)

1. Copy/merge contents of `website/` into the repo root (keep `googleb368479d645c4aab.html` and any other root-only files).
2. **Do not rename** `expenses/privacy.html`, `support.html`, `delete-account.html`, or `aura/privacy.html` — those are the Play / App Store URLs.
3. Studio `expenses/index.html` will replace the older root Expenses product page on promote; store listings use privacy/support/delete, not that index.
4. Commit and push; GitHub Pages will serve the studio home at the Pages URL.

Until promote, live store policy URLs remain the **root** `expenses/` and `aura/` copies (unchanged by this folder).

## Custom domain (deferred)

When you’re ready to attach a domain (e.g. `glitchlabs.com`):

1. Buy the domain (Cloudflare Registrar, Namecheap, etc.).
2. Repo **Settings → Pages → Custom domain** → enter your domain.
3. At the registrar, add GitHub Pages DNS:
   - Apex: GitHub `A` / `AAAA` records (see [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site))
   - `www`: `CNAME` → `acoaria4.github.io`
4. After DNS propagates, enable **Enforce HTTPS**.
5. Add a `CNAME` file at the Pages root containing your domain name.
