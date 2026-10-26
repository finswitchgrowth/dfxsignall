import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo";
import AccountManagementForm from "@/components/account/AccountManagementForm";

export const metadata = buildMetadata({
  title: "Account Management Services",
  description: "Request secure account-management onboarding for supported MT4/MT5 brokers. Never share broker passwords or private keys.",
  path: "/account-management",
});

export default function AccountManagementPage() {
  return <>
    <PageHero eyebrow="Account Management Services" title="Your trading account. Clearer oversight." lead="Request onboarding and account-management support for a supported broker. Every request is reviewed before any service is activated." />
    <section className="section-y"><div className="container-x grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="panel h-fit p-6 md:p-8"><h2 className="text-xl font-semibold">Before you submit</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-fg-soft)]"><li>• We start with contact and platform details only. If account identifiers are needed later, we agree a secure onboarding process first.</li><li>• <strong className="text-[var(--color-amber)]">Never submit a trading or investor password, OTP, API secret, identity document, seed phrase or remote-access code.</strong></li><li>• Submitting a request does not authorize trades or guarantee performance.</li><li>• This enquiry does not enable live trading, broker execution or account access.</li></ul></div>
      <AccountManagementForm />
    </div></section>
  </>;
}
