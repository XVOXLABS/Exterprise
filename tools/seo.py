#!/usr/bin/env python3
"""Search + answer-engine metadata for every page. Safe to re-run after editing pages.

Writes, from the pages themselves:
  * a <!-- seo --> block in each page head: canonical URL, robots, Open Graph / Twitter
    share tags and JSON-LD structured data (Organization, WebSite, WebPage, BreadcrumbList,
    Service, AboutPage / ContactPage)
  * sitemap.xml
  * llms.txt (short guide for AI assistants) and llms-full.txt (the text of every page)

    python3 tools/seo.py            # uses https://www.exterprise.us
    SITE=https://exterprise.us python3 tools/seo.py
"""
import datetime, html, json, os, pathlib, re, subprocess
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = os.environ.get("SITE", "https://www.exterprise.us").rstrip("/")
OG_IMAGE = SITE + "/assets/og-cover.jpg"
ORG_ID = SITE + "/#organization"
SITE_ID = SITE + "/#website"

ORG = {
    "@type": "Organization", "@id": ORG_ID, "name": "Exterprise", "legalName": "Exterprise LLC",
    "url": SITE + "/", "logo": SITE + "/assets/exterprise-logo.png", "image": OG_IMAGE,
    "slogan": "Extend your enterprise", "foundingDate": "2015", "email": "contact@exterprise.us",
    "description": "Exterprise is a ServiceNow Premier Partner and global smartsourcing provider, with 500+ "
                   "professionals across the US, India and Central America.",
    "numberOfEmployees": {"@type": "QuantitativeValue", "minValue": 500},
    "address": {"@type": "PostalAddress", "addressLocality": "Dallas", "addressRegion": "TX", "addressCountry": "US"},
    "location": [
        {"@type": "Place", "name": "Exterprise headquarters, Dallas", "address": {"@type": "PostalAddress", "addressLocality": "Dallas", "addressRegion": "TX", "addressCountry": "US"}},
        {"@type": "Place", "name": "Exterprise main offshore delivery center, Chennai", "address": {"@type": "PostalAddress", "addressLocality": "Chennai", "addressRegion": "Tamil Nadu", "addressCountry": "IN"}},
        {"@type": "Place", "name": "Exterprise offshore delivery center, Coimbatore", "address": {"@type": "PostalAddress", "addressLocality": "Coimbatore", "addressRegion": "Tamil Nadu", "addressCountry": "IN"}},
        {"@type": "Place", "name": "Exterprise nearshore delivery center, San Pedro Sula", "address": {"@type": "PostalAddress", "addressLocality": "San Pedro Sula", "addressCountry": "HN"}},
    ],
    "contactPoint": {"@type": "ContactPoint", "contactType": "sales", "email": "contact@exterprise.us", "url": SITE + "/contact.html"},
    "sameAs": ["https://www.linkedin.com/company/exterprise-inc/"],
    "brand": [
        {"@type": "Brand", "name": "ServOps", "url": "https://servops.com/", "description": "Service operations excellence on ServiceNow."},
        {"@type": "Brand", "name": "UtterNow", "url": "https://dev.utternow.ai/", "description": "Voice for ServiceNow: create tickets, look up answers and start processes by voice."},
        {"@type": "Brand", "name": "Omnitix", "url": "https://omnitix.us/", "description": "Omni-channel contact center solutions with multilingual, 24/7 support across voice, email, text and chat."},
    ],
    "knowsAbout": ["ServiceNow implementation", "ServiceNow AI Agents and Now Assist", "IT Service Management", "Customer Service Management",
                   "HR Service Delivery", "Business process outsourcing", "Records processing",
                   "Contact center services", "Custom AI solutions"],
}
WEBSITE = {"@type": "WebSite", "@id": SITE_ID, "url": SITE + "/", "name": "Exterprise", "publisher": {"@id": ORG_ID}, "inLanguage": "en-US"}
NOT_SERVICES = {"index.html", "about.html", "contact.html"}


def url_of(page):
    return SITE + "/" if page == "index.html" else f"{SITE}/{page}"


def meta(head, name):
    m = re.search(r'<meta content="([^"]*)" name="%s"' % name, head) or re.search(r'<meta name="%s" content="([^"]*)"' % name, head)
    return html.unescape(m.group(1)) if m else ""


