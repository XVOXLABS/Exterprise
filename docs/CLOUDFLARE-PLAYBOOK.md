# Cloudflare deployment playbook: www.exterprise.us

**Goal:** serve the new Exterprise website from Cloudflare at **https://www.exterprise.us**, with no downtime
for the website or email.

**Time:** about 60–90 minutes of work, plus up to 24 hours waiting for DNS (usually under 1 hour).

**Who:** one person with access to the domain registrar, the GitHub organization **XVOXLABS**, and a company
email address for the Cloudflare account.

Tick each ☐ as you go. Lines marked **✔ You should see** tell you what success looks like. If the screen
doesn't match, stop and check that step.

Cloudflare occasionally renames menu items. If a label differs slightly, look for the closest match; the
order of the steps stays the same.

---

## Fill in before you start

| Item | Value |
|---|---|
| Domain registrar (where exterprise.us was bought) | |
| Registrar login owner | |
| Cloudflare account email (company address) | |
| GitHub user with admin access to XVOXLABS | |
| Planned go-live time (quiet hours) | |
| Old `www` record (type and value), filled in at Part 10 | |
| Old `@` record (type and value), filled in at Part 10 | |

---

## Part 1. Record the current DNS (at your registrar)

*Nothing changes in this part. You're only writing things down.*

☐ **1.1** Sign in to your domain registrar.

☐ **1.2** Open the DNS settings for **exterprise.us**:

- **GoDaddy:** **My Products** → next to *exterprise.us* click **DNS**
- **Namecheap:** **Domain List** → *exterprise.us* → **Manage** → **Advanced DNS**
- **Squarespace / Google Domains:** **Domains** → *exterprise.us* → **DNS** → **DNS settings**
- **Other registrars:** find **DNS**, **DNS Management** or **Zone Editor**

☐ **1.3** Take a screenshot (or use **Export**) of **every** record on the page. Scroll down so nothing is
missed.

☐ **1.4** Highlight these in your screenshot. They keep email working:

- every **MX** record
- **TXT** records starting `v=spf1`, plus any named `_dmarc` or `google-site-verification`
- **CNAME** records such as `autodiscover`, `selector1._domainkey`, `selector2._domainkey` and `mail`

☐ **1.5** Find **DNSSEC** (often under *DNS*, *Security* or *Advanced*) and note whether it's **On** or **Off**.
Don't change it yet.

**✔ You should see:** a complete picture of the current records, saved somewhere safe.

---

## Part 2. Create the Cloudflare account

☐ **2.1** Go to **https://dash.cloudflare.com/sign-up**.

☐ **2.2** Enter the **company email** (not a personal one) and a strong password → **Sign up**.

☐ **2.3** Open the verification email from Cloudflare → click **Verify email**.

☐ **2.4** Turn on two-factor authentication:

1. Click the **person icon** (top right) → **Profile** → **Authentication**.
2. Under **Two-Factor Authentication**, click **Set up** / **Enable** and follow the steps with an
   authenticator app.
3. **Save the backup codes.**

☐ **2.5** Add a second admin so access never depends on one person:

1. Click the **account name** (top left) → **Manage account** → **Members** → **Invite**.
2. Enter their email → role **Super Administrator** → **Invite**.

**✔ You should see:** the Cloudflare dashboard home page, with 2FA shown as enabled.

---

## Part 3. Add exterprise.us to Cloudflare

☐ **3.1** On the dashboard home, click **+ Add** (top right) → **Connect a domain**. On some accounts this is
**Add a domain** on the home page.

☐ **3.2** Type `exterprise.us` (no `www`).

☐ **3.3** Leave **Quick scan for DNS records** selected → **Continue**.

☐ **3.4** Choose the **Free** plan (scroll to the bottom of the plan list) → **Continue** / **Select plan**.

**✔ You should see:** a **Review your DNS records** page listing records Cloudflare copied from your current
DNS.

---

## Part 4. Check the copied DNS records

*Still no change for visitors. The old nameservers stay in charge until Part 8.*

☐ **4.1** Compare this list with your screenshot from Part 1, **line by line**.

☐ **4.2** For any record that's missing:

