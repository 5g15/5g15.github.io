export type ReadingKind = 'Essay' | 'Project' | 'Research' | 'Academic';

export type EssayCategory =
  | 'All'
  | 'H3 Economics & Markets'
  | 'Market Structure & Game Theory'
  | 'AI & Labor';

export interface MonographSection {
  heading: string;
  paragraphs: string[];
  pullQuote?: string;
}

export interface MonographEntry {
  id: string;
  indexNumber: string;
  kind: ReadingKind;
  categoryLabel: string;
  essayCategory?: Exclude<EssayCategory, 'All'>;
  title: string;
  shortTitle: string;
  subtitle: string;
  date: string;
  readTime: string;
  locationOrVenue: string;
  badge?: string;
  cardTone: 'paper' | 'slate' | 'stone' | 'ink';
  summary: string;
  keyThesis: string;
  partners?: string[];
  keyPoints: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  sections: MonographSection[];
  externalLink?: {
    label: string;
    href: string;
  };
  inGallery: boolean;
}

export interface AcademicSubject {
  code: 'H3' | 'H2' | 'H1';
  subject: string;
  focus: string;
}
