export type FaqItem = { q: string; a: string; category: "General" | "Signals" | "Platform" | "Safety" };

export const faqs: FaqItem[] = [
  {
    category: "General",
    q: "What is DFXSIGNALL?",
    a: "DFXSIGNALL provides market information, structured trading ideas and research tools. Availability varies by account and subscription; features are described as they are actually enabled.",
  },
  {
    category: "Signals",
    q: "What exactly is a trading signal?",
    a: "A signal is a structured trade idea that may include the instrument, direction, entry, stop loss, target, timeframe and reasoning. It is information to evaluate, not an instruction or promise of an outcome.",
  },
  {
    category: "Signals",
    q: "Are signals guaranteed to be profitable?",
    a: "No. Markets are uncertain and any trade can lose money, including trades based on well-reasoned signals. DFXSIGNALL does not promise returns, profits or capital protection. Never risk money you cannot afford to lose.",
  },
  {
    category: "General",
    q: "Is DFXSIGNALL financial advice?",
    a: "Platform content is general market information and research unless expressly stated otherwise. It does not assess your personal circumstances. The regulatory status of any specific service depends on its actual features and applicable law; seek independent professional advice before making financial decisions.",
  },
  {
    category: "Platform",
    q: "Is the client platform available?",
    a: "Account registration, client access, subscription records and signal tools are being operated in stages. Access to any feature depends on the live account status and applicable plan. Contact support through the official website if a feature does not work as described.",
  },
  {
    category: "Signals",
    q: "Which markets does DFXSIGNALL cover?",
    a: "The platform may display forex, metals, indices, digital assets or other instruments depending on the feature and data source. Coverage is not guaranteed for every instrument or at every time; check the instrument and timestamp shown with each item.",
  },
  {
    category: "Platform",
    q: "Is market data on this website live?",
    a: "Do not assume a chart, quote or example is real-time. Some website visuals use simulated or third-party embedded data, which may be delayed or subject to provider terms. A signal is not verified live market data unless its source and timestamp are explicitly provided.",
  },
  {
    category: "Safety",
    q: "How are subscription payments reviewed?",
    a: "Where payment-proof submission is enabled, a submission is a review request and does not itself activate a paid plan. Access should be considered active only when the authenticated account shows the approved entitlement. Use only the payment instructions shown through the official website and retain your transaction record.",
  },
  {
    category: "Safety",
    q: "Does DFXSIGNALL execute trades or connect to my broker?",
    a: "The current signal platform is informational. Do not assume that signals execute trades, connect to a broker or manage your funds. No automated trade execution should be considered enabled unless a separately documented and verified feature explicitly says so.",
  },
  {
    category: "Safety",
    q: "How do I protect my account?",
    a: "Use a unique password, never share passwords or one-time codes, and access the platform through the official domain. DFXSIGNALL support should not need your trading password or account recovery codes.",
  },
  {
    category: "Safety",
    q: "What should I do if a payment or account issue occurs?",
    a: "Keep your payment reference and submission timestamp, then contact support using the official website. Do not send additional funds to an unofficial contact to resolve an account issue.",
  },
];