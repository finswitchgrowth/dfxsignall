import { AuthForm } from "@/components/auth/AuthForm";
import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata({ title: "Create your account", description: "Create a DFXSIGNALL customer account.", path: "/register", noindex: true });
export default function Page() { return <main className="min-h-[70vh] bg-slate-950 px-4 py-16"><AuthForm mode="register" /></main>; }