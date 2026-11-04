# Exterprise website: domain, SEO and AEO launch guide

The site is live at https://xvoxlabs.github.io/Exterprise/ and is already built for
**https://www.exterprise.us**. All canonical URLs, the sitemap, share previews and structured data point
there. These steps move the domain over and get search engines and AI assistants to pick it up.

---

## 1. Connect www.exterprise.us through Cloudflare (no downtime)

**Hosting:** Cloudflare (free plan), using Workers static assets. It deploys automatically from this GitHub
repo, so every push goes live in about a minute, just like now.

**Settings already in the repo:**

- `wrangler.jsonc`: tells Cloudflare to serve every page exactly at its `.html` address.
- `_redirects`: real permanent (301) redirects for addresses without `.html` and common old-site addresses.
- `_headers`: caching (pages always fresh; fonts, libraries and versioned CSS/JS cached for a year; images
  and video for a week) plus security headers.
- `tools/build.sh`: copies only the public site into `dist/` for each deploy, so `docs/`, `tools/` and config files stay private.

The old site stays live until step 12, and you can undo the switch in about a minute.

### Phase A. Preparation (visitors and email see no change)

1. **Back up the old site.**
2. **Write down your current DNS records** at your registrar (GoDaddy, Namecheap and so on). A screenshot or
   export of the DNS page is enough. The ones that matter most:
   - **MX** records (email)
   - **TXT** records (SPF `v=spf1 …`, DMARC `_dmarc`, domain verifications)
   - any **CNAME** records such as `autodiscover`, `selector1._domainkey` or `mail`
3. **Turn off DNSSEC at your registrar** if it's on. Leaving it on while you change nameservers is the most
   common cause of a site and email going down. You can turn it back on through Cloudflare later.
4. **Create a Cloudflare account** at dash.cloudflare.com, then **Add a domain** → `exterprise.us` → **Free**
   plan. Cloudflare scans and copies your existing DNS records.
5. **Check the copied records against your list from step 2**, line by line.
   - Add anything missing, especially **MX** and email **TXT/CNAME** records.
   - Any record for mail (`mail`, `autodiscover`, `_domainkey`, `smtp`) must be **DNS only** (grey cloud).
   - Leave the `@` and `www` records pointing at the old site for now.
6. **Create the hosting:** Workers & Pages → **Create** → **Import a repository** → connect GitHub → choose
   **XVOXLABS/Exterprise** → branch `main`.
   - Build command: leave empty. The build step is already set in `wrangler.jsonc`.
   - Deploy command: `npx wrangler deploy` (the default).
   - Root directory: `/`.
   - Click **Deploy**.
7. **Test the preview address** Cloudflare gives you (`exterprise.<your-account>.workers.dev`): the homepage,
   a few sub-pages, a phone, a made-up address like `/contact-us` (should land on Contact), and `/robots.txt`.

### Phase B. Move DNS to Cloudflare (still no change for visitors)

8. Cloudflare shows two nameservers, for example `ada.ns.cloudflare.com` and `bob.ns.cloudflare.com`. At your
   registrar, replace the current nameservers with these two.
9. Wait for Cloudflare to email you that `exterprise.us` is **Active**. This usually takes under an hour, and
   at most 24 hours. During this time both old and new nameservers answer with the same records, so nothing
   breaks.
10. **Send yourself a test email** to contact@exterprise.us and reply from it, to confirm mail still works.

### Phase C. Go live (about 2 minutes, at a quiet time)

11. In Cloudflare DNS, **note the current `www` and `@` records** (needed if you roll back), then delete them.
12. In your Worker → **Settings → Domains & Routes → Add → Custom domain**, add `www.exterprise.us`, then add
    `exterprise.us`. Cloudflare creates the records and the HTTPS certificate itself, usually within a minute.
13. Go to **Rules → Redirect Rules → Create rule → template "Redirect from root to WWW"**. This sends
    `exterprise.us/...` to `https://www.exterprise.us/...` (301, keeping the path).
14. Go to **SSL/TLS** and set the mode to **Full (strict)**. Under **Edge Certificates**, turn on **Always Use
    HTTPS**.
15. Check https://www.exterprise.us, https://exterprise.us, a sub-page and a phone. Done.

**Rolling back:** remove the custom domains from the Worker and re-add the records you noted in step 11.
The old site is back within a minute or two.

### Phase D. Extras on the same free plan (optional, recommended)

- **Speed:** Speed → Optimization → turn on **Early Hints**. HTTP/3 is on by default.
- **AI scrapers:** Security → Bots → turn on **Block AI Scrapers and Crawlers** only if you want hard
  blocking.
  - This also stops AI assistants reading your pages, which works against AEO.
  - The softer option, already in place, is `robots.txt`: assistants may read pages but not media.
  - A middle ground is **Bot Fight Mode**: it blocks bad bots and lets verified ones (Google, Bing,
    ChatGPT, Claude) through.
- **Analytics:** Analytics & Logs → **Web Analytics**. It's free and needs no cookie banner.
- **GitHub Pages:** keep it as a backup copy. Every page points Google to www.exterprise.us as the main
  address, so the copy doesn't hurt rankings. Or turn it off in GitHub Settings → Pages once Cloudflare has
  run smoothly for a few weeks.

### Why not Vercel?

Vercel is fast and easy, but its free (Hobby) plan is for **non-commercial use only**. A company website needs
Vercel **Pro at $20 per member per month**, and bot blocking is more limited.

| | Cloudflare (free) | Vercel Pro ($20/member/mo) | GitHub Pages (free) |
|---|---|---|---|
| Commercial use | Yes | Yes | Yes |
| Speed | Excellent | Excellent | Good |
| Bandwidth | Unlimited for static files | 1 TB/month included | Soft limit of 100 GB/month |
| Real 301 redirects and headers | Yes | Yes | No |
| Bot/AI-scraper blocking | Yes, built in | Limited | No |
| Deploys from GitHub | Yes | Yes | Yes |

