#!/usr/bin/env python3
"""Visible FAQ sections for key pages (answer engines quote these; tools/seo.py turns them into FAQPage data).

Edit the questions and answers below, then run:
    python3 tools/faq.py && python3 tools/seo.py
Answers are written answer-first (the first sentence answers the question on its own) and only state facts
that appear elsewhere on the site.
"""
import html, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent

FAQ = {
    "index.html": [
        ("What does Exterprise do?",
         "Exterprise is a ServiceNow Premier Partner for consulting and implementation and a smartsourcing (business process outsourcing) company. "
         "We implement and support ServiceNow, including AI Agents and Now Assist, and run business processes such as contact center, records processing "
         "and data capture for clients in the US and around the world."),
        ("Is Exterprise a ServiceNow partner?",
         "Yes. Exterprise is a ServiceNow Premier Partner for Consulting & Implementation and a licensed ServiceNow reseller, with a team of ServiceNow-accredited "
         "professionals and Now Assist certifications for IT Service Management, HR Service Delivery and Creator."),
        ("Where is Exterprise located?",
         "Exterprise is headquartered in Dallas, Texas, with offshore delivery centers in Chennai and Coimbatore, India, and a near-shore center in "
         "San Pedro Sula, Honduras. More than 500 professionals work across these locations, so work can run around the clock."),
        ("Which industries does Exterprise work with?",
         "Exterprise works with county governments, nonprofits and enterprises in government, "
         "oil and gas, retail and real estate, delivering ServiceNow, outsourcing and custom technology solutions."),
        ("What solutions does Exterprise offer?",
         "Exterprise offers three solutions: ServOps, for service operations excellence on ServiceNow (servops.com); UtterNow, which lets people "
         "run ServiceNow workflows by voice (utternow.ai); and Omnitix, omni-channel contact center solutions with multilingual, 24/7 support "
         "across voice, email, text and chat (omnitix.us)."),
        ("How do I start a project with Exterprise?",
         "Email contact@exterprise.us or send a message from the Contact page. A consultant or ServiceNow architect will review your goals and suggest "
         "the right next step, whether that is an assessment, an implementation plan or a dedicated team."),
    ],
    "servicenow.html": [
        ("What ServiceNow services does Exterprise offer?",
         "Exterprise covers ServiceNow from start to finish: advisory, implementation, integration, migration, upgrades and ongoing support. That includes "
         "ITSM, ITOM, CSM, HR Service Delivery, Field Service Management, SPM, GRC / IRM, CMDB, Now Platform app development, AI Agents, Now Assist, "
         "AI Control Tower and ServiceNow Otto."),
        ("What does ServiceNow Premier Partner status mean for my project?",
         "It means ServiceNow recognizes Exterprise at the Premier level for consulting and implementation. Because we are also a licensed ServiceNow "
         "reseller, you can buy licenses, implement and get ongoing support from one team."),
        ("Can Exterprise implement ServiceNow AI Agents and Now Assist?",
         "Yes. Exterprise is certified to implement Now Assist for IT Service Management, HR Service Delivery and Creator, and sets up AI Agents with "
         "guardrails and human review points. AI Control Tower keeps every agent visible and accountable."),
        ("Can you improve a ServiceNow instance we already have?",
         "Yes. We assess existing implementations, clean up the CMDB with Discovery and the CSDM data model, handle platform and version upgrades, and "
         "build a roadmap showing where Predictive Intelligence, Now Assist and AI Agents add the most value."),
        ("Does Exterprise provide ServiceNow support after go-live?",
         "Yes. Exterprise offers L1 to L4 managed support with 24x7 monitoring across the full ticket lifecycle, plus certified ServiceNow developers, "
         "administrators and consultants at onshore, near-shore or offshore rates."),
    ],
    "it-service-management.html": [
        ("What is included in a ServiceNow ITSM implementation with Exterprise?",
         "Exterprise deploys ServiceNow IT Service Management together with Now Assist for ITSM and Predictive Intelligence, configured to your case types, "
         "categories and resolution patterns, so incidents are routed automatically and Now Assist summarizes cases and drafts resolution notes."),
        ("Is Exterprise certified for Now Assist for ITSM?",
         "Yes. Exterprise holds Now Assist for ITSM (Pro Plus Suite) certification, with nine certified staff, and is a ServiceNow Premier Partner for "
         "Consulting & Implementation."),
        ("Can you assess our current ITSM setup?",
         "Yes. Our ITSM and ITIL advisory assesses your existing implementation, or designs one from scratch, with a clear roadmap for where Predictive "
         "Intelligence and Now Assist add the most value."),
        ("Do you offer ITSM managed support?",
         "Yes. Exterprise provides L1 to L4 managed support with 24x7 monitoring, using AI Search and Now Assist triage to reduce time to resolution."),
    ],
    "ai-agents-now-assist.html": [
        ("What do ServiceNow AI Agents do?",
         "ServiceNow AI Agents take the next step on their own: they triage a ticket, close out a routine request, or pass it to a person with the full "
         "history attached. AI Agent Orchestrator coordinates several agents so they hand off work cleanly."),
        ("Is Exterprise certified to implement Now Assist?",
         "Yes. Exterprise is certified to implement Now Assist for IT Service Management, HR Service Delivery and Creator, and is a ServiceNow Premier "
         "Partner for Consulting & Implementation with a team of ServiceNow-accredited professionals."),
        ("How do you keep AI Agents safe and accountable?",
         "Every agent is set up with clear guardrails on what it can and cannot do on its own, plus human review points. AI Control Tower configuration "
         "and monitoring keeps each agent's activity visible and auditable."),
        ("Where should we start with ServiceNow AI?",
         "Start with an AI Readiness Assessment. Process Mining shows where your workflows create real bottlenecks, so AI Agents target actual friction "
         "instead of guesses."),
    ],
    "servicenow-nonprofits.html": [
        ("What ServiceNow programs does Exterprise offer nonprofits?",
         "Exterprise offers six ServiceNow quick-start programs built for nonprofits: IT Service Management, Customer Service Management, Field Service "
         "Management, IT Operations Management, HR Service Delivery and the Now Platform. Each one has a demo video and a brochure on this page."),
        ("How long does a nonprofit quick start take?",
         "Six to seven weeks of consulting, implementation, testing and go-live. Integrations, data migration, ServiceNow licensing and other "
         "customizations can change the timeline, and we scope those with you up front."),
        ("What support do nonprofits get after go-live?",
         "Every quick start includes two months of support after go-live, for up to 20 hours a month, plus virtual training sessions for your team "
         "and a dedicated nonprofit hourly rate for work beyond the program."),
        ("Can nonprofits pay over time?",
         "Yes. Each quick start has a fixed scope and budget with flexible payment terms, so you know the cost before you begin."),
    ],
    "smartsourcing.html": [
        ("What is smartsourcing?",
         "Smartsourcing is Exterprise's approach to business process outsourcing: onshore, offshore and near-shore teams backed by a technology platform, "
         "taking on processes such as contact center support, records and county records processing "
         "and data capture."),
        ("Where are Exterprise's outsourcing teams?",
         "Exterprise is headquartered in Dallas, Texas, with delivery centers in Chennai and Coimbatore, India, and San Pedro Sula, Honduras: four "
         "delivery centers on three continents, running 24x7."),
        ("How accurate and reliable is the work?",
         "Exterprise holds a 99.99% adherence rate to SLAs and reaches 99.995% data accuracy in county records and data capture work."),
        ("Is outsourced work secure and compliant?",
         "Yes. Exterprise operates under SOC 2 Type II, ISO 27001 and HIPAA, with control activities validated every year by an independent Certified "
         "Public Accountant."),
    ],
    "contact-center.html": [
        ("What contact center support does Exterprise provide?",
         "Exterprise provides Level 1 support (initial inquiries, basic technical help and first-line assistance) and Level 2 support for more complex "
         "technical issues, staffed around the clock from onshore, offshore and near-shore teams."),
        ("Is the contact center available 24x7?",
         "Yes. Multi-shift operations across Chennai and Coimbatore, India, and San Pedro Sula, Honduras, coordinated from Dallas, Texas, keep "
         "support running 24x7."),
        ("How is contact center outsourcing priced?",
         "You can choose FTE-based pricing, hourly pricing, a fixed project fee or per-unit transactional pricing, so budgets are planned with full "
         "transparency."),
        ("What service levels does Exterprise achieve?",
         "Exterprise maintains a 99.99% adherence rate to SLAs, under SOC 2 Type II, ISO 27001 and HIPAA controls validated every year by an "
         "independent Certified Public Accountant."),
    ],
}

