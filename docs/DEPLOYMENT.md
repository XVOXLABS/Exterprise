# Exterprise website: deployment and maintenance runbook

## 1. At a glance

| | |
|---|---|
| **What it is** | A static website: HTML, CSS and JavaScript files. No server code, database or framework. |
| **Source of truth** | GitHub repository **XVOXLABS/Exterprise**, branch **`main`** |
| **Hosting** | **Cloudflare** (Workers static assets, free plan). Deploys automatically on every push to `main`. |
| **Domain and DNS** | `exterprise.us`, with DNS on Cloudflare. `www.exterprise.us` is the main address; `exterprise.us` redirects to it. |
| **Build** | `tools/build.sh` copies the public files to `dist/` and stamps CSS/JS versions. It runs automatically. |
| **Backup copy** | GitHub Pages: https://xvoxlabs.github.io/Exterprise/ (same repository, optional) |
| **Contact forms** | The pop-up and the Contact page form send submissions through FormSubmit (formsubmit.co) to contact@exterprise.us (see section 8). |
| **Cost** | $0, apart from the domain renewal. |

---

## 2. Accounts and access (fill this in and keep it current)

| Service | Used for | Owner / admins | Notes |
|---|---|---|---|
| GitHub: XVOXLABS org | Code, history, deploy trigger | | Turn on 2FA for every member |
| Cloudflare | Hosting, DNS, SSL, security | | Use a company email (not a personal one), 2FA, and at least two admins |
| Domain registrar (______) | Owns `exterprise.us` | | **Auto-renew ON**, transfer lock ON |
| Google Search Console | Search indexing and errors | | Domain property `exterprise.us` |
| Bing Webmaster Tools | Bing, ChatGPT search, Copilot | | Imported from Search Console |

---

## 3. What's in the repository

| Path | What it is |
|---|---|
| `*.html` | One file per page (42 pages) plus `404.html` |
| `style.css`, `site.js` | All styling and behaviour for every page |
| `assets/` | Images and videos. Keep each file under 25 MB (Cloudflare limit). |
| `fonts/`, `vendor/` | Web fonts, and the GSAP / ScrollTrigger / Lenis libraries (pinned versions) |
| `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `agents.md` | Files for search engines and AI assistants |
| `_redirects` | Cloudflare permanent redirects (old URLs → new pages) |
| `_headers` | Cloudflare caching and security headers |
| `wrangler.jsonc` | Cloudflare hosting configuration |
| `tools/build.sh` | Deploy build (runs automatically) |
| `tools/meta.py`, `tools/faq.py`, `tools/seo.py` | Regenerate page titles and descriptions, FAQ sections, SEO tags, the sitemap and the llms files |
| `tools/stamp-assets.py` | Stamps CSS/JS versions in the repo copy (for the GitHub Pages backup) |
| `docs/` | This runbook. Not published. |

---

## 4. One-time setup (about 1 hour, plus up to 24 hours waiting for DNS)

The current website keeps running until step 12, and every step can be undone.

### Phase A. Prepare (no change for visitors or email)

1. **Back up the current website** at exterprise.us.
2. **Record the current DNS records** at the domain registrar. A screenshot or export is enough. The critical
   ones are:
   - **MX** records (email)
   - **TXT** records (SPF `v=spf1…`, `_dmarc`, verifications)
   - mail **CNAME** records (`autodiscover`, `*._domainkey`, `mail`)
3. **Turn off DNSSEC at the registrar** if it's enabled. You can re-enable it later from Cloudflare.
4. **Create the Cloudflare account** (company email, 2FA on) → **Add a domain** → `exterprise.us` → **Free**
   plan.
5. **Check the DNS records Cloudflare imported** against step 2, line by line.
   - Add anything missing.
   - Set every mail-related record to **DNS only** (grey cloud).
   - Leave the `@` and `www` records as they are, still pointing at the old site.
6. **Create the hosting.** Go to **Workers & Pages → Create → Import a repository → GitHub**, authorize
   access to **XVOXLABS/Exterprise**, then set:
   - Production branch: `main`
   - Build command: *(leave empty; it's defined in `wrangler.jsonc`)*
   - Deploy command: `npx wrangler deploy`
   - Root directory: `/`

   Then click **Deploy**. The build log should end with `dist: 247 files …` and a successful deployment.
7. **Turn on preview builds.** In the Worker, go to **Settings → Build** and enable **builds for
   non-production branches**. Every branch then gets its own preview URL.
8. **Test the `*.workers.dev` URL** Cloudflare shows. Use the checklist in section 6.

### Phase B. Move DNS to Cloudflare (no change for visitors)

9. At the registrar, replace the nameservers with the two Cloudflare lists, for example `xxx.ns.cloudflare.com`.
10. Wait for the **"Active"** email from Cloudflare. This usually takes under an hour, at most 24 hours.
11. **Send a test email** to contact@exterprise.us and reply from it.

### Phase C. Go live (about 2 minutes; pick a quiet time)

12. In **DNS → Records**, **write down** the existing `www` and `@` records (you need them for a rollback), then
    delete those two records only.
13. In **Worker → Settings → Domains & Routes → Add → Custom domain**:
    1. Add `www.exterprise.us`.
    2. Add `exterprise.us`.

    Cloudflare creates the DNS records and certificates automatically.
14. Go to **Rules → Redirect Rules → Create rule → template "Redirect from root to WWW"** (301, preserve the
    path and query).
15. Go to **SSL/TLS → Overview** and set it to **Full (strict)**. Then go to **SSL/TLS → Edge Certificates**
    and turn on **Always Use HTTPS**.
16. Run the checklist in section 6 against https://www.exterprise.us.

**To undo Phase C:** remove the two custom domains, then re-create the records from step 12.

### Phase D. After go-live

17. **Google Search Console:**
    1. Add a **Domain** property for `exterprise.us` and verify it with the TXT record. Cloudflare can add
       the record for you automatically.
    2. Submit `https://www.exterprise.us/sitemap.xml`.
