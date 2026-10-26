import { AuthForm } from "@/components/auth/AuthForm";
import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata({ title: "Client login", description: "Sign in to the DFXSIGNALL client portal.", path: "/login", noindex: true });
export default function Page() { return <main className="min-h-[70vh] bg-slate-950 px-4 py-16"><AuthForm mode="login" /></main>; }