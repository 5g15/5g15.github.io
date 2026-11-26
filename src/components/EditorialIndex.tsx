import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ESSAY_CATEGORIES,
  MONOGRAPH_ENTRIES,
  RAFFLES_SUBJECTS,
  STUDIO_PROFILE,
} from '../data/portfolioData';
import type { EssayCategory, MonographEntry } from '../types/portfolio';

interface EditorialIndexProps {
  onOpenEntry: (entry: MonographEntry) => void;
}

const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

export function EditorialIndex({ onOpenEntry }: EditorialIndexProps) {
  const prefersReducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<EssayCategory>('All');

  const essays = useMemo(
    () => MONOGRAPH_ENTRIES.filter((entry) => entry.kind === 'Essay'),
    [],
  );

  const filteredEssays = useMemo(() => {
    if (selectedCategory === 'All') return essays;
    return essays.filter((essay) => essay.essayCategory === selectedCategory);
  }, [essays, selectedCategory]);

  const featuredWorks = useMemo(
    () =>
      MONOGRAPH_ENTRIES.filter(
        (entry) => entry.kind === 'Project' || entry.kind === 'Research',
      ),
    [],
  );

  const academicEntry = useMemo(
    () => MONOGRAPH_ENTRIES.find((entry) => entry.kind === 'Academic'),
    [],
  );

  return (
    <div className="relative bg-[#F6F5F1] text-[#141414]">
      {/* Subtle sticky monograph masthead across the light paper sections */}
      <nav
        aria-label="Editorial section navigation"
        className="sticky top-0 z-30 border-b border-[#141414]/10 bg-[#F6F5F1]/92 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-4 sm:px-10 lg:px-14">
          <a
            href="#top"
            className="font-serif text-xl tracking-tight text-[#141414]"
          >
            {STUDIO_PROFILE.name}
          </a>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[13px] text-[#3F3E39] sm:gap-x-8">
            <a href="#essays" className="editorial-link hover:text-[#141414]">
              Essays
            </a>
            <a href="#projects" className="editorial-link hover:text-[#141414]">
              Projects
            </a>
            <a href="#academics" className="editorial-link hidden hover:text-[#141414] sm:inline-block">
              Academics
            </a>
            <a href="#contact" className="editorial-link hover:text-[#141414]">
              Contact
            </a>
            <a
              href={STUDIO_PROFILE.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="editorial-link font-mono text-xs text-[#585650] hover:text-[#141414]"
            >
              {STUDIO_PROFILE.handle}
            </a>
          </div>
        </div>
      </nav>

      {/* SECTION I: H3 Economics & Market Research Essays */}
      <section
        id="essays"
        className="mx-auto max-w-[1320px] px-6 py-24 sm:px-10 sm:py-28 lg:px-14"
      >
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.48, ease: EASE_EDITORIAL }}
          className="grid grid-cols-1 gap-8 border-b border-[#141414]/15 pb-10 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#585650]">
              I. H3 Economics &amp; Market Research
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.04] tracking-[-0.02em] text-[#141414] sm:text-5xl lg:text-[3.5rem]">
              Essays on Markets, Incentives &amp;{' '}
              <span className="italic">Structural Change</span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:justify-self-end">
            <p className="font-editorial text-base leading-relaxed text-[#4E4C46]">
              Notes on game theory, industrial organization, small-open-economy macro, and
              AI’s impact on capital markets and labor — curated alongside{' '}
              <a
                href={STUDIO_PROFILE.xUrl}
                target="_blank"
                rel="noreferrer"
                className="editorial-link font-medium text-[#141414]"
              >
                {STUDIO_PROFILE.xHandle}
              </a>
              .
            </p>
          </div>
        </motion.div>

        {/* Minimal typographic topic filters */}
        <div
          role="tablist"
          aria-label="Filter essays by topic"
          className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[#141414]/10 pb-5"
        >
          {ESSAY_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`cursor-pointer pb-1 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                  active
                    ? 'border-b border-[#141414] text-[#141414]'
                    : 'text-[#6B6962] hover:text-[#141414]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Clean editorial ledger rows */}
        <div className="divide-y divide-[#141414]/12">
          {filteredEssays.map((essay) => (
            <button
              key={essay.id}
              type="button"
              onClick={() => onOpenEntry(essay)}
              className="group grid w-full cursor-pointer grid-cols-1 gap-4 py-8 text-left transition-colors hover:bg-[#ECEAE3]/45 sm:px-3 md:grid-cols-12 md:items-baseline"
            >
              <div className="flex items-center gap-4 font-mono text-xs text-[#6B6962] md:col-span-2">
                <span>{essay.indexNumber}</span>
                <span>{essay.date}</span>
              </div>

              <div className="md:col-span-7">
                <h3 className="font-serif text-2xl leading-snug text-[#141414] transition-transform duration-300 group-hover:translate-x-1 sm:text-[1.85rem]">
                  {essay.title}
                </h3>
                <p className="mt-2 font-editorial text-[15px] leading-relaxed text-[#4E4C46]">
                  {essay.keyThesis}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#585650] md:col-span-3 md:flex-col md:items-end md:justify-start">
                <span>{essay.readTime}</span>
                <span className="text-[#141414] transition-transform duration-200 group-hover:translate-x-1">
                  Read Essay →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION II: Projects & Scientific Research */}
      <section
        id="projects"
        className="border-t border-[#141414]/14 bg-[#EFECE5]/55"
      >
        <div className="mx-auto max-w-[1320px] px-6 py-24 sm:px-10 sm:py-28 lg:px-14">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.48, ease: EASE_EDITORIAL }}
            className="max-w-2xl"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#585650]">
              II. Projects &amp; Empirical Inquiry
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.04] tracking-[-0.02em] text-[#141414] sm:text-5xl lg:text-[3.5rem]">
              Grassroots Sustainability &amp;{' '}
              <span className="italic">Laboratory Science</span>
            </h2>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
            {featuredWorks.map((item) => (
              <article
                key={item.id}
                className="flex flex-col justify-between border-t border-[#141414] pt-7"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#585650]">
                    <span>
                      {item.indexNumber} / {item.categoryLabel}
                    </span>
                    <span>{item.date}</span>
                  </div>

                  <h3 className="mt-5 font-serif text-3xl leading-[1.08] tracking-[-0.015em] text-[#141414] sm:text-[2.25rem]">
                    {item.title}
                  </h3>

                  <p className="mt-4 font-editorial text-base leading-[1.72] text-[#353430]">
                    {item.summary}
                  </p>

                  {/* Partners list for Green Horizons */}
                  {item.partners && item.partners.length > 0 && (
                    <div className="mt-6 border-y border-[#141414]/12 py-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#585650]">
                        Executed in Partnership With
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#141414]">
                        {item.partners.join(' · ')}
                      </p>
                    </div>
                  )}

                  {/* Structured highlights for SYSF Research / Green Horizons */}
                  <ul className="mt-6 space-y-2.5">
                    {item.keyPoints.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-[#464540]"
                      >
                        <span className="mt-2 h-[1px] w-3 shrink-0 bg-[#141414]/55" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-[#141414]/12 pt-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#585650]">
                    {item.badge ?? item.locationOrVenue}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenEntry(item)}
                    className="editorial-link cursor-pointer font-mono text-[11px] uppercase tracking-[0.16em] text-[#141414]"
                  >
                    Read Full Write-up →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION III: Academic Foundation — Raffles Institution */}
      <section
        id="academics"
        className="mx-auto max-w-[1320px] border-t border-[#141414]/14 px-6 py-24 sm:px-10 sm:py-28 lg:px-14"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#585650]">
              III. Academic Foundation
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-[-0.02em] text-[#141414] sm:text-5xl">
              Raffles Institution
            </h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-[#585650]">
              Year 6 · Singapore-Cambridge GCE A-Levels
            </p>

            <p className="mt-5 font-editorial text-base leading-[1.75] text-[#464540]">
              An interdisciplinary curriculum bridging quantitative physical sciences and
              mathematics with extended H3 Economics theory — complemented by the{' '}
              <strong className="font-medium text-[#141414]">
                Singapore Youth Science Fair (SYSF) Distinction Award
              </strong>
              .
            </p>

            {academicEntry && (
              <button
                type="button"
                onClick={() => onOpenEntry(academicEntry)}
                className="editorial-link mt-6 cursor-pointer font-mono text-[11px] uppercase tracking-[0.16em] text-[#141414]"
              >
                Open Academic Folio →
              </button>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="divide-y divide-[#141414]/12 border-y border-[#141414]/15">
              {RAFFLES_SUBJECTS.map((item) => (
                <div
                  key={`${item.code}-${item.subject}`}
                  className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-12 sm:items-baseline"
                >
                  <span className="font-mono text-xs font-medium tracking-[0.14em] text-[#141414] sm:col-span-2">
                    {item.code}
                  </span>
                  <span className="font-serif text-2xl text-[#141414] sm:col-span-4">
                    {item.subject}
                  </span>
                  <span className="font-editorial text-sm leading-relaxed text-[#585650] sm:col-span-6">
                    {item.focus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION IV: Contact & Editorial Colophon */}
      <footer
        id="contact"
        className="border-t border-[#141414]/15 bg-[#F6F5F1]"
      >
        <div className="mx-auto max-w-[1320px] px-6 py-20 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#585650]">
                IV. Correspondence &amp; Links
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-[1.06] text-[#141414] sm:text-5xl">
                Always glad to discuss markets, research &amp;{' '}
                <span className="italic">meaningful projects.</span>
              </h2>
            </div>

            <div className="flex flex-col gap-3 md:col-span-5 md:items-end">
              <div className="flex flex-wrap gap-x-7 gap-y-2 text-sm text-[#141414]">
                <a
                  href={STUDIO_PROFILE.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link font-mono text-xs uppercase tracking-[0.14em]"
                >
                  Instagram {STUDIO_PROFILE.handle} ↗
                </a>
                <a
                  href={STUDIO_PROFILE.xUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link font-mono text-xs uppercase tracking-[0.14em]"
                >
                  X {STUDIO_PROFILE.xHandle} ↗
                </a>
                <a
                  href={STUDIO_PROFILE.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link font-mono text-xs uppercase tracking-[0.14em]"
                >
                  GitHub {STUDIO_PROFILE.githubHandle} ↗
                </a>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[#141414]/12 pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[#6B6962] sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="font-serif text-xl normal-case italic tracking-normal text-[#141414]">
                {STUDIO_PROFILE.name}
              </span>
              <span>© {new Date().getFullYear()} · Singapore</span>
            </div>

            <a href="#top" className="editorial-link text-[#141414]">
              Back to Portrait ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