18. **Bing Webmaster Tools:** **Import from Google Search Console**.
19. **Security → Bots:** turn on **Bot Fight Mode**. Do **not** turn on "Block AI Scrapers and Crawlers"
    unless the business decides to; it stops AI assistants (ChatGPT, Claude, Gemini) reading the site.
20. **Analytics:** go to **Analytics & Logs → Web Analytics** and turn it on (free, no cookie banner needed).
21. Optional: set up a free uptime monitor (for example UptimeRobot) on `https://www.exterprise.us/` with alerts
    to the team.

---

## 5. Everyday: deploying a change

1. **Create a branch** and edit the files.
2. **Preview locally** (Node.js 18 or later):
   ```bash
   npx wrangler dev
   ```
   Then open http://localhost:8787. This runs the real Cloudflare behaviour, including redirects and headers.
3. **If you changed page text, titles, descriptions or FAQs**, regenerate the SEO files:
   ```bash
   python3 tools/meta.py && python3 tools/faq.py && python3 tools/seo.py && python3 tools/stamp-assets.py
   ```
   - Titles and descriptions live in `tools/meta.py`.
   - FAQ questions and answers live in `tools/faq.py`.
4. **Push the branch and open a pull request.** Cloudflare builds a preview URL for the branch. Review it.
5. **Merge to `main`.** It's live in about a minute. Check **Worker → Deployments** for a green deployment.

**Caching (no manual purge needed):**

- Pages (`.html`) are never cached, so changes appear immediately.
- `style.css` and `site.js` get a new version stamp on every build automatically.
- Images and videos are cached for up to one week. To replace an image immediately, upload it with a **new file
  name** and update the reference. Alternatively, go to **Caching → Configuration → Purge Cache → Custom
  purge** and purge that URL.

**Adding a new page:**

1. Copy the most similar existing page and change its `<title>`, description, `<h1>` and content.
2. Link to it from the navigation, footer or related pages.
3. Add an entry for it in `tools/meta.py`.
4. Run the commands in step 3 above.

New `.html` files are deployed automatically.

**Adding a redirect:** add a line to `_redirects`:

```
/old-address /new-page.html 301
```

**Adding a new root-level file** (for example a verification file): add its name to the `cp` line in
`tools/build.sh`, or it won't be deployed. Files inside `assets/`, `fonts/` and `vendor/` are deployed
automatically.

