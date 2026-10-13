"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }> };

export function PWAInstall() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const onPrompt = (event: Event) => { event.preventDefault(); setPromptEvent(event as InstallPromptEvent); };
    const onInstalled = () => { setInstalled(true); setPromptEvent(null); setHelpOpen(false); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if ("serviceWorker" in navigator && window.isSecureContext) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // Installation remains available through the browser even if SW registration is blocked.
      });
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (promptEvent) {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setPromptEvent(null);
      return;
    }
    setHelpOpen(true);
  }

  if (installed) return null;

  return (
    <>
      <button type="button" onClick={install} aria-label="Install DFXSIGNALL app" className="fixed bottom-5 right-4 z-[60] inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-[#071322]/95 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgb(31_216_255/0.55)] backdrop-blur-xl transition hover:border-cyan-200/70 sm:bottom-6 sm:right-6">
        <Download size={17} className="text-cyan-200" />
        Install app
      </button>
      {helpOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center" role="presentation" onClick={() => setHelpOpen(false)}>
          <section role="dialog" aria-modal="true" aria-labelledby="pwa-install-title" className="w-full max-w-md rounded-3xl border border-white/15 bg-[#080e1c] p-6 text-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs uppercase tracking-[.22em] text-cyan-200">DFXSIGNALL app</p><h2 id="pwa-install-title" className="mt-2 text-xl font-semibold">Add to your device</h2></div>
              <button type="button" onClick={() => setHelpOpen(false)} aria-label="Close install instructions" className="rounded-full border border-white/15 p-2"><X size={18}/></button>
            </div>
            {ios ? (
              <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-300">
                <li>Open this website in <strong className="text-white">Safari</strong> (not an in-app browser).</li>
                <li>Tap the <Share size={15} className="inline"/> Share button.</li>
                <li>Choose <strong className="text-white">Add to Home Screen</strong>, then tap Add.</li>
              </ol>
            ) : (
              <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-300">
                <li>Open DFXSIGNALL in Chrome, Edge, or another supported browser.</li>
                <li>Open the browser menu and choose <strong className="text-white">Install app</strong> or <strong className="text-white">Add to Home screen</strong>.</li>
                <li>Confirm the prompt. On Windows, the installed app can be pinned to Start or the taskbar.</li>
              </ol>
            )}
            <p className="mt-5 text-xs leading-5 text-slate-500">The install option depends on your browser and device. This adds the website as an app; it does not publish a separate App Store or Play Store app.</p>
            <button type="button" onClick={() => setHelpOpen(false)} className="btn btn-primary mt-5 w-full">Got it</button>
          </section>
        </div>
      )}
    </>
  );
}
