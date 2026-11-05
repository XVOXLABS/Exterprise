#!/usr/bin/env python3
"""Search titles and meta descriptions per page (what Google, Bing and AI answer engines show).
Edit here, then run:  python3 tools/meta.py && python3 tools/seo.py"""
import html, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
P = "ServiceNow Premier Partner"
META = {
 "index.html": ("ServiceNow Implementation Partner & BPO Services | Exterprise",
   f"Exterprise is a {P} for consulting and implementation and a smartsourcing (BPO) provider, with 500+ professionals in Dallas, India and Honduras."),
 "about.html": ("About Exterprise | ServiceNow Partner & BPO, Dallas TX",
   f"Founded in 2015 in Dallas, Texas, Exterprise is a {P} and global smartsourcing provider with 500+ professionals across the US, India and Honduras."),
 "contact.html": ("Contact Exterprise | ServiceNow & Outsourcing Experts",
   "Talk to an Exterprise consultant or ServiceNow architect about implementation, AI Agents, outsourcing or support. Email contact@exterprise.us."),
 "servicenow.html": ("ServiceNow Implementation & Consulting Partner | Exterprise",
   f"{P} for Consulting & Implementation: ITSM, ITOM, CSM, HRSD, FSM, SPM, GRC, CMDB, AI Agents and Now Assist, from advisory to 24x7 support."),
 "ai-agents-now-assist.html": ("ServiceNow AI Agents & Now Assist Implementation | Exterprise",
   "Deploy ServiceNow AI Agents and Now Assist with a certified Premier Partner: Now Assist certified for ITSM, HRSD and Creator, with guardrails and governance."),
 "ai-control-tower.html": ("ServiceNow AI Control Tower Implementation | Exterprise",
   "Govern every AI agent, Now Assist skill and third-party model from one place. Exterprise sets up ServiceNow AI Control Tower, from intake to monitoring."),
 "servicenow-otto.html": ("ServiceNow Otto & Moveworks Implementation | Exterprise",
   "One conversational front door for employees and customers. As a Moveworks implementation partner, Exterprise brings Now Assist, Moveworks and AI Experience together in Otto."),
 "it-service-management.html": ("ServiceNow ITSM Implementation Partner | Exterprise",
   "ServiceNow ITSM implementation with Now Assist for ITSM and Predictive Intelligence, by a certified Premier Partner. Advisory, deployment, staffing and L1-L4 support."),
 "it-operations-management.html": ("ServiceNow ITOM & AIOps Implementation | Exterprise",
   "ServiceNow ITOM implementation: Discovery, Service Mapping, Event Management and Predictive AIOps that catch problems before they become outages."),
 "customer-service-management.html": ("ServiceNow CSM Implementation Partner | Exterprise",
   "ServiceNow Customer Service Management implementation: Predictive Intelligence and Advanced Work Assignment route every case to the right agent, fast."),
 "hr-service-delivery.html": ("ServiceNow HRSD Implementation Partner | Exterprise",
   "ServiceNow HR Service Delivery implementation with Employee Center, HR Virtual Agent and Now Assist for HRSD, by a certified ServiceNow Premier Partner."),
 "field-service-management.html": ("ServiceNow FSM Implementation Partner | Exterprise",
   "ServiceNow Field Service Management implementation: Schedule Optimization, AI Agents and the FSM mobile copilot so technicians fix it on the first visit."),
 "strategic-portfolio-management.html": ("ServiceNow SPM Implementation Partner | Exterprise",
   "ServiceNow Strategic Portfolio Management implementation: Portfolio Planning, Demand Management and Financial Planning with a live view of every investment."),
 "governance-risk-compliance.html": ("ServiceNow GRC / IRM Implementation | Exterprise",
   "ServiceNow GRC and IRM implementation: policy, risk and audit workflows connected to the systems where work happens, so compliance is never a spreadsheet."),
 "cmdb-data-foundations.html": ("ServiceNow CMDB & CSDM Implementation | Exterprise",
   "Build and clean up your ServiceNow CMDB with Discovery, Service Graph Connectors and the CSDM data model, so AI Agents and workflows run on accurate data."),
 "now-platform.html": ("ServiceNow App Engine & Now Platform Development | Exterprise",
   "Custom ServiceNow applications with App Engine, Flow Designer, IntegrationHub and Build Agent, deployed inside the Now Platform with AI governance."),
 "servicenow-nonprofits.html": ("ServiceNow for Nonprofits: Quick-Start Programs | Exterprise",
   "Six ServiceNow quick-start programs for nonprofits (ITSM, CSM, FSM, ITOM, HRSD and Now Platform), live in six to seven weeks with flexible payment terms and support after go-live."),
 "smartsourcing.html": ("Business Process Outsourcing (BPO) Services | Exterprise",
   "Smartsourcing from Exterprise: contact center, records processing, county records and data capture outsourcing, 24x7 from the US, India and Honduras."),
 "contact-center.html": ("24x7 Contact Center Outsourcing (L1 & L2) | Exterprise",
   "Outsourced Level 1 and Level 2 contact center support, staffed 24x7 from onshore, offshore and near-shore teams, with 99.99% SLA adherence."),
 "records-processing.html": ("Records Digitization & Indexing Services | Exterprise",
   "Records digitization, data entry, indexing, search and retrieval with 99.995% county and data capture accuracy and double-key entry validation."),
 "county-government-services.html": ("County Records Digitization & Conversion | Exterprise",
   "Official property and vital records conversion for county governments: scanning, indexing, filing and book preservation with 99.995% data accuracy."),
 "data-capture-services.html": ("Data Capture & Data Entry Services (OCR) | Exterprise",
   "OCR-based data capture with centralized capture, cleanup and indexing, plus scanning, verification and updating of physical records."),
 "custom-ai-solutions.html": ("Custom AI & Machine Learning Solutions | Exterprise",
   "Custom AI solutions designed around your business: ServiceNow AI Agents, drone image analytics and machine learning on your own data, built, deployed and supported."),
 "ai-image-analytics.html": ("AI Image Analytics & Computer Vision | Exterprise",
   "AI image analytics for construction and engineering sites: drone-captured aerial imagery on an AI platform that shows progress, discrepancies and completion in one view."),
 "enterprise-solutions.html": ("Enterprise Solutions: AI, Apps & Solution Design | Exterprise",
   "Custom or off-the-shelf enterprise solutions: AI image analytics, application development and solution design, from implementation and migration to upgrades and support."),
 "technical.html": ("Custom Software & Technical Services | Exterprise",
   "Bespoke technical solutions for government, oil and gas, retail and real estate: solution design, application development, deployment and maintenance."),
 "application-development.html": ("Custom Application Development Services | Exterprise",
   "Custom application development across the full stack, from front end to deployment, with platform customization and integration on future-proof technology."),
 "deployment-maintenance.html": ("Application Deployment & Maintenance | Exterprise",
   "Application deployment, support and maintenance with 24x7 coverage, 99.99% SLA adherence and three pricing models, from a team with 5+ years managing complex IT applications."),
 "solution-design.html": ("Solution Design & Requirements Management | Exterprise",
   "Strategy before software: requirement management, solution design and architecture, and execution methodology for your next technology project."),
 "design-services.html": ("UX/UI Design Services | Exterprise",
   "From user research and personas to information architecture, prototypes, visual design and front-end development for digital products."),
 "digital-branding-marketing.html": ("Digital Branding & Marketing Services | Exterprise",
   "Websites, apps, marketing and visual storytelling that bring your brand to life, from one team working to one plan."),
 "digital-marketing.html": ("Digital Marketing Services | Exterprise",
   "Measurable digital marketing: campaigns across every channel with mobile reach, real-time flexibility, direct communication and influencer engagement."),
 "digital-enablement.html": ("Mobile App, PWA & E-commerce Development | Exterprise",
   "Digital enablement: mobile apps, progressive web apps, e-commerce and CMS/LMS solutions that bring enterprise systems to every device."),
}
def main():
    for page, (title, desc) in META.items():
        f = ROOT / page; s = f.read_text(encoding="utf-8")
        s = re.sub(r"<title>.*?</title>", "<title>" + html.escape(title, quote=False) + "</title>", s, count=1, flags=re.S)
        s, n = re.subn(r'<meta content="[^"]*" name="description"/>', '<meta content="' + html.escape(desc, quote=True) + '" name="description"/>', s, count=1)
        assert n == 1, page
        f.write_text(s, encoding="utf-8")
    long_t = [p for p, (t, _) in META.items() if len(t) > 62]; long_d = [p for p, (_, d) in META.items() if len(d) > 165]
    print(len(META), "pages updated. Titles over 62 chars:", long_t, "Descriptions over 165:", long_d)
if __name__ == "__main__":
    main()
