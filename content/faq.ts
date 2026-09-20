export type FaqItem = { q: string; a: string; category: "General" | "Signals" | "Platform" | "Safety" };

export const faqs: FaqItem[] = [
  {
    category: "General",
    q: "What is DFXSIGNALL?",
    a: "DFXSIGNALL is a trading intelligence ecosystem built around four pillars — signals, analysis, education and growth. It brings structured trade ideas, market context and learning material into one clear experience.",
  },
  {
    category: "Signals",
    q: "What exactly is a trading signal?",
    a: "A signal is a structured trade idea: the instrument, direction, a proposed entry, a stop loss, one or more take-profit levels, the timeframe and the reasoning behind it. It is information to evaluate — not an instruction, and not a promise of an outcome.",
  },
  {
    category: "Signals",
    q: "Are signals guaranteed to be profitable?",
    a: "No. Markets are uncertain and any trade can lose money, including trades based on well-reasoned signals. DFXSIGNALL does not promise returns, profits or capital protection. Always size positions to a loss you can afford.",
  },
  {
    category: "General",
    q: "Is DFXSIGNALL financial advice?",
    a: "No. Content on DFXSIGNALL is general market information and education. It does not consider your personal circumstances. Consider independent professional advice before making financial decisions.",
  },
  {
    category: "Platform",
    q: "When will the client platform launch?",
    a: "The client dashboard, sign-up, packages checkout and support desk are coming soon. This website currently introduces the ecosystem; follow our official channels for launch updates.",
  },
  {
    category: "Signals",
    q: "Which markets does DFXSIGNALL cover?",
    a: "Coverage is planned across major and minor forex pairs, metals such as gold and silver, major indices, leading digital assets and energy. The exact instrument list is configurable and may change.",
  },
  {
    category: "Platform",
    q: "Is the market data on this website live?",
    a: "No. Charts, prices and signal examples on this website run in clearly labelled DEMO mode using simulated data. Live data will only be shown once a licensed data provider is connected.",
  },
  {
    category: "Safety",
    q: "Does this website accept payments or deposits?",
    a: "No. This website does not accept payments, deposits or account sign-ups. Never send money based on messages or payment details from unofficial sources claiming to represent DFXSIGNALL.",
  },
  {
    category: "Safety",
    q: "How do I contact DFXSIGNALL?",
    a: "Use the contact page or email the official address listed there. We will never ask for your passwords or one-time codes.",
  },
];
