"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { site } from "@/content/site";

const topics = ["General enquiry", "Business & partnerships", "Platform launch updates", "Security report", "Compliance & legal"];

/**
 * No backend: the form composes an email in the visitor's mail app.
 * Nothing is transmitted or stored by this website.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = `[${f.get("topic")}] from ${f.get("name")}`;
    const body = `${f.get("message")}\n\n— ${f.get("name")}${f.get("email") ? ` (${f.get("email")})` : ""}`;
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  const field = "mt-2 w-full rounded-xl border border-[var(--line-strong)] bg-[var(--color-ink-950)]/60 px-4 py-3 text-sm text-[var(--color-fg)] outline-none transition-colors placeholder:text-[var(--color-dim)] focus:border-[var(--color-cyan)]/60";
  return (
    <form onSubmit={onSubmit} className="panel grid gap-5 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-xs text-[var(--color-muted)]">
          Name
          <input name="name" required autoComplete="name" className={field} placeholder="Your name" />
        </label>
        <label className="text-xs text-[var(--color-muted)]">
          Email
          <input name="email" type="email" autoComplete="email" className={field} placeholder="you@example.com" />
        </label>
      </div>
      <label className="text-xs text-[var(--color-muted)]">
        Topic
        <select name="topic" className={field} defaultValue={topics[0]}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="text-xs text-[var(--color-muted)]">
        Message
        <textarea name="message" required rows={5} className={field} placeholder="How can we help?" />
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-[0.7rem] leading-relaxed text-[var(--color-dim)]">
          Opens your email app with the message ready to send. Nothing is stored by this website. Please don&apos;t include passwords or card
          details.
        </p>
        <button type="submit" className="btn btn-primary shrink-0">
          <Send size={15} /> Compose email
        </button>
      </div>
      {sent && (
        <p role="status" className="text-xs text-[var(--color-green)]">
          Your email app should open now. If it doesn&apos;t, write to {site.contact.email}.
        </p>
      )}
    </form>
  );
}
