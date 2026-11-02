# Exterprise website: domain, SEO and AEO launch guide

The site is live at https://xvoxlabs.github.io/Exterprise/ and is already built for
**https://www.exterprise.us**. All canonical URLs, the sitemap, share previews and structured data point
there. These steps move the domain over and get search engines and AI assistants to pick it up.

---

## 1. Connect www.exterprise.us (about 30 minutes plus DNS wait)

Moving the domain replaces the current exterprise.us website.

**Before you switch:**

- Back up the old site.
- Note any old pages that get traffic. The new 404 page already redirects common old addresses such as
  /contact-us, /about-us and /services/servicenow-itsm to the matching new pages. Send me any others and
  I'll add them.
- Don't touch the **MX** or **TXT** records. They run your email (contact@exterprise.us).

### Step 1. DNS records at your domain registrar

Your registrar is wherever exterprise.us is managed: GoDaddy, Namecheap, Cloudflare and so on.

Delete any existing `A`, `AAAA` or `CNAME` records for `@` and `www` that point to the old host, then add
these:

| Type  | Host / Name | Value                  |
|-------|-------------|------------------------|
| CNAME | www         | xvoxlabs.github.io     |
| A     | @           | 185.199.108.153        |
| A     | @           | 185.199.109.153        |
| A     | @           | 185.199.110.153        |
| A     | @           | 185.199.111.153        |
| AAAA  | @           | 2606:50c0:8000::153    |
| AAAA  | @           | 2606:50c0:8001::153    |
| AAAA  | @           | 2606:50c0:8002::153    |
| AAAA  | @           | 2606:50c0:8003::153    |

### Step 2. GitHub settings

Go to github.com/XVOXLABS/Exterprise → **Settings → Pages**.

1. Under **Custom domain**, enter `www.exterprise.us` and click **Save**. GitHub adds a `CNAME` file to the
   repo.
2. Wait for the DNS check to turn green. This usually takes minutes, but can take up to 24 hours.
3. Tick **Enforce HTTPS**. The certificate can take up to an hour to issue.
4. Optional, but recommended: protect the domain against takeover. Go to the XVOXLABS organization →
   **Settings → Pages → Add a domain**, then add the TXT record GitHub shows you at your registrar.

Once this is done, `exterprise.us` redirects to `www.exterprise.us`, and the github.io address redirects
there too.

### Optional: block AI scrapers at the network level (Cloudflare)

`robots.txt` is a polite request. Reputable crawlers follow it, but bad scrapers ignore it.

1. Move the domain's DNS to Cloudflare (the free plan is enough).
2. Keep the records above, with the cloud icon set to **Proxied**.
3. Turn on **Security → Bots → Block AI Scrapers and Crawlers** and **Bot Fight Mode**. If you do this,
   leave **Verified bots** allowed so Google, Bing and AI search assistants can still read the pages.

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
   - Get listed in industry directories for BPO, healthcare RCM and contact centers.
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
| Outsourcing | business process outsourcing (BPO), contact center outsourcing, healthcare revenue cycle management, medical claims processing, records digitization, county records conversion, property preservation services, data capture and data entry |
| Technology | custom AI solutions, AI image analytics, Snowflake data management, SAP implementation, application development, UX/UI design, digital marketing |
| Location | Dallas TX, India (Chennai, Coimbatore), near-shore Honduras (San Pedro Sula) |