For a static site like this one, Cloudflare gives the same or better speed for free. Netlify is similar to
Vercel; its free tier allows commercial use, but bandwidth is capped.

---

## 2. Search engines (day 1, after the domain works)

1. **Google Search Console** (search.google.com/search-console)
   1. Add a **Domain** property for `exterprise.us` and verify it with the DNS TXT record Google gives you.
   2. Submit `https://www.exterprise.us/sitemap.xml` under **Sitemaps**.
   3. Use **URL Inspection** to request indexing for the homepage, servicenow.html, smartsourcing.html and
      it-service-management.html.
2. **Bing Webmaster Tools** (bing.com/webmasters): sign in and choose **Import from Google Search Console**.
   Bing also powers ChatGPT search and Copilot, so this step matters for AI answers too.
3. **Google Business Profile**: create or claim **Exterprise, Dallas TX** with the website
   `https://www.exterprise.us`, the category **Software company** / **Business management consultant**, and
   the same description as the About page.
4. **Check the structured data**: run https://search.google.com/test/rich-results and
   https://validator.schema.org on the homepage and on servicenow.html. You should see Organization,
   Breadcrumb, Service and FAQ.

---

## 3. What's already built into the site

**On every page**

- A keyword-focused `<title>` and description, set in `tools/meta.py`.
- A canonical URL and robots tag.
- Open Graph and Twitter tags for share previews, using the image `assets/og-cover.jpg`.

**Structured data (JSON-LD) on every page**

- Organization: name, legal name, founded 2015, Dallas HQ, the three delivery centers, email, LinkedIn and
  areas of expertise.
- WebSite, WebPage and BreadcrumbList.
- Service, on all 39 service pages.
- FAQPage, on the 7 pages with an FAQ section.

**Site files**

- **FAQ sections** (`tools/faq.py`) on the homepage, ServiceNow, ITSM, AI Agents & Now Assist, Smartsourcing,
  Contact Center and Revenue Cycle pages. Every answer leads with the direct answer, and every fact also
  appears elsewhere on the site.
- **`sitemap.xml`**: lists all 42 pages.
- **`robots.txt`**:
  - Search engines and link-preview bots can access everything.
  - AI assistants (GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others) can read every page, but
    not `/assets/`, `/fonts/`, `/vendor/` or the CSS and JS files.
  - Unknown bots get the same rules.
- **`llms.txt`**: a short, structured guide to the company and every page, for AI assistants.
- **`llms-full.txt`**: the text of every page in one file, so assistants quote you accurately.
- **`agents.md`**: a note to AI agents covering what they may do (read, summarize and cite with a link) and
  what they may not do (reuse images, video, fonts or code; auto-submit the contact form). It also lists the
  key facts.
- **`404.html`**: forwards old URLs to the right new page and is not indexed.

### After you edit page content

```bash
python3 tools/meta.py && python3 tools/faq.py && python3 tools/seo.py && python3 tools/stamp-assets.py
```

---

## 4. Ranking higher and getting recommended by ChatGPT, Claude, Gemini and Perplexity

No one can guarantee the #1 spot or an AI recommendation. These are the levers that actually move it, in
order of impact.

1. **Be mentioned elsewhere.** AI assistants recommend companies that other trusted sites talk about.
   - Get Exterprise listed in the **ServiceNow Partner Finder** with a complete profile and case studies.
   - Ask clients for reviews on **G2** and **Clutch** (Clutch's "ServiceNow consultants" category ranks well).
   - Keep the **LinkedIn company page** in step with the site: same description, Premier Partner badge and
     locations.
   - Get listed in industry directories for BPO, records processing and contact centers.
2. **Publish proof.** One case study per main service, each with the client industry, the problem, what you
   did and the numbers (for example "99.99% SLA adherence over 24 months").
   - These are the pages AI assistants cite.
   - I can add a Case Studies page and template whenever you have the material.
3. **Answer the questions buyers ask.**
   - Add an FAQ to more service pages. Copy the pattern in `tools/faq.py`.
   - Write short guides, such as "How long does a ServiceNow ITSM implementation take?" and "Onshore vs
     near-shore vs offshore contact center costs".
4. **Use the same words everywhere.** Write "ServiceNow Premier Partner for Consulting & Implementation" and
   "Smartsourcing (business process outsourcing)" identically on the site, LinkedIn, the ServiceNow profile
   and directories. Consistency is how AI models learn what you are.
5. **Keep it fresh.** Post an update or case study every month, and re-run `tools/seo.py` so the sitemap
   dates change.
6. **Watch the numbers.**
   - Search Console: queries such as "ServiceNow implementation partner" and "ServiceNow ITSM partner Dallas".
   - Once a month, ask ChatGPT, Claude, Gemini and Perplexity "Who are good ServiceNow implementation
     partners in Dallas?" and note whether Exterprise appears.

### Target keywords already used in titles and descriptions

| Area | Keywords |
|---|---|
| ServiceNow | ServiceNow implementation partner, ServiceNow consulting partner, ServiceNow Premier Partner, ServiceNow ITSM / ITOM / CSM / HRSD / FSM / SPM / GRC implementation, Now Assist implementation, ServiceNow AI Agents, AI Control Tower, CMDB / CSDM, App Engine |
| Outsourcing | business process outsourcing (BPO), contact center outsourcing, records digitization, county records conversion, property preservation services, data capture and data entry |
| Technology | custom AI solutions, AI image analytics, application development, UX/UI design, digital marketing |
| Location | Dallas TX, India (Chennai, Coimbatore), near-shore Honduras (San Pedro Sula) |
