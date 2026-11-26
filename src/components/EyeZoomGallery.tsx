import { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { MONOGRAPH_ENTRIES, STUDIO_PROFILE } from '../data/portfolioData';
import type { MonographEntry } from '../types/portfolio';
import { HeroPortrait, PORTRAIT_EYE_ORIGIN } from './HeroPortrait';

interface EyeZoomGalleryProps {
  onOpenEntry: (entry: MonographEntry) => void;
}

const GALLERY_ITEMS = MONOGRAPH_ENTRIES.filter((entry) => entry.inGallery);
const CARD_COUNT = GALLERY_ITEMS.length;
const ANGLE_STEP = 360 / CARD_COUNT;

function getCardPalette(tone: MonographEntry['cardTone']) {
  switch (tone) {
    case 'paper':
      return {
        surface: 'bg-[#F6F5F1] text-[#141414] border-[#141414]/15',
        muted: 'text-[#5A5852]',
        rule: 'border-[#141414]/14',
        badge: 'border-[#141414]/20 text-[#141414]',
      };
    case 'stone':
      return {
        surface: 'bg-[#E9E6DE] text-[#141414] border-[#141414]/15',
        muted: 'text-[#52504A]',
        rule: 'border-[#141414]/14',
        badge: 'border-[#141414]/20 text-[#141414]',
      };
    case 'slate':
      return {
        surface: 'bg-[#17181B] text-[#F4F2EC] border-[#F4F2EC]/16',
        muted: 'text-[#A29F97]',
        rule: 'border-[#F4F2EC]/14',
        badge: 'border-[#F4F2EC]/22 text-[#F4F2EC]',
      };
    case 'ink':
      return {
        surface: 'bg-[#121316] text-[#F4F2EC] border-[#F4F2EC]/16',
        muted: 'text-[#9A978F]',
        rule: 'border-[#F4F2EC]/14',
        badge: 'border-[#F4F2EC]/22 text-[#F4F2EC]',
      };
  }
}

export function EyeZoomGallery({ onOpenEntry }: EyeZoomGalleryProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth spring-damped scroll progress so wheel notches feel silky smooth across the entire 640vh runway
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    mass: 0.45,
  });

  // Drag / button manual rotation offset layered smoothly on top of prolonged scroll orbit
  const dragOffsetMv = useMotionValue(0);
  const smoothDragOffset = useSpring(dragOffsetMv, {
    stiffness: 110,
    damping: 26,
    mass: 0.5,
  });

  const [galleryInteractive, setGalleryInteractive] = useState(false);
  const [renderedAngle, setRenderedAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1280);

  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const movedDistanceRef = useRef(0);

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth, { passive: true });
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  /**
   * Prolonged 640vh choreography:
   * - Phase 1 (0% – 18%): Hero UI fades cleanly out; video scrubs smoothly into eye close-up & zooms in
   * - Phase 2 (18% – 30%): Seamless dark matte pupil portal transition through the eye
   * - Phase 3 (30% – 96%): ~420vh of dedicated silky-smooth 3D cylindrical gallery orbit (0deg -> -300deg)
   * - Exit (96% – 100%): Gentle release into the warm-paper #F6F5F1 editorial monograph sections
   */
  const uiOpacity = useTransform(smoothScroll, [0, 0.13], [1, 0]);
  const uiY = useTransform(smoothScroll, [0, 0.15], [0, -26]);

  // Curved horizontal card ribbon peeking behind the character at 0%
  const backdropStripOpacity = useTransform(smoothScroll, [0, 0.15, 0.24], [0.85, 0.22, 0]);
  const backdropStripScale = useTransform(smoothScroll, [0, 0.2], [1, 1.32]);

  // Character video camera push straight into the eyes
  const portraitScale = useTransform(smoothScroll, [0, 0.19, 0.3], [1, 4.2, 10.5]);
  const portraitOpacity = useTransform(smoothScroll, [0, 0.22, 0.3], [1, 1, 0]);

  // Phase 2 dark pupil portal transition veil
  const portalOpacity = useTransform(smoothScroll, [0.15, 0.24, 0.32, 0.37], [0, 0.94, 0.55, 0]);
  const portalScale = useTransform(smoothScroll, [0.15, 0.35], [0.35, 2.2]);

  // Phase 3 full 3D rotating cylindrical gallery
  const galleryOpacity = useTransform(smoothScroll, [0.26, 0.35], [0, 1]);
  const galleryScale = useTransform(smoothScroll, [0.26, 0.36], [0.8, 1]);

  // Prolonged scroll-driven rotation: orbits cleanly through all 6 cards (0deg -> -300deg) across 30% -> 96%
  const scrollOrbitAngle = useTransform(smoothScroll, [0.3, 0.96], [0, -(CARD_COUNT - 1) * ANGLE_STEP]);

  // Combine spring-smoothed scroll orbit + spring-smoothed drag/step offset
  const updateCombinedAngle = useCallback(() => {
    setRenderedAngle(scrollOrbitAngle.get() + smoothDragOffset.get());
  }, [scrollOrbitAngle, smoothDragOffset]);

  useMotionValueEvent(scrollOrbitAngle, 'change', updateCombinedAngle);
  useMotionValueEvent(smoothDragOffset, 'change', updateCombinedAngle);

  useMotionValueEvent(smoothScroll, 'change', (latest) => {
    setGalleryInteractive(latest >= 0.3);
  });

  const activeIndex =
    ((Math.round(-renderedAngle / ANGLE_STEP) % CARD_COUNT) + CARD_COUNT) % CARD_COUNT;

  const isCompact = viewportWidth < 768;
  const radius = isCompact ? 310 : viewportWidth < 1100 ? 450 : 540;

  const handleStep = useCallback(
    (direction: 1 | -1) => {
      dragOffsetMv.set(dragOffsetMv.get() - direction * ANGLE_STEP);
    },
    [dragOffsetMv],
  );

  const handleJumpToIndex = useCallback(
    (targetIdx: number) => {
      const targetAngle = -targetIdx * ANGLE_STEP;
      const desiredOffset = targetAngle - scrollOrbitAngle.get();
      dragOffsetMv.set(desiredOffset);
    },
    [dragOffsetMv, scrollOrbitAngle],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!galleryInteractive && !prefersReducedMotion) return;
    setIsDragging(true);
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = dragOffsetMv.get();
    movedDistanceRef.current = 0;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = event.clientX - dragStartXRef.current;
    movedDistanceRef.current = Math.max(movedDistanceRef.current, Math.abs(dx));
    const sensitivity = isCompact ? 0.34 : 0.22;
    dragOffsetMv.set(dragStartOffsetRef.current + dx * sensitivity);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleCardClick = (entry: MonographEntry) => {
    if (movedDistanceRef.current > 8) return;
    onOpenEntry(entry);
  };

  const handleJumpToGallery = () => {
    const el = containerRef.current;
    if (!el) return;
    const scrollableDistance = Math.max(0, el.offsetHeight - window.innerHeight);
    // Land squarely at the opening of Phase 3 (36% of prolonged 640vh runway)
    const targetTop = el.offsetTop + Math.round(scrollableDistance * 0.36);
    window.scrollTo({ top: targetTop, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  // Accessible static layout when user prefers reduced motion
  if (prefersReducedMotion) {
    return (
      <section className="bg-[#0B0C0E] text-[#F4F2EC]">
        <div className="mx-auto flex min-h-[92vh] max-w-[1440px] flex-col justify-between px-6 py-8 sm:px-10 lg:px-14">
          <nav
            aria-label="Primary navigation"
            className="flex flex-wrap items-center justify-end gap-x-7 gap-y-2 text-[13px] tracking-wide text-[#F4F2EC]/85"
          >
            <a href="#essays" className="editorial-link hover:text-[#F4F2EC]">
              Essays
            </a>
            <a href="#projects" className="editorial-link hover:text-[#F4F2EC]">
              Projects
            </a>
            <a href="#contact" className="editorial-link hover:text-[#F4F2EC]">
              Contact
            </a>
            <a
              href={STUDIO_PROFILE.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="editorial-link font-mono text-xs text-[#F4F2EC]/75 hover:text-[#F4F2EC]"
            >
              {STUDIO_PROFILE.handle}
            </a>
          </nav>

          <div className="my-8 flex justify-center">
            <HeroPortrait scrollProgress={scrollYProgress} />
          </div>

          <div className="grid grid-cols-1 items-end gap-8 pb-4 md:grid-cols-2">
            <div>
              <h1 className="font-serif text-5xl leading-[0.98] tracking-[-0.02em] text-[#F4F2EC] sm:text-6xl">
                Hi, I&apos;m
                <br />
                <span className="italic text-[#E8E4DA]">{STUDIO_PROFILE.name}</span>
              </h1>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#B6B3AA]">
                {STUDIO_PROFILE.heroTitleLine1} {STUDIO_PROFILE.heroTitleLine2}
              </p>
              <a
                href="#essays"
                className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#F4F2EC]/25 bg-[#F4F2EC] px-5 py-2.5 text-xs font-medium tracking-wide text-[#0B0C0E]"
              >
                <span>{STUDIO_PROFILE.ctaLabel}</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B0C0E] text-[#F4F2EC]">
                  →
                </span>
              </a>
            </div>
            <div className="max-w-sm md:justify-self-end md:text-right">
              <p className="font-editorial text-base leading-relaxed text-[#D8D5CD]">
                Studying <strong className="font-semibold text-[#F4F2EC]">how incentives shape markets</strong>, executing{' '}
                <strong className="font-semibold text-[#F4F2EC]">grassroots sustainability</strong>, and testing ideas through{' '}
                <strong className="font-semibold text-[#F4F2EC]">empirical science</strong> in Singapore.
              </p>
              <p className="mt-4 font-serif text-2xl italic text-[#F4F2EC]/90">
                {STUDIO_PROFILE.name}
              </p>
            </div>
          </div>
        </div>

        {/* Reduced-motion accessible gallery shelf */}
        <div className="mx-auto max-w-[1440px] border-t border-[#F4F2EC]/10 px-6 py-16 sm:px-10 lg:px-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9D9A92]">
            Selected Archive — Click any folio to read
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY_ITEMS.map((entry) => {
              const palette = getCardPalette(entry.cardTone);
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onOpenEntry(entry)}
                  className={`flex flex-col justify-between rounded-sm border p-6 text-left transition-opacity hover:opacity-95 ${palette.surface}`}
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
                      <span>{entry.indexNumber}</span>
                      <span>{entry.kind}</span>
                    </div>
                    <h3 className="mt-4 font-serif text-2xl leading-tight">
                      {entry.shortTitle}
                    </h3>
                    <p className={`mt-2 text-xs leading-relaxed ${palette.muted}`}>
                      {entry.summary}
                    </p>
                  </div>
                  <span className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] underline underline-offset-4">
                    Read folio →
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="top"
      ref={containerRef}
      aria-label="Animated character hero and 3D research archive"
      className="relative h-[640vh] bg-[#0B0C0E] text-[#F4F2EC]"
    >
      {/* Pinned 100vh Stage */}
      <div className="matte-grain sticky top-0 h-screen w-full overflow-hidden bg-[#0B0C0E]">
        {/* Top-Right Minimalist Editorial Navigation */}
        <motion.header
          style={{ opacity: uiOpacity, y: uiY }}
          className={`absolute top-0 right-0 left-0 z-40 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-7 sm:px-10 lg:px-14 ${
            galleryInteractive ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-[#9D9A92] sm:inline">
            Singapore · Archive
          </span>
          <nav
            aria-label="Primary navigation"
            className="ml-auto flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-[13px] font-normal tracking-wide text-[#E6E4DD] sm:gap-x-8"
          >
            <a href="#essays" className="editorial-link hover:text-[#F4F2EC]">
              Essays
            </a>
            <a href="#projects" className="editorial-link hover:text-[#F4F2EC]">
              Projects
            </a>
            <a href="#contact" className="editorial-link hover:text-[#F4F2EC]">
              Contact
            </a>
            <a
              href={STUDIO_PROFILE.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="editorial-link font-mono text-xs text-[#B6B3AA] hover:text-[#F4F2EC]"
            >
              {STUDIO_PROFILE.handle}
            </a>
          </nav>
        </motion.header>

        {/* Curved Horizontal Card Strip Behind Character at Eye Level (Visible at 0% scroll) */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: backdropStripOpacity, scale: backdropStripScale }}
          className="perspective-stage pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        >
          <div
            className="preserve-3d relative flex items-center justify-center"
            style={{
              transform: 'translateY(-8vh) rotateX(-2deg)',
            }}
          >
            {GALLERY_ITEMS.map((entry, idx) => {
              const offset = idx - (CARD_COUNT - 1) / 2;
              const angle = offset * 25;
              const palette = getCardPalette(entry.cardTone);
              return (
                <div
                  key={`backdrop-${entry.id}`}
                  className={`absolute h-[160px] w-[210px] rounded-[2px] border p-4 shadow-2xl sm:h-[195px] sm:w-[250px] ${palette.surface}`}
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${isCompact ? 420 : 660}px) scale(0.84)`,
                    opacity: Math.abs(offset) < 0.7 ? 0.16 : 0.78,
                  }}
                >
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] opacity-65">
                    <span>{entry.indexNumber}</span>
                    <span>{entry.kind}</span>
                  </div>
                  <p className="mt-3 font-serif text-xl leading-tight">
                    {entry.shortTitle}
                  </p>
                  <p className={`mt-2 line-clamp-3 text-[11px] leading-relaxed ${palette.muted}`}>
                    {entry.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Centerpiece Animated Character Video Layer — Scales straight into his eyes */}
        <motion.div
          style={{
            scale: portraitScale,
            opacity: portraitOpacity,
            transformOrigin: `${PORTRAIT_EYE_ORIGIN.xPercent}% ${PORTRAIT_EYE_ORIGIN.yPercent}%`,
          }}
          className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center pt-16 will-change-transform md:items-end md:pt-0"
        >
          <div className="relative flex items-end justify-center pb-0 md:pb-2">
            <HeroPortrait scrollProgress={smoothScroll} />
          </div>
        </motion.div>

        {/* Subtle bottom matte vignette on mobile so lower typography stays crisp below face */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: uiOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-[46vh] bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/82 to-transparent md:hidden"
        />

        {/* Bottom-Left Hero Block & Bottom-Right Editorial Quote */}
        <motion.div
          style={{ opacity: uiOpacity, y: uiY }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-40 mx-auto max-w-[1440px] px-6 pb-8 sm:px-10 sm:pb-12 lg:px-14 lg:pb-14"
        >
          <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-12 md:gap-7">
            {/* Bottom-Left Editorial Title & Pill CTA */}
            <div
              className={`md:col-span-6 lg:col-span-5 ${
                galleryInteractive ? 'pointer-events-none' : 'pointer-events-auto'
              }`}
            >
              <h1 className="font-serif text-[2.65rem] leading-[0.98] tracking-[-0.02em] text-[#F4F2EC] sm:text-6xl lg:text-[4.15rem]">
                Hi, I&apos;m
                <br />
                <span className="italic text-[#E8E4DA]">{STUDIO_PROFILE.name}</span>
              </h1>
              <p className="mt-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[#B6B3AA]">
                {STUDIO_PROFILE.heroTitleLine1} {STUDIO_PROFILE.heroTitleLine2}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleJumpToGallery}
                  className="group inline-flex cursor-pointer items-center gap-3 rounded-full border border-[#F4F2EC]/20 bg-[#F4F2EC] py-2 pr-2.5 pl-5 text-xs font-medium tracking-wide text-[#0B0C0E] transition-colors duration-300 hover:bg-[#E7E4DC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F2EC]"
                >
                  <span>{STUDIO_PROFILE.ctaLabel}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B0C0E] text-[#F4F2EC] transition-transform duration-300 group-hover:translate-x-0.5">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                      className="h-3 w-3"
                    >
                      <path d="M3.5 8h9M8.5 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A8780] sm:inline">
                  Scroll to enter archive ↓
                </span>
              </div>
            </div>

            <div className="hidden md:col-span-1 md:block lg:col-span-3" />

            {/* Bottom-Right Editorial Quote & Signature Sign-off */}
            <div
              className={`max-w-sm md:col-span-5 md:justify-self-end md:text-right lg:col-span-4 ${
                galleryInteractive ? 'pointer-events-none' : 'pointer-events-auto'
              }`}
            >
              <p className="font-editorial text-[15px] leading-[1.6] text-[#C8C5BD] sm:text-base">
                Studying{' '}
                <strong className="font-medium text-[#F4F2EC]">
                  how incentives shape markets
                </strong>
                , executing{' '}
                <strong className="font-medium text-[#F4F2EC]">
                  grassroots sustainability
                </strong>
                , and testing ideas through{' '}
                <strong className="font-medium text-[#F4F2EC]">empirical science</strong> —
                from Raffles Institution to independent research in Singapore.
              </p>

              <div className="mt-4 flex flex-col md:items-end">
                <span className="font-serif text-[26px] leading-none italic tracking-tight text-[#F4F2EC]">
                  {STUDIO_PROFILE.name}
                </span>
                <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A8780]">
                  Raffles Institution · {STUDIO_PROFILE.xHandle}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Phase 2: Seamless Dark Pupil / Iris Portal Transition Veil */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: portalOpacity, scale: portalScale }}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center will-change-transform"
        >
          <div
            className="h-[115vmin] w-[115vmin] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(11,12,14,0.18) 0%, rgba(11,12,14,0.9) 44%, rgba(11,12,14,1) 70%)',
            }}
          />
        </motion.div>

        {/* Phase 3: Prolonged, Spring-Smoothed Interactive 3D Rotating Cylindrical Gallery */}
        <motion.div
          style={{ opacity: galleryOpacity, scale: galleryScale }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className={`absolute inset-0 z-[35] flex flex-col justify-between px-6 py-7 sm:px-10 lg:px-14 ${
            galleryInteractive ? 'pointer-events-auto' : 'pointer-events-none'
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
        >
          {/* Gallery Top Metadata Header */}
          <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between border-b border-[#F4F2EC]/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9D9A92]">
                Spatial Archive
              </span>
              <span className="text-[#F4F2EC]/20">/</span>
              <span className="font-mono text-[11px] text-[#F4F2EC]">
                {String(activeIndex + 1).padStart(2, '0')} — {String(CARD_COUNT).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-[#9D9A92] md:inline">
                Scroll or drag to orbit · Click any card to read
              </span>
              <a
                href="#essays"
                className="editorial-link font-mono text-[11px] uppercase tracking-[0.16em] text-[#E6E4DD]"
              >
                Full Index ↓
              </a>
            </div>
          </div>

          {/* 3D Cylindrical Carousel Stage (Driven directly by spring-damped renderedAngle at 60fps) */}
          <div className="perspective-stage relative flex flex-1 items-center justify-center">
            <div
              className="preserve-3d relative flex h-[340px] w-[260px] items-center justify-center will-change-transform sm:h-[380px] sm:w-[320px]"
              style={{
                transform: `translateZ(-${Math.round(radius * 0.42)}px) rotateX(-2deg) rotateY(${renderedAngle.toFixed(3)}deg)`,
              }}
            >
              {GALLERY_ITEMS.map((entry, idx) => {
                const cardAngle = idx * ANGLE_STEP;
                const relativeDeg = (((cardAngle + renderedAngle) % 360) + 540) % 360 - 180;
                const absDeg = Math.abs(relativeDeg);
                const isFront = absDeg < 34;
                const cardOpacity = Math.max(0.2, 1 - absDeg / 145);
                const palette = getCardPalette(entry.cardTone);

                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => handleCardClick(entry)}
                    aria-label={`Read ${entry.title}`}
                    className={`backface-visible group absolute inset-0 flex flex-col justify-between rounded-[2px] border p-5 text-left transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F2EC] sm:p-6 ${palette.surface} ${
                      isFront ? 'shadow-[0_28px_70px_rgba(0,0,0,0.65)]' : 'shadow-none'
                    }`}
                    style={{
                      transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                      opacity: cardOpacity,
                    }}
                  >
                    <div>
                      <div className={`flex items-center justify-between border-b pb-3 font-mono text-[10px] uppercase tracking-[0.16em] ${palette.rule}`}>
                        <span>No. {entry.indexNumber}</span>
                        <span>{entry.kind}</span>
                      </div>

                      {entry.badge && (
                        <span
                          className={`mt-4 inline-block rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] ${palette.badge}`}
                        >
                          {entry.badge}
                        </span>
                      )}

                      <h2 className="mt-3 font-serif text-[1.75rem] leading-[1.06] tracking-[-0.015em] sm:text-[2rem]">
                        {entry.shortTitle}
                      </h2>

                      <p className={`mt-3 line-clamp-4 font-editorial text-[13px] leading-relaxed sm:text-sm ${palette.muted}`}>
                        {entry.summary}
                      </p>
                    </div>

                    <div className={`flex items-center justify-between border-t pt-3.5 font-mono text-[10px] uppercase tracking-[0.14em] ${palette.rule}`}>
                      <span className={`truncate pr-2 ${palette.muted}`}>
                        {entry.locationOrVenue}
                      </span>
                      <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-1">
                        Read →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Controls, Folio Dots & Active Card Caption */}
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-4 border-t border-[#F4F2EC]/10 pt-4 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9D9A92]">
                  {GALLERY_ITEMS[activeIndex].categoryLabel}
                </p>
                {/* Interactive folio index indicators */}
                <div className="hidden items-center gap-1.5 sm:flex" role="group" aria-label="Select archive folio">
                  {GALLERY_ITEMS.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleJumpToIndex(idx)}
                      aria-label={`Jump to folio ${item.indexNumber}: ${item.shortTitle}`}
                      className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                        idx === activeIndex
                          ? 'w-5 bg-[#F4F2EC]'
                          : 'w-1.5 bg-[#F4F2EC]/25 hover:bg-[#F4F2EC]/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-1 truncate font-serif text-xl text-[#F4F2EC] sm:text-2xl">
                {GALLERY_ITEMS[activeIndex].title}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleStep(-1)}
                aria-label="Rotate gallery previous"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#F4F2EC]/20 text-sm text-[#F4F2EC] transition-colors hover:border-[#F4F2EC] hover:bg-[#F4F2EC] hover:text-[#0B0C0E]"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => onOpenEntry(GALLERY_ITEMS[activeIndex])}
                className="cursor-pointer rounded-full border border-[#F4F2EC]/25 bg-[#F4F2EC] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#0B0C0E] transition-colors hover:bg-[#E5E2D9]"
              >
                Open Reading View
              </button>
              <button
                type="button"
                onClick={() => handleStep(1)}
                aria-label="Rotate gallery next"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#F4F2EC]/20 text-sm text-[#F4F2EC] transition-colors hover:border-[#F4F2EC] hover:bg-[#F4F2EC] hover:text-[#0B0C0E]"
              >
                →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
