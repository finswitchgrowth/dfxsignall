import { AuthForm } from "@/components/auth/AuthForm";
import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata({ title: "Password recovery", description: "Recover access to your DFXSIGNALL account.", path: "/forgot-password", noindex: true });
export default function Page() { return <main className="min-h-[70vh] bg-slate-950 px-4 py-16"><AuthForm mode="reset" /></main>; }