1. Click **+ Add record**.
2. Choose the **Type** (MX, TXT, CNAME and so on) and copy **Name**, **Content / Target** and **Priority**
   (for MX) exactly.
3. Click **Save**.

☐ **4.3** Make every email-related record grey (**DNS only**). This includes `mail`, `autodiscover`,
`*._domainkey`, `smtp`, `imap` and similar:

1. Click **Edit** on the record.
2. Switch **Proxy status** off, so the cloud turns **grey**.
3. Click **Save**.

MX and TXT records have no proxy switch, which is fine.

☐ **4.4** Leave the existing `@` (or `exterprise.us`) and `www` records **as they are**. They still point at the
old website.

☐ **4.5** Click **Continue to activation** / **Continue**.

☐ **4.6** Cloudflare now shows **two nameservers**, for example `abby.ns.cloudflare.com` and
`kyle.ns.cloudflare.com`. **Copy both exactly.** You need them in Part 8. Leave this tab open.

**✔ You should see:** a page titled something like **Update your nameservers**, with your two Cloudflare
nameservers.

---

## Part 5. Connect GitHub and deploy the site

☐ **5.1** In the left sidebar, click **Compute (Workers)** → **Workers & Pages**. On older menus it's just
**Workers & Pages**.

☐ **5.2** Click **Create** (or **Create application**).

☐ **5.3** On the **Workers** tab, choose **Import a repository** → **Get started**.

☐ **5.4** Click **Connect GitHub** (or **+ Add account** → **GitHub**). A GitHub window opens:

1. Sign in with the GitHub user that has admin access to **XVOXLABS**.
2. Choose **Install** for the **XVOXLABS** organization.
3. Select **Only select repositories** → **Exterprise**.
4. Click **Install & Authorize**.

☐ **5.5** Back in Cloudflare, select **XVOXLABS / Exterprise** → **Next** / **Begin setup**.

☐ **5.6** Fill in **Configure your project**:

| Field | Enter |
|---|---|
| **Project name** | `exterprise` (must be exactly this; it matches `wrangler.jsonc`) |
| **Production branch** | `main` |
| **Build command** | *leave empty* |
| **Deploy command** | `npx wrangler deploy` |
| **Non-production branch deploy command** | `npx wrangler versions upload` |
| **Path / Root directory** (under *Advanced settings*) | `/` |
| **API token** | leave as **Create new token** (Cloudflare does this for you) |

☐ **5.7** Click **Create and deploy** (or **Save and Deploy**).

☐ **5.8** Wait 1–3 minutes, watching the build log. Near the end, the log should include:

```
[custom build] dist: 247 files, style.css?v=…, site.js?v=…
✨ Success! Uploaded … files
Deployed exterprise triggers
  https://exterprise.<your-account>.workers.dev
```

**✔ You should see:** a green **Success** / **Deployed** status and a `https://exterprise.<your-account>.workers.dev`
address. Copy that address.

> **If the build fails:** open the log, scroll to the first red line, and send it to the developer. The usual
> cause is a project name other than `exterprise`. Fix it under **Settings → Build → Edit**, then **Retry
> deployment**.

---

## Part 6. Turn on preview builds for branches

☐ **6.1** Open the **exterprise** Worker → **Settings** tab → **Build** section.

☐ **6.2** Under **Branch control**, make sure **Builds for non-production branches** is **enabled** →
**Save**.

**✔ You should see:** a production branch of `main`, with non-production builds enabled. From now on every
pushed branch gets its own preview link.

---

## Part 7. Test the site on the workers.dev address

Open `https://exterprise.<your-account>.workers.dev` and check each item:

☐ **7.1** The homepage loads: hero video, menu, scrolling sections.

☐ **7.2** **What We Do → ServiceNow** opens the ServiceNow page.

☐ **7.3** **About** and **Contact Us** open.

☐ **7.4** Add `/contact-us` to the end of the address. It should land on the **Contact** page.

☐ **7.5** Add `/this-page-does-not-exist`. The **"This page has moved or doesn't exist"** page appears.

☐ **7.6** Add `/robots.txt`. A text file appears.

☐ **7.7** Open the address on a **phone**. The layout fits and the menu opens.

**✔ You should see:** everything working. **Don't continue until Part 7 passes.**