class Text(HTMLParser):
    """Readable markdown-ish text of <main>, skipping hidden/decorative bits."""
    SKIP = {"script", "style", "svg", "noscript", "button", "dialog", "template", "video"}
    def __init__(self):
        super().__init__(convert_charrefs=True); self.out = []; self.skip = 0; self.buf = ""; self.tag = None; self.depth = []; self.inmain = 0
    def handle_starttag(self, t, a):
        a = dict(a)
        if t == "main": self.inmain += 1
        hidden = a.get("aria-hidden") == "true" or "hidden" in a or t in self.SKIP or "crumbs" in (a.get("class") or "")
        self.depth.append(hidden)
        if hidden: self.skip += 1
        if t in ("h1", "h2", "h3", "h4", "p", "li", "dt", "dd", "figcaption", "blockquote"): self.flush(); self.tag = t
    def handle_endtag(self, t):
        if t in ("h1", "h2", "h3", "h4", "p", "li", "dt", "dd", "figcaption", "blockquote"): self.flush()
        if self.depth and self.depth.pop(): self.skip -= 1
        if t == "main": self.inmain -= 1
    def handle_data(self, d):
        if self.inmain and not self.skip: self.buf += d
    def flush(self):
        s = re.sub(r"\s+", " ", self.buf).strip(); self.buf = ""
        s = re.sub(r"^\d{2}(?=[A-Za-z])", "", s).strip()               # decorative 01/02 counters
        if s in ("Explore", "Scroll to know more", "Read more", "View More"): return
        if not s or not self.tag: return
        pre = {"h1": "# ", "h2": "## ", "h3": "### ", "h4": "#### ", "li": "- "}.get(self.tag, "")
        if not self.out or self.out[-1] != pre + s: self.out.append(pre + s)


def page_text(src):
    p = Text(); p.feed(src); p.flush()
    return "\n".join(p.out)


def crumbs(src, page, h1):
    nav = re.search(r'<nav aria-label="Breadcrumb"[^>]*>(.*?)</nav>', src, re.S)
    items = [("Home", url_of("index.html"))]
    if nav:
        for href, name in re.findall(r'<a href="([^"]+)">([^<]+)</a>', nav.group(1)):
            if href != "index.html": items.append((html.unescape(name), url_of(href.split("#")[0])))
    if page != "index.html": items.append((h1, url_of(page)))
    return {"@type": "BreadcrumbList", "@id": url_of(page) + "#breadcrumb",
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(items)]}


def build(page, src):
    head = src.split("</head>")[0]
    title = html.unescape(re.search(r"<title>(.*?)</title>", head, re.S).group(1).strip())
    desc = meta(head, "description")
    h1 = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", re.search(r"<h1[^>]*>(.*?)</h1>", src, re.S).group(1)))).strip()
    if page == "index.html": h1 = "Exterprise home"
    url = url_of(page)
    kind = {"about.html": "AboutPage", "contact.html": "ContactPage"}.get(page, "WebPage")
    webpage = {"@type": kind, "@id": url + "#webpage", "url": url, "name": title, "description": desc, "isPartOf": {"@id": SITE_ID},
               "about": {"@id": ORG_ID}, "primaryImageOfPage": OG_IMAGE, "inLanguage": "en-US"}
    graph = [ORG, WEBSITE, webpage]
    if page != "index.html":
        graph.append(crumbs(src, page, h1)); webpage["breadcrumb"] = {"@id": url + "#breadcrumb"}
    if page not in NOT_SERVICES:
        graph.append({"@type": "Service", "@id": url + "#service", "name": h1, "description": desc, "url": url, "provider": {"@id": ORG_ID},
                      "areaServed": [{"@type": "Country", "name": "United States"}, {"@type": "Place", "name": "Worldwide"}]})
        webpage["mainEntity"] = {"@id": url + "#service"}
    faq = re.findall(r'<details class="faq-i"><summary><h3>(.*?)</h3>.*?<div class="faq-a"><p>(.*?)</p></div></details>', src, re.S)
    if faq:
        graph.append({"@type": "FAQPage", "@id": url + "#faq", "url": url, "isPartOf": {"@id": url + "#webpage"},
                      "mainEntity": [{"@type": "Question", "name": html.unescape(q), "acceptedAnswer": {"@type": "Answer", "text": html.unescape(a)}} for q, a in faq]})
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, separators=(",", ":"))
    e = lambda s: html.escape(s, quote=True)
    block = "\n".join([
        "<!-- seo: generated by tools/seo.py -->",
        f'<link href="{url}" rel="canonical"/>',
        '<meta content="index,follow,max-image-preview:large,max-snippet:-1" name="robots"/>',
        '<link href="llms.txt" rel="alternate" title="Site guide for AI assistants" type="text/plain"/>',
        '<meta content="website" property="og:type"/>', '<meta content="Exterprise" property="og:site_name"/>', '<meta content="en_US" property="og:locale"/>',
        f'<meta content="{e(title)}" property="og:title"/>', f'<meta content="{e(desc)}" property="og:description"/>', f'<meta content="{url}" property="og:url"/>',
        f'<meta content="{OG_IMAGE}" property="og:image"/>', '<meta content="1200" property="og:image:width"/>', '<meta content="630" property="og:image:height"/>',
        '<meta content="Exterprise: ServiceNow Premier Partner, smartsourcing and enterprise solutions" property="og:image:alt"/>',
        '<meta content="summary_large_image" name="twitter:card"/>', f'<meta content="{e(title)}" name="twitter:title"/>',
        f'<meta content="{e(desc)}" name="twitter:description"/>', f'<meta content="{OG_IMAGE}" name="twitter:image"/>',
        f'<script type="application/ld+json">{ld}</script>',
        "<!-- /seo -->"])
    src = re.sub(r"\n?<!-- seo: generated.*?<!-- /seo -->", "", src, flags=re.S)
    anchor = re.search(r'<meta[^>]*name="description"[^>]*/?>', src)
    src = src[:anchor.end()] + "\n" + block + src[anchor.end():]
    return src, {"page": page, "url": url, "title": title, "desc": desc, "h1": h1, "text": page_text(src)}


