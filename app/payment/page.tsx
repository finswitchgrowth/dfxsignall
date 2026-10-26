import { ManualCryptoPayment } from "@/components/payment/ManualCryptoPayment";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Manual Crypto Payments",
  description: "Pay for DFXSIGNALL packages using BTC, USDT ERC-20 or USDT TRC-20, subject to manual verification.",
  path: "/payment",
  noindex: true,
});

export default function Page() {
  return <ManualCryptoPayment />;
}