---

## Part 8. Switch the nameservers to Cloudflare (at your registrar)

*Visitors still see the old site after this step. Only who answers DNS changes. Email keeps working
because Part 4 copied the records.*

☐ **8.1** **If DNSSEC was On in step 1.5, turn it OFF now**, and wait 15 minutes before 8.2:

- **GoDaddy:** **DNS** → **DNSSEC** → **Off** / delete the DS records
- **Namecheap:** **Advanced DNS** → **DNSSEC** → switch off
- **Others:** remove the **DS records** / turn DNSSEC off

☐ **8.2** Open the nameserver settings:

- **GoDaddy:** **My Products** → *exterprise.us* → **DNS** → **Nameservers** tab → **Change Nameservers** →
  **I'll use my own nameservers**
- **Namecheap:** **Domain List** → **Manage** → **Nameservers** → choose **Custom DNS**
- **Squarespace / Google Domains:** **DNS** → **Nameservers** → **Use custom nameservers**

☐ **8.3** Delete the existing nameservers and enter the **two Cloudflare nameservers** from step 4.6 →
**Save**. Confirm if asked.

☐ **8.4** Back in Cloudflare (the tab from 4.6), click **Check nameservers now** / **Done, check nameservers**.

**✔ You should see:** the registrar showing only the two `…ns.cloudflare.com` nameservers.

---

## Part 9. Wait for "Active", then check email

☐ **9.1** Wait for Cloudflare's email: **"exterprise.us is now active on a Cloudflare Free plan"**. This is
usually under 1 hour and at most 24. In the dashboard, the domain shows **Active** with a green tick.

☐ **9.2** Send an email **to** contact@exterprise.us from a personal account → check it arrives → **reply**
→ check the reply arrives.

**✔ You should see:** **Active** status, and email working both ways.

> **If email fails:** in Cloudflare, go to **exterprise.us → DNS → Records** and compare with your Part 1
> screenshot. Add any missing MX/TXT/CNAME record, with mail records set to **DNS only**.

---

## Part 10. Go live: point the domain at the new site

*Do this at the quiet time you planned. Visitors switch to the new site within about a minute.*

☐ **10.1** Open **exterprise.us** → **DNS** → **Records**.

☐ **10.2** **Write down** (in the table at the top of this playbook) the **Type** and **Content** of:

- the record named **`www`**
- the record named **`exterprise.us`** (or `@`)

You need these if you ever roll back.

☐ **10.3** Delete only those two records. For each: **Edit** → **Delete** → confirm. **Don't delete MX, TXT
or mail records.**

☐ **10.4** Go to **Compute (Workers) → Workers & Pages** → **exterprise** → **Settings** → **Domains &
Routes** → **+ Add** → **Custom domain**.

☐ **10.5** Type `www.exterprise.us` → **Add domain**.

☐ **10.6** Again: **+ Add** → **Custom domain** → `exterprise.us` → **Add domain**.

☐ **10.7** Wait 1–5 minutes until both domains show **Active** and the certificate is ready.

**✔ You should see:** under **Domains & Routes**, both `www.exterprise.us` and `exterprise.us` listed as
**Active**. Opening `https://www.exterprise.us` shows the **new** site. Use a private or incognito window to
avoid your browser cache.

---

## Part 11. Redirect exterprise.us → www.exterprise.us

☐ **11.1** Open **exterprise.us** → **Rules** → **Overview**.

☐ **11.2** Click **+ Create rule** → **Redirect Rule**, or under **Templates** choose **Redirect from Root to
WWW** → **Use template**.

☐ **11.3** If you used the template, check the fields are filled like this. Otherwise fill them in:

| Field | Value |
|---|---|
| Rule name | `Root to www` |
| When incoming requests match | **Wildcard pattern**, request URL: `https://exterprise.us/*` |
| Then: target URL | `https://www.exterprise.us/${1}` |
| Status code | **301** |
| Preserve query string | ☑ ticked |

☐ **11.4** Click **Deploy** / **Save**.

**✔ You should see:** `https://exterprise.us/about.html` opens `https://www.exterprise.us/about.html`.

---

## Part 12. SSL / HTTPS settings

