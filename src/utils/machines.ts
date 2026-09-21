import { SITE } from 'astrowind:config';

/* ------------------------------------------------------------------ *
 * Content model
 *
 * Every machine page was extracted from its single-file HTML original into
 * a normalised block list, so the templates below never need to know which
 * of the four source page families a machine came from. Each text node
 * keeps the `data-i18n` key it carried in the original, which is what lets
 * the same block list render in all seven shipped languages.
 * ------------------------------------------------------------------ */

export const LOCALES = ['en', 'es', 'pt', 'fr', 'ar', 'ru', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABEL: Record<string, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  ar: 'العربية',
  ru: 'Русский',
  zh: '中文',
};

export const RTL_LOCALES = new Set(['ar']);

export interface MachineNode {
  t: string;
  key?: string;
  text?: string;
  href?: string;
  items?: { key?: string; text?: string; t?: string; d?: string }[];
  head?: string[];
  rows?: { key?: string; text?: string }[][];
  caption?: string;
  q?: string;
  a?: string;
}

export interface MachineVideo {
  id: string;
  title?: string;
  /** i18n key the source used for the caption, when the grid was built in JS. */
  titleKey?: string;
  duration?: string;
}

export interface MachineBlock {
  id: string;
  heading: string;
  nodes: MachineNode[];
  images: { src: string; alt: string }[];
  videos: MachineVideo[];
  docs: { label: string; url: string }[];
}

export interface Machine {
  slug: string;
  category: CategorySlug;
  title: string;
  description: string;
  sourceUrl: string;
  heroImage: string;
  langs: string[];
  blocks: MachineBlock[];
}

export type CategorySlug = 'axial' | 'radial' | 'odd-form' | 'terminal' | 'line' | 'guideline';

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: 'odd-form',
    name: 'Odd-form insertion',
    tagline: 'Relays, transformers, connectors and sockets',
    description:
      'Multi-head odd-form inserters for the parts no placement machine will take, fed from tape, tube, tray or bowl and clinched in a single pass.',
  },
  {
    slug: 'radial',
    name: 'Radial insertion',
    tagline: 'Electrolytics, Y-caps and radial taped components',
    description:
      'Radial lead taped insertion machines that replace hand assembly on dense power boards, driver boards and LED panels.',
  },
  {
    slug: 'axial',
    name: 'Axial insertion',
    tagline: 'Resistors, diodes and jumper wire',
    description:
      'Axial sequencing and insertion for leaded parts, including the jumper-wire variant that replaces hand-laid wire links.',
  },
  {
    slug: 'terminal',
    name: 'Terminal insertion',
    tagline: 'FASTON, reel terminals and clips',
    description:
      'Reel-terminal and clip insertion machines that automate terminal feeding and clinching on power boards and appliance PCBs.',
  },
  {
    slug: 'line',
    name: 'Turnkey THT lines',
    tagline: 'Load, insert, clinch, unload, report',
    description:
      'Whole-line design for THT assembly: machine mix, feeder ownership, board flow, staffing and measured output.',
  },
  {
    slug: 'guideline',
    name: 'PCB design guideline',
    tagline: 'Design rules for auto insertion (DFM)',
    description:
      'Board envelope, datum holes, hole sizing, span tables and tolerance chains needed before a THT line can be automated.',
  },
];

export const CATEGORY_BY_SLUG: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((category) => [category.slug, category])
);

/* ------------------------------------------------------------------ *
 * Loading
 * ------------------------------------------------------------------ */

const machineModules = import.meta.glob<{ default: Machine }>('../data/machines/*.json', { eager: true });
const i18nModules = import.meta.glob<{ default: Record<string, Record<string, string>> }>('../data/i18n/*.json', {
  eager: true,
});

export const machines: Machine[] = Object.values(machineModules)
  .map((module) => module.default)
  .sort((a, b) => a.slug.localeCompare(b.slug));

export const machinesBySlug: Record<string, Machine> = Object.fromEntries(
  machines.map((machine) => [machine.slug, machine])
);

const dictionaries: Record<string, Record<string, Record<string, string>>> = Object.fromEntries(
  Object.entries(i18nModules).map(([path, module]) => {
    const slug = path.split('/').pop()!.replace('.json', '');
    return [slug, module.default];
  })
);

export const machineCategories = (slug: CategorySlug): Machine[] => machines.filter((m) => m.category === slug);

export const machinesWithTranslations = (): Machine[] => machines.filter((m) => m.langs.length > 1);

export const availableLocales = (machine: Machine): Locale[] =>
  machine.langs.length > 1 ? LOCALES.filter((locale) => machine.langs.includes(locale)) : ['en'];

export const dictionaryFor = (slug: string, locale: string): Record<string, string> =>
  dictionaries[slug]?.[locale] ?? {};

/* ------------------------------------------------------------------ *
 * Translation helper — falls back to the extracted English when a
 * dictionary entry is missing, so no page ever renders an empty node.
 * ------------------------------------------------------------------ */

export const translate = (node: MachineNode, dict: Record<string, string>, field: 'text' | 'q' | 'a' | 'caption' = 'text'): string => {
  const fallback = (node[field] as string) ?? '';
  const key = node.key;
  if (!key || !dict) return fallback;
  const value = dict[key];
  return typeof value === 'string' && value.length > 0 ? value : fallback;
};

export const translateItem = (
  item: { key?: string; text?: string },
  dict: Record<string, string>
): string => {
  const key = item?.key;
  if (key && dict && typeof dict[key] === 'string' && dict[key].length > 0) return dict[key];
  return item?.text ?? '';
};

/* ------------------------------------------------------------------ *
 * URLs
 * ------------------------------------------------------------------ */

const BASE = (SITE.base || '/').replace(/\/+$/, '');

const withBase = (path: string) => {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `${BASE}/${clean}/` : `${BASE}/`;
};

// `site.base` already carries the deployment sub-path (the repository name),
// and the routes sit at the root of the route tree, so the helpers only add the
// locale segment and the route slug. English (the default locale) is unprefixed.
export const machinesIndexUrl = (locale: string = DEFAULT_LOCALE) =>
  locale === DEFAULT_LOCALE ? withBase('') : withBase(locale);

export const categoryUrl = (category: string, locale: string = DEFAULT_LOCALE) =>
  locale === DEFAULT_LOCALE ? withBase(category) : withBase(`${locale}/${category}`);

export const machineUrl = (slug: string, locale: string = DEFAULT_LOCALE) =>
  locale === DEFAULT_LOCALE ? withBase(slug) : withBase(`${locale}/${slug}`);
