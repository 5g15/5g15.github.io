import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { MonographEntry } from '../types/portfolio';

interface EditorialReaderProps {
  entry: MonographEntry | null;
  onClose: () => void;
}

const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

export function EditorialReader({ entry, onClose }: EditorialReaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!entry) return;
    setProgress(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [entry, onClose]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 0) {
      setProgress(100);
      return;
    }
    setProgress(Math.min(100, Math.round((el.scrollTop / max) * 100)));
  };

  return (
    <AnimatePresence>
      {entry && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="editorial-reader-title"
          className="fixed inset-0 z-50 flex justify-end"
        >
          {/* Quiet matte backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B0C0E]/70"
          />

          {/* Warm-paper editorial reading sheet */}
          <motion.article
            initial={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
            animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.36, ease: EASE_EDITORIAL }}
            className="relative z-10 flex h-full w-full max-w-3xl flex-col bg-[#F6F5F1] text-[#141414] shadow-[-24px_0_80px_rgba(0,0,0,0.45)]"
          >
            {/* Top sticky masthead */}
            <header className="relative flex items-center justify-between border-b border-[#141414]/12 bg-[#F6F5F1]/95 px-6 py-4 sm:px-10">
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#585650]">
                <span>Folio {entry.indexNumber}</span>
                <span className="text-[#141414]/20">/</span>
                <span>{entry.categoryLabel}</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close reading view"
                className="editorial-link cursor-pointer font-mono text-[11px] uppercase tracking-[0.16em] text-[#141414]"
              >
                Close [Esc]
              </button>

              {/* Hairline reading progress indicator */}
              <div
                aria-hidden="true"
                className="absolute right-0 bottom-0 left-0 h-[1.5px] bg-[#141414]/6"
              >
                <div
                  className="h-full bg-[#141414] transition-[width] duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </header>

            {/* Scrollable monograph column */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-6 py-10 sm:px-12 sm:py-14"
            >
              <div className="mx-auto max-w-[64ch]">
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#585650]">
                  <span>{entry.date}</span>
                  <span>·</span>
                  <span>{entry.readTime}</span>
                  <span>·</span>
                  <span>{entry.locationOrVenue}</span>
                </div>

                {/* Display serif title */}
                <h2
                  id="editorial-reader-title"
                  className="mt-5 font-serif text-4xl leading-[1.06] tracking-[-0.02em] text-[#141414] sm:text-5xl"
                >
                  {entry.title}
                </h2>

                <p className="mt-4 font-editorial text-lg leading-relaxed text-[#464540] sm:text-xl">
                  {entry.subtitle}
                </p>

                {/* Metrics ledger */}
                <dl className="mt-8 grid grid-cols-1 gap-4 border-y border-[#141414]/14 py-5 sm:grid-cols-3">
                  {entry.metrics.map((metric) => (
                    <div key={metric.label}>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6B6962]">
                        {metric.label}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-[#141414]">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Core Thesis Box (editorial hairline, zero glass) */}
                <div className="mt-8 border-l-2 border-[#141414] pl-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B6962]">
                    Core Thesis
                  </p>
                  <p className="mt-2 font-editorial text-[17px] leading-[1.68] text-[#141414]">
                    {entry.keyThesis}
                  </p>
                </div>

                {/* Partner Institutions (when applicable, e.g. Green Horizons) */}
                {entry.partners && entry.partners.length > 0 && (
                  <div className="mt-8 border border-[#141414]/14 bg-[#ECEAE3]/65 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#585650]">
                      Partner Institutions
                    </p>
                    <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {entry.partners.map((partner) => (
                        <li
                          key={partner}
                          className="text-sm font-medium text-[#141414]"
                        >
                          — {partner}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Long-form monograph sections */}
                <div className="mt-10 space-y-9">
                  {entry.sections.map((section) => (
                    <section key={section.heading}>
                      <h3 className="font-serif text-2xl tracking-[-0.01em] text-[#141414]">
                        {section.heading}
                      </h3>
                      <div className="mt-3 space-y-4">
                        {section.paragraphs.map((paragraph) => (
                          <p
                            key={paragraph.slice(0, 32)}
                            className="font-editorial text-[17px] leading-[1.78] text-[#262522]"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {section.pullQuote && (
                        <blockquote className="my-7 border-y border-[#141414]/14 py-5 font-serif text-2xl italic leading-[1.3] text-[#141414] sm:text-[1.75rem]">
                          “{section.pullQuote}”
                        </blockquote>
                      )}
                    </section>
                  ))}
                </div>

                {/* Key Takeaways / Outcomes */}
                <div className="mt-10 border-t border-[#141414]/15 pt-8">
                  <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#585650]">
                    Key Takeaways &amp; Outcomes
                  </h4>
                  <ul className="mt-4 space-y-3">
                    {entry.keyPoints.map((point, idx) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 font-editorial text-base leading-relaxed text-[#262522]"
                      >
                        <span className="mt-1 font-mono text-[11px] text-[#6B6962]">
                          0{idx + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Optional external link & closing sign-off */}
                <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#141414]/12 pt-6">
                  <span className="font-serif text-2xl italic text-[#141414]">
                    Isaac Chong
                  </span>

                  <div className="flex items-center gap-6">
                    {entry.externalLink && (
                      <a
                        href={entry.externalLink.href}
                        target="_blank"
                        rel="noreferrer"
                        className="editorial-link font-mono text-[11px] uppercase tracking-[0.14em] text-[#141414]"
                      >
                        {entry.externalLink.label} ↗
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={onClose}
                      className="cursor-pointer rounded-full border border-[#141414] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#141414] transition-colors hover:bg-[#141414] hover:text-[#F6F5F1]"
                    >
                      Return to Archive
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      )}
    </AnimatePresence>
  );
}