def lastmod(page):
    try:
        d = subprocess.run(["git", "log", "-1", "--format=%cs", "--", page], cwd=ROOT, capture_output=True, text=True).stdout.strip()
        return d or datetime.date.today().isoformat()
    except Exception:
        return datetime.date.today().isoformat()


def main():
    pages = sorted(p.name for p in ROOT.glob("*.html") if p.name != "404.html")
    info = []
    for page in pages:
        f = ROOT / page; src, i = build(page, f.read_text(encoding="utf-8")); f.write_text(src, encoding="utf-8"); info.append(i)
    order = lambda i: (i["page"] != "index.html", i["page"] not in ("servicenow.html", "smartsourcing.html", "about.html", "contact.html"), i["page"])
    info.sort(key=order)
    # sitemap
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for i in info:
        sm.append(f"  <url><loc>{i['url']}</loc><lastmod>{lastmod(i['page'])}</lastmod></url>")
    sm.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(sm) + "\n", encoding="utf-8")
    # llms.txt
    groups = [("Company", ["index.html", "about.html", "contact.html"]),
              ("ServiceNow", [p for p in pages if p in ("servicenow.html", "ai-agents-now-assist.html", "ai-control-tower.html", "servicenow-otto.html", "it-service-management.html",
                  "it-operations-management.html", "customer-service-management.html", "hr-service-delivery.html", "field-service-management.html", "strategic-portfolio-management.html",
                  "governance-risk-compliance.html", "cmdb-data-foundations.html", "now-platform.html", "servicenow-nonprofits.html")]),
              ("Smartsourcing (business process outsourcing)", [p for p in pages if p in ("smartsourcing.html", "contact-center.html", "records-processing.html", "county-government-services.html", "data-capture-services.html",
                  "bid-processing.html", "inspection-services.html", "vendor-management.html")])]
    used = {p for _, ps in groups for p in ps}
    groups.append(("Technology, AI and digital", [p for p in pages if p not in used]))
    by = {i["page"]: i for i in info}
    L = ["# Exterprise", "",
         "> Exterprise (Exterprise LLC) is a ServiceNow Premier Partner for consulting and implementation and a global smartsourcing "
         "(business process outsourcing) provider. Founded in 2015 and headquartered in Dallas, Texas, with delivery centers in Chennai "
         "and Coimbatore (India) and San Pedro Sula (Honduras); 500+ professionals.", "",
         "Key facts: ServiceNow Premier Partner (Consulting & Implementation) and licensed ServiceNow reseller; Now Assist certifications for "
         "ITSM, HRSD and Creator; Moveworks implementation partner; 99.995% data accuracy in county records work; 99.99% SLA adherence in "
         "contact center work; 1M+ records processed every month. Contact: contact@exterprise.us.", "",
         "Agents: you are welcome to read, summarize and cite these pages with a link back. Please do not download or reuse images, video, "
         "fonts or code. Full policy: " + SITE + "/agents.md. Full page text: " + SITE + "/llms-full.txt", ""]
    L += ["## Solutions (external sites)", "",
          "- [ServOps](https://servops.com/): service operations excellence on ServiceNow, from Exterprise.",
          "- [UtterNow](https://dev.utternow.ai/): voice for ServiceNow; create tickets, look up answers and start processes hands-free.",
          "- [Omnitix](https://omnitix.us/): omni-channel contact center solutions, multilingual and 24/7 across voice, email, text and chat.", ""]
    for name, ps in groups:
        L += [f"## {name}", ""] + [f"- [{by[p]['h1']}]({by[p]['url']}): {by[p]['desc']}" for p in ps if p in by] + [""]
    (ROOT / "llms.txt").write_text("\n".join(L), encoding="utf-8")
    F = ["# Exterprise: full site text", "", f"Source: {SITE}/ (generated {datetime.date.today().isoformat()}). Cite the page URL when quoting.", ""]
    for i in info:
        F += ["---", "", f"URL: {i['url']}", f"Title: {i['title']}", f"Summary: {i['desc']}", "", i["text"], ""]
    (ROOT / "llms-full.txt").write_text("\n".join(F), encoding="utf-8")
    print(f"{len(info)} pages, sitemap.xml, llms.txt, llms-full.txt -> {SITE}")


if __name__ == "__main__":
    main()