---

## 6. After-deploy checklist (2 minutes)

- [ ] The homepage loads with no errors, on desktop and on a phone.
- [ ] One ServiceNow sub-page, one Smartsourcing sub-page, About and Contact all load.
- [ ] `/contact-us` redirects to `/contact.html`.
- [ ] `/no-such-page` shows the "page not found" page.
- [ ] `/robots.txt` and `/sitemap.xml` load.
- [ ] `exterprise.us` redirects to `https://www.exterprise.us`.
- [ ] Headers are correct:
  ```bash
  curl -sI https://www.exterprise.us/about.html | grep -i -E "cache-control|strict-transport"
  ```
  This should show `max-age=0, must-revalidate` and `Strict-Transport-Security`.

---

## 7. Rolling back

1. **Fastest (seconds):** go to **Workers & Pages → exterprise → Deployments**, choose the last good version
   and **Rollback** / deploy it.
2. **Then fix the code:**
   ```bash
   git revert <bad-commit-sha>
   git push origin main
   ```
3. **DNS or email problem after a DNS change:** compare **DNS → Records** with the record list from section 4,
   step 2. Mail records must be **DNS only**.

---

## 8. Routine maintenance

| When | Task |
|---|---|
| Every deploy | Section 6 checklist |
| Monthly | Search Console → **Pages** and **Sitemaps** for errors; Cloudflare build history; uptime alerts |
| Every January | Update the copyright year in the footer of every page (search for `2021 Exterprise`) |
| Yearly | Confirm the domain auto-renews and the payment card is valid; review who has access to GitHub and Cloudflare |
| When needed | Update `vendor/` libraries only deliberately, and test every page afterwards |

**Contact forms.** Both forms (the "Let's Talk" pop-up and the Contact page form) post to FormSubmit
(formsubmit.co), which emails every submission to **contact@exterprise.us**. The code is the `v86` block at the
top of `site.js` (`window.__xtSend`); the inbox is `window.XT_INBOX`.

- **One-time activation:** the first submission after launch makes FormSubmit send an "Activate form" email to
  contact@exterprise.us. Click its button once. Until then, submissions are not delivered.
- **Reply:** each email arrives as a table (name, email, company, phone, topics, message, page). Hitting Reply
  answers the visitor directly.
- **Spam:** a hidden field catches simple bots. If spam grows, add FormSubmit's captcha or move to another service.
- **If sending fails** the visitor sees an error with the email address and keeps what they typed; the form
  never claims success unless the message was accepted.
- **Switching service** (Formspree, HubSpot, a ServiceNow endpoint): set it on every page before `site.js` loads.
  The endpoint must accept JSON and answer with a 2xx status:
  ```html
  <script>window.XT_FORM_ENDPOINT = "https://…"</script>
  ```
- **After any change:** submit a test from the live site and confirm the email arrives.

**Limits to keep in mind (Cloudflare free plan):**

- 25 MB per file; compress videos larger than this before adding them.
- 20,000 files per deployment.
- Static files have unlimited bandwidth.

---

## 9. Troubleshooting

| Symptom | Check |
|---|---|
| Build failed | Read the build log in Worker → Deployments / Builds. Common causes: a file over 25 MB, or a file in the `cp` list of `tools/build.sh` that was renamed or deleted. |
| Change not live | Was it merged to `main`? Is the latest deployment green? Do a hard refresh (Ctrl/Cmd + Shift + R). |
| Old styling after a change | View the page source. The `style.css?v=` value should change after each CSS edit. If it doesn't, check the build log line `style.css?v=…`. |
| A page returns 404 | File names and URLs are case-sensitive. Is the file in the repository root? |
| `exterprise.us` (without www) doesn't redirect | Rules → Redirect Rules: the "root to WWW" rule must be on, and both custom domains must be attached to the Worker. |
| Certificate or HTTPS error | SSL/TLS mode must be **Full (strict)**. Custom domains show **Active** in Worker → Domains & Routes. |
| Email stopped working | DNS → Records: MX and mail TXT/CNAME records exist and are **DNS only**. |
| Whole site down | Check https://www.cloudflarestatus.com, then roll back (section 7). |