ICON = '<span aria-hidden="true" class="faq-ic"></span>'


def section(items):
    rows = "".join(
        f'<details class="faq-i"><summary><h3>{html.escape(q)}</h3>{ICON}</summary><div class="faq-a"><p>{html.escape(a)}</p></div></details>'
        for q, a in items)
    return ('<!-- faq: generated by tools/faq.py -->'
            '<div aria-hidden="true" class="seam seam-2"></div><section aria-labelledby="faq-h" class="section inr-sec faq-sec" id="faq">'
            '<div class="wrap"><div class="sec-head stack"><h2 class="kt ktx kt-solo" id="faq-h"><span class="kt-1">Frequently Asked Questions</span></h2></div>'
            f'<div class="faq">{rows}</div></div></section><!-- /faq -->')


def main():
    for page, items in FAQ.items():
        f = ROOT / page; s = f.read_text(encoding="utf-8")
        s = re.sub(r"<!-- faq: generated.*?<!-- /faq -->", "", s, flags=re.S)
        if '<nav aria-label="Page navigation"' in s:                      # sub-pages: just above the prev/next pager
            at = s.rindex("<section", 0, s.index('<nav aria-label="Page navigation"'))
        else:                                                              # otherwise just above the closing contact section
            at = s.rindex("<section", 0, s.index('id="contact"'))
        seam = s.rfind('<div aria-hidden="true" class="seam', 0, at)
        if seam != -1 and s[seam:at].count("</div>") == 1 and s[seam:at].strip().endswith("</div>"):
            at = seam
        s = s[:at] + section(items) + s[at:]
        f.write_text(s, encoding="utf-8")
    print("FAQ sections:", ", ".join(FAQ))


if __name__ == "__main__":
    main()
