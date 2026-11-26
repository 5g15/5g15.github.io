import type { AcademicSubject, EssayCategory, MonographEntry } from '../types/portfolio';

export const STUDIO_PROFILE = {
  eyebrow: "HI, I'M ISAAC CHONG",
  name: 'Isaac Chong',
  handle: '@5g15isaac',
  xHandle: '@BearishOnHype',
  githubHandle: '5g15',
  heroTitleLine1: 'Economics, Markets',
  heroTitleLine2: '& Systems',
  ctaLabel: 'Explore Research',
  location: 'Singapore',
  instagramUrl: 'https://instagram.com/5g15isaac',
  xUrl: 'https://x.com/BearishOnHype',
  githubUrl: 'https://github.com/5g15',
  portraitPath: '/images/isaac-portrait.png',
  characterVideoPath: '/videos/animated-cartoon.mp4',
};

export const ESSAY_CATEGORIES: EssayCategory[] = [
  'All',
  'H3 Economics & Markets',
  'Market Structure & Game Theory',
  'AI & Labor',
];

export const MONOGRAPH_ENTRIES: MonographEntry[] = [
  {
    id: 'h3-econ-game-theory-market-structure',
    indexNumber: '01',
    kind: 'Essay',
    categoryLabel: 'H3 Economics & Market Research',
    essayCategory: 'Market Structure & Game Theory',
    title: 'Game Theory, Industrial Organization & Oligopolistic Pricing Power',
    shortTitle: 'H3 Economics & Market Structure',
    subtitle:
      'Strategic equilibrium, entry deterrence, and why contestability matters more than headline market-share concentration.',
    date: 'Nov 2026',
    readTime: '7 min read',
    locationOrVenue: 'H3 Economics · @BearishOnHype',
    badge: 'H3 Economics',
    cardTone: 'paper',
    inGallery: true,
    summary:
      'Microeconomic analysis connecting H3 industrial organization theory with real-world platform competition, price leadership, and credible commitment games.',
    keyThesis:
      'High market share alone does not guarantee durable supernormal profits; pricing power survives only when incumbents control irreversible switching costs, regulatory bottlenecks, or credible capacity deterrence.',
    metrics: [
      { label: 'Discipline', value: 'H3 Economics' },
      { label: 'Lens', value: 'Game Theory & IO' },
      { label: 'Curated With', value: '@BearishOnHype' },
    ],
    keyPoints: [
      'Repeated Bertrand and Cournot games explain why capacity commitments often yield more stable margins than pure price wars.',
      'In digital and compute-heavy markets, high fixed R&D paired with low marginal serving costs creates natural oligopolies—unless open standards preserve contestability.',
      'Separating cyclical pricing power from structural barriers to entry prevents overpaying for temporary scarcity rents.',
    ],
    sections: [
      {
        heading: 'I. Beyond Static Textbook Concentration Ratios',
        paragraphs: [
          'Surface-level market commentary often equates a high four-firm concentration ratio with an unassailable monopoly. Yet industrial organization theory—and Baumol’s theory of contestable markets—shows that potential entry disciplines incumbent pricing whenever sunk costs are low.',
          'To evaluate whether an incumbent truly holds durable pricing power, we must examine the strategic game played against marginal entrants: what irreversible commitments deter entry, and how rapidly do customers defect when relative quality shifts?',
        ],
      },
      {
        heading: 'II. Credible Threats in Repeated Strategic Games',
        paragraphs: [
          'In single-period games, aggressive price cutting to deter entrants is rarely subgame-perfect because once entry occurs, accommodation yields higher payoffs than mutual value destruction. Across repeated horizons, however, reputation effects, vertical integration, and pre-committed distribution capacity transform empty threats into credible equilibrium outcomes.',
        ],
        pullQuote:
          'Markets rarely reward narrative dominance for long; they reward players whose structural incentives make defection costly and imitation slow.',
      },
      {
        heading: 'III. Implications for Capital Allocation',
        paragraphs: [
          'Reading financial statements through an H3 microeconomic lens sharpens business judgment. Gross margin durability, customer acquisition payback, and working-capital leverage are simply accounting reflections of underlying game-theoretic bargaining power between firms, suppliers, and buyers.',
        ],
      },
    ],
  },
  {
    id: 'ai-financial-markets-labor-repricing',
    indexNumber: '02',
    kind: 'Essay',
    categoryLabel: 'AI, Financial Markets & Labor',
    essayCategory: 'AI & Labor',
    title: 'AI’s Structural Impact on Financial Markets, Margins & Knowledge Labor',
    shortTitle: 'AI, Markets & Labor',
    subtitle:
      'Curated alongside @BearishOnHype: separating real productivity compounding from capex-driven narrative inflation.',
    date: 'Oct 2026',
    readTime: '6 min read',
    locationOrVenue: 'Macro & Markets · @BearishOnHype',
    badge: '@BearishOnHype',
    cardTone: 'slate',
    inGallery: true,
    summary:
      'An empirical look at how plummeting cognitive inference costs reshape task complementarity, white-collar wage dispersion, and equity duration pricing.',
    keyThesis:
      'Artificial intelligence behaves less like a uniform labor replacement and more like an asymmetric collapse in the price of routine synthesis—raising the return on verification, judgment, and scarce physical/institutional bottlenecks.',
    metrics: [
      { label: 'Focus', value: 'Markets & Labor' },
      { label: 'Publication', value: '@BearishOnHype' },
      { label: 'Horizon', value: 'Structural Macro' },
    ],
    keyPoints: [
      'When routine analytical production becomes abundant, economic rents migrate to auditability, proprietary distribution, and accountable decision-making.',
      'Massive front-loaded infrastructure capex creates a timing mismatch between depreciation schedules and verified enterprise cash flows—driving heightened equity volatility.',
      'Labor market adjustment occurs primarily through task reallocation within roles rather than wholesale occupation extinction.',
    ],
    sections: [
      {
        heading: 'I. Task Complementarity vs. Substitution',
        paragraphs: [
          'Economic history demonstrates that general-purpose technologies rarely map one-to-one onto job destruction. Instead, they unbundle occupations into constituent tasks—automating low-ambiguity drafting, coding, and summarization while increasing the marginal value of problem framing and cross-domain verification.',
          'In financial analysis, the ability to read ten filings in ten minutes no longer confers edge once every desk possesses the same synthesizer. Edge shifts upward to forming non-consensus hypotheses and stress-testing underlying economic assumptions.',
        ],
      },
      {
        heading: 'II. Capex Cycles and Market Discipline',
        paragraphs: [
          'Every technological wave attracts speculative capital that conflates gross revenue growth with durable return on invested capital. Evaluating AI-exposed equities through disciplined unit economics—inference gross margins, net retention after pilot budgets expire, and free-cash-flow conversion—cuts cleanly through hype cycles.',
        ],
        pullQuote:
          'Bearish on hype, constructive on compounding fundamentals: technology changes cost curves, never the laws of discounted cash flow.',
      },
    ],
    externalLink: {
      label: 'Follow notes on @BearishOnHype',
      href: 'https://x.com/BearishOnHype',
    },
  },
  {
    id: 'green-horizons-marsiling',
    indexNumber: '03',
    kind: 'Project',
    categoryLabel: 'Community Sustainability Initiative',
    title: 'Green Horizons — Marsiling Food Waste & Composting Initiative',
    shortTitle: 'Green Horizons',
    subtitle:
      'Student-led neighbourhood food waste diversion executed with Marsiling Constituency Office, Marsiling Community Club, People’s Association, and Marsiling Zone 3 RN Centre.',
    date: '2024 – 2025',
    readTime: '5 min read',
    locationOrVenue: 'Marsiling · People’s Association',
    badge: 'Civic Sustainability',
    cardTone: 'stone',
    inGallery: true,
    partners: [
      'Marsiling Constituency Office',
      'Marsiling Community Club',
      "People's Association",
      'Marsiling Zone 3 RN Centre',
    ],
    summary:
      'Translated residential sustainability goals into tangible neighbourhood infrastructure—combining composting bin installations, hands-on resident workshops, and practical food-waste educational pamphlets.',
    keyThesis:
      'Household sustainability habits fail when participation requires friction; pairing local grassroots institutions with accessible on-site composting bins and clear visual guidance closes the intention-action gap.',
    metrics: [
      { label: 'Civic Partners', value: '4 Grassroots Bodies' },
      { label: 'Infrastructure', value: 'Composting Bins' },
      { label: 'Outreach', value: 'Resident Workshops' },
    ],
    keyPoints: [
      'Partnered formally with Marsiling Constituency Office, Marsiling Community Club, People’s Association, and Marsiling Zone 3 RN Centre.',
      'Installed dedicated neighbourhood composting stations with clear sorting guidelines tailored for everyday HDB households.',
      'Conducted hands-on resident workshops and distributed concise educational pamphlets covering scrap separation and odor-free aerobic composting.',
    ],
    sections: [
      {
        heading: 'I. Addressing Urban Food Waste at the Neighbourhood Level',
        paragraphs: [
          'Food waste remains one of Singapore’s largest yet least-recycled waste streams. Most public sustainability campaigns stop at abstract awareness posters, leaving residents unsure of what scraps can be composted or where to bring them.',
          'Green Horizons was built as a ground-up student initiative focused on practical execution: lowering behavioural friction by placing functional composting infrastructure directly within residential community touchpoints.',
        ],
      },
      {
        heading: 'II. Grassroots Coordination Across Four Institutions',
        paragraphs: [
          'Deploying physical infrastructure in public residential estates requires disciplined stakeholder alignment. Working closely with Marsiling Constituency Office, Marsiling Community Club, People’s Association, and Marsiling Zone 3 RN Centre, we coordinated site approvals, bin maintenance workflows, and resident publicity.',
        ],
        pullQuote:
          'Lasting civic impact happens when student energy meets institutional continuity—turning a weekend workshop into permanent neighbourhood infrastructure.',
      },
      {
        heading: 'III. Resident Workshops & Educational Collateral',
        paragraphs: [
          'Alongside installing composting bins, we ran interactive resident workshops demonstrating household scrap sorting, carbon-to-nitrogen balance, and nutrient-rich soil reuse. Take-home educational pamphlets distilled these practices into crisp visual checklists residents could keep in their kitchens.',
        ],
      },
    ],
  },
  {
    id: 'mucilage-water-filtration-sysf',
    indexNumber: '04',
    kind: 'Research',
    categoryLabel: 'Science Research · SYSF Distinction',
    title: 'Natural Plant Mucilage as a Bio-Flocculant for Water Filtration',
    shortTitle: 'Mucilage Water Filtration',
    subtitle:
      'Investigative experimental study evaluating biodegradable plant-derived mucilage for suspended-particle turbidity reduction — awarded Distinction at the Singapore Youth Science Fair (SYSF).',
    date: '2024',
    readTime: '6 min read',
    locationOrVenue: 'Singapore Youth Science Fair (SYSF)',
    badge: 'SYSF Distinction',
    cardTone: 'paper',
    inGallery: true,
    summary:
      'Controlled laboratory jar-test investigation demonstrating that polysaccharide-rich plant mucilage drives rapid particle bridging and measurable turbidity reduction as an eco-friendly alternative to synthetic alum coagulants.',
    keyThesis:
      'Natural plant mucilage exhibits reproducible polymeric bridging flocculation across an optimal dosage window, significantly clarifying turbid water without introducing persistent synthetic metal salts.',
    metrics: [
      { label: 'Recognition', value: 'SYSF Distinction' },
      { label: 'Mechanism', value: 'Bio-Flocculation' },
      { label: 'Assay', value: 'Controlled Jar Tests' },
    ],
    keyPoints: [
      'Awarded Certificate of Distinction at the Singapore Youth Science Fair (SYSF) for experimental rigor and environmental relevance.',
      'Established controlled turbidity calibration and extraction protocols comparing concentration gradients against untreated control baselines.',
      'Identified the optimal mucilage dosage threshold maximizing floc settling velocity prior to viscosity-induced plateauing.',
    ],
    sections: [
      {
        heading: 'I. Hypothesis & Research Objective',
        paragraphs: [
          'Conventional municipal and rural water clarification relies heavily on synthetic inorganic coagulants such as aluminium sulphate (alum), which generate non-biodegradable sludge and carry residual toxicity concerns. This investigation tested whether natural polysaccharide-rich plant mucilage could function as a safe, biodegradable bio-coagulant and flocculant for reducing water turbidity.',
        ],
      },
      {
        heading: 'II. Experimental Methodology',
        paragraphs: [
          'Standardized turbid water suspensions were prepared and treated across controlled dosage gradients of extracted plant mucilage alongside untreated controls. Each sample underwent structured jar-test protocols—combining rapid dispersion mixing, gentle flocculation agitation to promote inter-particle collision, and timed gravitational sedimentation—followed by quantitative turbidity measurements.',
        ],
      },
      {
        heading: 'III. Key Findings & SYSF Distinction',
        paragraphs: [
          'Treated samples displayed visible macro-floc aggregation and substantial reductions in optical turbidity compared against untreated baselines. Removal efficiency traced a distinct dose-response curve, peaking at an optimal mucilage concentration before levelling off at excessive dosages where excess polymer chains stabilized particles and raised fluid viscosity.',
          'The project was awarded the Certificate of Distinction at the Singapore Youth Science Fair (SYSF), validating botanical bio-flocculants as a promising, low-cost direction for sustainable water treatment.',
        ],
        pullQuote:
          'Good empirical science strips away assumptions: hold the baseline constant, map the full dose-response curve, and let measured turbidity speak.',
      },
    ],
  },
  {
    id: 'raffles-institution-academic-foundation',
    indexNumber: '05',
    kind: 'Academic',
    categoryLabel: 'Academic Foundation · Year 6',
    title: 'Raffles Institution — GCE A-Levels & H3 Economics Track',
    shortTitle: 'Raffles Institution',
    subtitle:
      'Year 6 interdisciplinary curriculum bridging H3 Economics, quantitative sciences (H2 Physics, H2 Chemistry, H2 Mathematics), H2 Economics, and H1 General Paper.',
    date: 'Year 6 · Singapore',
    readTime: '3 min read',
    locationOrVenue: 'Raffles Institution, Singapore',
    badge: 'H3 Economics',
    cardTone: 'stone',
    inGallery: true,
    summary:
      'An analytical academic foundation pairing rigorous physical sciences and mathematics with extended H3 microeconomic & macroeconomic inquiry.',
    keyThesis:
      'Combining first-principles mathematical modeling from Physics and Mathematics with institutional incentive analysis from H3 Economics builds a sharper lens for real-world systems.',
    metrics: [
      { label: 'Institution', value: 'Raffles Institution' },
      { label: 'Stage', value: 'Year 6 · GCE A-Levels' },
      { label: 'Extension', value: 'H3 Economics' },
    ],
    keyPoints: [
      'H3 Economics: Extended theoretical inquiry into market structure, strategic behavior, behavioral deviations, and macroeconomic policy trade-offs.',
      'Quantitative Core: H2 Mathematics, H2 Physics, and H2 Chemistry grounding empirical experimentation and statistical intuition.',
      'Critical Writing: H2 Economics and H1 General Paper honing structured argumentation on global affairs and economic policy.',
    ],
    sections: [
      {
        heading: 'I. Interdisciplinary Rigor',
        paragraphs: [
          'At Raffles Institution (Year 6), my GCE A-Level subject combination deliberately spans both exact quantitative sciences—H2 Physics, H2 Chemistry, and H2 Mathematics—and social-scientific economic reasoning across H2 Economics, H3 Economics, and H1 General Paper.',
          'Rather than treating these disciplines as silos, this foundation informs how I approach open-ended problems: framing hypotheses rigorously like a laboratory experiment while accounting for human incentives and equilibrium feedback loops like an economist.',
        ],
      },
      {
        heading: 'II. H3 Economics & Extended Inquiry',
        paragraphs: [
          'Pursuing H3 Economics deepened my engagement with game theory, industrial organization, market failure remedies, and small open economy macroeconomics—directly inspiring the essays and market notes published alongside @BearishOnHype.',
        ],
      },
    ],
  },
  {
    id: 'sg-exchange-rate-regime-macro',
    indexNumber: '06',
    kind: 'Essay',
    categoryLabel: 'H3 Economics & Markets',
    essayCategory: 'H3 Economics & Markets',
    title: 'Small Open Economy Transmission: Singapore’s S$NEER Policy Band',
    shortTitle: 'S$NEER Monetary Regime',
    subtitle:
      'Why Singapore targets the nominal effective exchange rate over policy interest rates, and how external rate cycles pass through domestic liquidity.',
    date: 'Sep 2026',
    readTime: '5 min read',
    locationOrVenue: 'H3 Macroeconomics · Singapore',
    badge: 'Macro Note',
    cardTone: 'slate',
    inGallery: true,
    summary:
      'Examining the Impossible Trinity in practice: why trade openness exceeding 300% of GDP makes the S$NEER slope and re-centering Singapore’s primary anti-inflation anchor.',
    keyThesis:
      'Institutional monetary frameworks must mirror economic structure; in a frictionless financial hub dominated by trade, exchange-rate band calibration stabilizes domestic purchasing power far more cleanly than domestic interest-rate targeting.',
    metrics: [
      { label: 'Framework', value: 'S$NEER Band' },
      { label: 'Context', value: 'MAS · Singapore' },
      { label: 'Lens', value: 'Open-Economy Macro' },
    ],
    keyPoints: [
      'Open capital accounts and exchange-rate management require accepting global USD/SORA interest-rate pass-through under the Mundell-Fleming trilemma.',
      'Gradual S$NEER slope appreciation dampens persistent imported inflation while preserving long-run export competitiveness.',
      'Discrete midpoint re-centering acts as an immediate shock absorber during sudden external commodity or supply-chain spikes.',
    ],
    sections: [
      {
        heading: 'I. Structure Dictates Instrument',
        paragraphs: [
          'Textbook monetary transmission assumes domestic credit channels dominate aggregate demand. In Singapore, where merchandise and services trade routinely exceeds three times GDP, imported intermediate and consumer prices drive headline CPI far more directly than domestic mortgage sensitivity.',
          'By steering the trade-weighted S$NEER within an undisclosed band defined by slope, width, and level centering, MAS matches monetary policy mechanics directly to the architecture of a small open economy.',
        ],
      },
      {
        heading: 'II. Reading Domestic Liquidity & Asset Pricing',
        paragraphs: [
          'Understanding why domestic SORA tracks global funding markets—even while MAS tightens or eases via the exchange rate—clarifies cross-asset pricing for Singapore REITs, banks, and sovereign curves across global rate cycles.',
        ],
      },
    ],
  },
];

export const RAFFLES_SUBJECTS: AcademicSubject[] = [
  {
    code: 'H3',
    subject: 'Economics',
    focus: 'Game theory, industrial organization, market structure & extended macro policy',
  },
  {
    code: 'H2',
    subject: 'Economics',
    focus: 'Microeconomic equilibrium, market failure, trade & macroeconomic management',
  },
  {
    code: 'H2',
    subject: 'Mathematics',
    focus: 'Calculus, probability distributions, hypothesis testing & quantitative modeling',
  },
  {
    code: 'H2',
    subject: 'Physics',
    focus: 'Classical mechanics, electromagnetism, waves & physical systems analysis',
  },
  {
    code: 'H2',
    subject: 'Chemistry',
    focus: 'Physical thermodynamics, kinetics, analytical chemistry & organic synthesis',
  },
  {
    code: 'H1',
    subject: 'General Paper',
    focus: 'Critical argumentation, epistemology, technology & global socio-economic affairs',
  },
];
