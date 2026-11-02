# Exterprise website

Static website for **www.exterprise.us**. Hosted on Cloudflare and deployed automatically on every push to `main`.

- **First-time Cloudflare setup, click by click:** [docs/CLOUDFLARE-PLAYBOOK.md](docs/CLOUDFLARE-PLAYBOOK.md) (PDF: `docs/Exterprise-Cloudflare-Playbook.pdf`)
- **Deploy, maintain, roll back:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) (PDF: `docs/Exterprise-Deployment-Runbook.pdf`)
- **Local preview:** `npx wrangler dev`, then open http://localhost:8787
- **After editing page text, titles or FAQs:**
  ```bash
  python3 tools/meta.py && python3 tools/faq.py && python3 tools/seo.py && python3 tools/stamp-assets.py
  ```
