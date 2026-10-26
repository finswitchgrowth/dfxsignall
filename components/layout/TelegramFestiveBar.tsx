"use client";

import { MessageCircle, Send, Sparkles } from "lucide-react";

/**
 * Lightweight festive treatment for the Diwali season and always-visible Telegram entry points.
 * Links are public Telegram handles supplied by the site owner.
 */
export function TelegramFestiveBar() {
  return (
    <>
      <div aria-hidden="true" className="diwali-ambience pointer-events-none fixed inset-x-0 top-0 z-[35] h-24 overflow-hidden">
        <div className="diwali-glow absolute -left-10 -top-12 h-28 w-28 rounded-full" />
        <div className="diwali-glow diwali-glow-right absolute -right-10 -top-12 h-28 w-28 rounded-full" />
        <div className="absolute left-[12%] top-3 flex gap-2 opacity-80">
          <span className="diwali-light" /><span className="diwali-light diwali-light-delay" /><span className="diwali-light diwali-light-delay-2" />
        </div>
        <div className="absolute right-[12%] top-3 flex gap-2 opacity-80">
          <span className="diwali-light diwali-light-delay-2" /><span className="diwali-light diwali-light-delay" /><span className="diwali-light" />
        </div>
      </div>
      <aside aria-label="DFXSIGNALL Telegram links" className="telegram-float fixed bottom-4 right-3 z-[60] flex max-w-[calc(100vw-1.5rem)] flex-col gap-2 sm:bottom-5 sm:right-5">
        <a
          href="https://t.me/dfxsignallofficial"
          target="_blank"
          rel="noopener noreferrer"
          className="telegram-join inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          aria-label="Join the official DFXSIGNALL Telegram channel"
        >
          <Send size={16} aria-hidden="true" />
          Join Telegram Channel
          <Sparkles size={14} aria-hidden="true" />
        </a>
        <a
          href="https://t.me/dfxsignall"
          target="_blank"
          rel="noopener noreferrer"
          className="telegram-contact inline-flex min-h-10 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          aria-label="Contact DFXSIGNALL on Telegram"
        >
          <MessageCircle size={16} aria-hidden="true" />
          Contact @dfxsignall
        </a>
      </aside>
    </>
  );
}