☐ **12.1** Open **exterprise.us** → **SSL/TLS** → **Overview** → **Configure** (or the encryption mode
selector) → **Full (strict)** → **Save**.

☐ **12.2** Go to **SSL/TLS** → **Edge Certificates** and turn **ON**:

- **Always Use HTTPS**
- **Automatic HTTPS Rewrites**

☐ **12.3** On the same page, check **Minimum TLS Version** is **TLS 1.2**.

**✔ You should see:** `http://www.exterprise.us` (without the *s*) switching automatically to `https://`.

---

## Part 13. Security, speed and analytics

☐ **13.1** Go to **exterprise.us** → **Security** → **Bots** (on newer menus, **Security → Settings**) and
turn **Bot Fight Mode** **ON**.

☐ **13.2** On the same page, leave **Block AI Scrapers and Crawlers** **OFF**. Turning it on stops ChatGPT,
Claude and Gemini from reading the site, which would reduce how often they recommend Exterprise.

☐ **13.3** Go to **Speed** → **Optimization** → **Content Optimization** and turn **Early Hints** **ON**.

☐ **13.4** In the left sidebar, go to **Analytics & Logs** → **Web Analytics** → **Add a site** → choose
`www.exterprise.us` → **Done**. If it offers *automatic setup*, accept it; no code change is needed.

☐ **13.5** Re-enable **DNSSEC** (only if it was on before):

1. Go to **exterprise.us** → **DNS** → **Settings** → **DNSSEC** → **Enable DNSSEC**.
2. Copy the **DS record** values it shows.
3. Add them at your registrar's DNSSEC page.

**✔ You should see:** Bot Fight Mode on, Early Hints on, and Web Analytics showing visits within an hour.

---

## Part 14. Final check (takes 5 minutes)

Use a private or incognito window:

☐ **14.1** `https://www.exterprise.us` shows the new homepage, with a padlock in the address bar.

☐ **14.2** `https://exterprise.us` redirects to `https://www.exterprise.us`.

☐ **14.3** `https://www.exterprise.us/servicenow.html`, `/about.html` and `/contact.html` load.

☐ **14.4** `https://www.exterprise.us/contact-us` lands on the Contact page.

☐ **14.5** `https://www.exterprise.us/sitemap.xml` and `/robots.txt` load.

☐ **14.6** The site works on a phone.

☐ **14.7** An email to contact@exterprise.us still arrives.

☐ **14.8** **Workers & Pages → exterprise → Deployments** shows the latest deployment as **Active / Success**.

**🎉 Live.** From now on, every merge to `main` on GitHub deploys automatically in about a minute.

---

## Rollback card (keep this handy)

| Problem | What to click |
|---|---|
| **A bad website change** | **Workers & Pages → exterprise → Deployments** → find the last good deployment → **⋯** → **Rollback** → confirm. Fixed in seconds. |
| **Need the old website back** | 1. **Workers & Pages → exterprise → Settings → Domains & Routes** → remove both custom domains (**⋯ → Remove**). 2. **DNS → Records → + Add record** → re-create the two records you wrote down in step 10.2. 3. The old site returns within about 2 minutes. |
| **Email stopped** | **DNS → Records**: compare with your Part 1 screenshot, re-add missing MX/TXT/CNAME records, set to **DNS only**. |
| **Site down everywhere** | Check https://www.cloudflarestatus.com, then roll back as above. |

---

## After launch (same day)

☐ **Google Search Console** (https://search.google.com/search-console):

1. **Add property** → **Domain** → `exterprise.us` → **Continue**.
2. Choose **Verify with Cloudflare**, or copy the TXT record into **Cloudflare DNS → + Add record → TXT**.
3. Click **Verify**.
4. Go to **Sitemaps** → enter `sitemap.xml` → **Submit**.

☐ **Bing Webmaster Tools** (https://www.bing.com/webmasters): **Import** → **Google Search Console** →
**Continue** → choose the property → **Import**.

☐ **GitHub Pages backup** (optional, after 2–4 weeks of stable running):

1. Open the **XVOXLABS/Exterprise** repo → **Settings** → **Pages**.
2. Either leave it on as a backup copy, or set **Source** to **None** to switch it off.
