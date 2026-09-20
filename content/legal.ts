import type { LegalSection } from "@/components/layout/LegalPage";
import { site } from "./site";

export const LEGAL_UPDATED = "September 11, 2026";

export const terms: LegalSection[] = [
  { id: "about", title: "About these terms", body: [`These terms govern your use of the ${site.name} website. By using the website you agree to them. If you do not agree, please do not use the website.`] },
  {
    id: "website",
    title: "Nature of the website",
    body: [
      `This website provides general information about ${site.name}, its planned client platform, signal packages and educational content. Client accounts, logins, payments and subscriptions are not available on this website and are marked “Coming soon”.`,
      "Market prices, charts, indicators and signal examples shown on the website are simulated demo content and are not live or historical market data.",
    ],
  },
  {
    id: "no-advice",
    title: "No financial advice",
    body: [
      "Nothing on this website is investment, financial, legal, accounting or tax advice, a recommendation, or an offer or solicitation to buy or sell any financial instrument. Content does not take your personal circumstances into account.",
    ],
  },
  {
    id: "packages",
    title: "Packages and pricing",
    body: [
      "Package descriptions and prices on this website are indicative and may change before launch. Any future subscription will be governed by the terms presented at the time of purchase inside the client platform.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: [
      "You agree not to:",
      [
        "attempt unauthorised access to the website or its infrastructure;",
        "interfere with security features or the operation of the website;",
        "use the website for fraud, market manipulation or any unlawful purpose;",
        `impersonate ${site.name} or misuse its name, logo or content.`,
      ],
    ],
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: [`The ${site.name} name, logo, design and content are owned by or licensed to ${site.name}. You may not copy, modify or redistribute them without permission, other than for personal, non-commercial reference.`],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: [
      "The website is provided “as is”. To the extent permitted by law, we are not liable for losses arising from reliance on website content, including trading losses, or from interruptions or errors in the website.",
    ],
  },
  { id: "changes", title: "Changes", body: ["We may update these terms as the business, services or applicable requirements change. The “Last updated” date shows when they were last revised."] },
];

export const privacy: LegalSection[] = [
  { id: "overview", title: "Overview", body: [`This notice explains how the ${site.name} website handles information. The website is informational: it does not offer accounts, logins or payments.`] },
  {
    id: "collect",
    title: "Information we collect",
    body: [
      "This website does not ask you to create an account or submit payment details.",
      "The contact form does not send data to our servers — it opens your own email app with a pre-filled message. If you email us, we receive the information you choose to include, such as your name, email address and message.",
      "Like most websites, our hosting provider may process technical data such as IP address, browser type and request logs to deliver and secure the website.",
    ],
  },
  {
    id: "storage",
    title: "Cookies and local storage",
    body: [
      "The website stores a small session flag in your browser so the brand intro animation plays only once per visit. It contains no personal information and is removed when you close the tab.",
      "We do not use advertising cookies on this website.",
    ],
  },
  { id: "use", title: "How we use information", body: ["We use information you send us to respond to your enquiry, to keep the website secure, and to meet legal obligations."] },
  { id: "sharing", title: "Sharing", body: ["We do not sell personal information. We may share it with service providers that host or support the website, or where required by law."] },
  { id: "rights", title: "Your rights", body: ["Depending on where you live, you may have rights to access, correct, delete or object to the use of your personal information. To make a request, contact us using the details below."] },
  { id: "contact", title: "Contact", body: [`For privacy questions, email ${site.contact.email}.`] },
];

export const riskDisclosure: LegalSection[] = [
  {
    id: "high-risk",
    title: "Trading involves high risk",
    body: [
      "Trading forex, metals, indices, commodities, contracts for difference and digital assets carries a high level of risk and may not be suitable for all people. Prices can move rapidly and you may lose some or all of the money you trade. Leverage can magnify losses as well as gains.",
    ],
  },
  {
    id: "signals",
    title: "Signals are information, not instructions",
    body: [
      `${site.name} signals and analysis are general market information and education. They do not consider your objectives, financial situation or needs. You are solely responsible for your trading decisions and their outcomes.`,
    ],
  },
  {
    id: "no-guarantee",
    title: "No guaranteed results",
    body: [
      `${site.name} does not guarantee profits, returns or capital protection. Confidence ratings describe setup quality and are not probabilities of profit. Past or simulated performance is not a reliable indicator of future results.`,
    ],
  },
  {
    id: "demo",
    title: "Demo and simulated data",
    body: ["Prices, charts, indicators and signal examples on this website are simulated for demonstration. They are not live or historical market data and must not be used to make trading decisions."],
  },
  {
    id: "advice",
    title: "No financial advice",
    body: ["Nothing on this website is investment, financial, legal or tax advice. Consider seeking independent professional advice before trading."],
  },
  {
    id: "jurisdiction",
    title: "Jurisdiction and eligibility",
    body: [
      "Financial products and services are regulated differently across jurisdictions. Some services may be unavailable or restricted where you live. It is your responsibility to ensure your use of any service is lawful in your jurisdiction.",
    ],
  },
  {
    id: "scams",
    title: "Protect yourself",
    body: [
      `This website does not accept payments or deposits. Never send money to anyone claiming to represent ${site.name} through chats, social media or personal accounts, and be wary of anyone offering guaranteed returns.`,
    ],
  },
];
