/**
 * Insights / blog posts. Educational content only.
 * `cover` selects a procedural cover artwork (no stock imagery). Add `image` with a real
 * DFXSIGNALL image path in /public to use a supplied photo instead.
 */
export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Education" | "Risk" | "Market Structure" | "Platform";
  date: string; // ISO
  readMinutes: number;
  cover: "signal" | "risk" | "structure" | "evaluate";
  image?: string;
  body: BlogBlock[];
};

export const posts: BlogPost[] = [
  {
    slug: "what-a-trading-signal-is-and-isnt",
    title: "What a trading signal is — and what it isn't",
    excerpt:
      "Entry, stop loss, take profit, timeframe, rationale. How to read a structured signal and why it should never be treated as a guarantee.",
    category: "Education",
    date: "2026-09-01",
    readMinutes: 6,
    cover: "signal",
    body: [
      { type: "p", text: "A trading signal is a structured trade idea. At its best, it compresses a piece of market analysis into a small set of decisions you can evaluate quickly: what to trade, which direction, where the idea is valid, where it is wrong, and where it may be worth taking profit." },
      { type: "h2", text: "The anatomy of a signal" },
      { type: "ul", items: [
        "Instrument and direction — for example, XAU/USD, buy.",
        "Entry — the price or zone where the idea becomes actionable.",
        "Stop loss — the level at which the idea is considered invalid.",
        "Take profit — one or more targets where the reward is realised.",
        "Timeframe — the chart horizon the analysis was built on.",
        "Rationale and confidence — why the idea exists and how strong the setup is.",
      ] },
      { type: "h2", text: "What a signal is not" },
      { type: "p", text: "A signal is not an instruction and not a promise. Even a well-reasoned setup can fail because markets react to information nobody can see in advance. Treat every signal as one input to your own decision, filtered through your risk limits and your plan." },
      { type: "h2", text: "A simple checklist before acting" },
      { type: "ul", items: [
        "Does the stop loss sit at a level you can afford to lose if hit?",
        "Is the reward-to-risk ratio acceptable for your approach?",
        "Does the timeframe match how actively you can monitor the trade?",
        "Is there scheduled news that could make the market gap past your stop?",
      ] },
      { type: "p", text: "Used this way, signals become a decision layer that saves time — not a replacement for judgement." },
    ],
  },
  {
    slug: "position-sizing-the-quiet-edge",
    title: "Position sizing: the quiet edge most traders skip",
    excerpt:
      "Why the size of a trade matters more than the entry — and a practical way to cap risk per trade before you ever click buy or sell.",
    category: "Risk",
    date: "2026-08-22",
    readMinutes: 5,
    cover: "risk",
    body: [
      { type: "p", text: "Two traders can take the same signal and end the month with completely different results. The difference is often not the entry — it is how much each one risked." },
      { type: "h2", text: "Fixed-fraction risk" },
      { type: "p", text: "A common discipline is to risk a small, fixed fraction of your account on each idea. Position size then becomes a calculation rather than a feeling: the distance between entry and stop loss determines how large the position can be while keeping the loss within that limit." },
      { type: "ul", items: [
        "Decide the maximum loss per trade before looking at the chart.",
        "Measure the distance from entry to stop loss.",
        "Size the position so that distance equals your maximum loss.",
        "If the resulting size is too small to be worthwhile, skip the trade.",
      ] },
      { type: "h2", text: "Why it matters" },
      { type: "p", text: "Losing streaks happen to every approach. Sizing keeps a streak survivable, which keeps you in the game long enough for a sound process to matter. It is the least exciting part of trading and the one that protects everything else." },
    ],
  },
  {
    slug: "reading-market-structure",
    title: "Reading market structure: trends, ranges and volatility",
    excerpt:
      "Before any indicator, there is structure. A practical introduction to higher highs, lower lows, ranges and how volatility changes the plan.",
    category: "Market Structure",
    date: "2026-08-12",
    readMinutes: 7,
    cover: "structure",
    body: [
      { type: "p", text: "Market structure is the shape price leaves behind. Learning to read it gives context to every signal, indicator and headline." },
      { type: "h2", text: "Trends" },
      { type: "p", text: "An uptrend is a sequence of higher highs and higher lows; a downtrend is the reverse. Trend-following ideas generally look for entries in the direction of that sequence, often after a pullback." },
      { type: "h2", text: "Ranges" },
      { type: "p", text: "When price oscillates between a clear ceiling and floor, the market is ranging. Ideas that work in trends can struggle here, and breakouts from ranges are frequently tested before they continue." },
      { type: "h2", text: "Volatility" },
      { type: "ul", items: [
        "Higher volatility usually needs wider stops and therefore smaller positions.",
        "Volatility often clusters around scheduled economic releases.",
        "A quiet market can change character quickly — plans should account for that.",
      ] },
      { type: "p", text: "Structure does not predict the future. It frames probability, so that each decision is made with context instead of in isolation." },
    ],
  },
  {
    slug: "how-to-evaluate-a-signals-provider",
    title: "How to evaluate a signals provider",
    excerpt:
      "Transparency, verifiable history, clear risk parameters and no guaranteed returns. The questions worth asking before you trust anyone's trade ideas.",
    category: "Education",
    date: "2026-07-30",
    readMinutes: 5,
    cover: "evaluate",
    body: [
      { type: "p", text: "The signals industry ranges from careful analysts to outright scams. A handful of questions separates them quickly — and we believe DFXSIGNALL should be held to the same standard." },
      { type: "h2", text: "Questions worth asking" },
      { type: "ul", items: [
        "Does every signal include a stop loss, or only entries and targets?",
        "Is the full history published — losses included — with a clear methodology?",
        "Are results described as verified historical data, or as screenshots and claims?",
        "Does the provider promise fixed or guaranteed returns? That is a red flag.",
        "Are you ever asked to send money to personal accounts or unofficial channels?",
      ] },
      { type: "h2", text: "Our position" },
      { type: "p", text: "DFXSIGNALL will not publish guaranteed-return claims. Performance information will only be shown when it is backed by verifiable data and accompanied by the relevant risk disclosure." },
    ],
  },
];

export const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
