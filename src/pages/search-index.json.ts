import type { APIRoute } from 'astro';

import { CATEGORIES, categoryUrl, machineUrl, machines, machinesIndexUrl } from '~/utils/machines';

// A small static index, fetched lazily the first time somebody opens the
// search dialog — never on page load. Section headings are included so a query
// like "clinching" or "vision" still lands on the right machine page even when
// the word never appears in the title or the description.
type Entry = {
  url: string;
  title: string;
  description: string;
  group: string;
  kind: 'overview' | 'group' | 'machine';
  headings: string[];
};

const clean = (value: string) =>
  value
    .replace(/\s*[|—–-]\s*Southern Machinery\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

export const GET: APIRoute = () => {
  const entries: Entry[] = [
    {
      url: machinesIndexUrl(),
      title: 'THT auto insertion machines — overview',
      description:
        'Axial, radial, odd-form and terminal THT insertion machines for smart EMS factories, plus the feeders and line design that go with them.',
      group: 'Overview',
      kind: 'overview',
      headings: ['How a THT line gets specified', 'Machine groups', 'All machines'],
    },
  ];

  for (const category of CATEGORIES) {
    entries.push({
      url: categoryUrl(category.slug),
      title: `${category.name} — THT auto insertion`,
      description: category.description,
      group: category.name,
      kind: 'group',
      headings: [category.tagline, category.name],
    });
  }

  for (const machine of machines) {
    const group = CATEGORIES.find((category) => category.slug === machine.category)?.name ?? 'THT auto insertion';
    const headings = Array.from(
      new Set(
        machine.blocks.flatMap((block) =>
          block.nodes
            .filter((node) => node.t === 'h2' || node.t === 'h3' || node.t === 'h4')
            .map((node) => clean(node.text ?? ''))
            .filter((text) => text.length > 3 && text.length < 120)
        )
      )
    ).slice(0, 24);

    entries.push({
      url: machineUrl(machine.slug),
      title: clean(machine.title),
      description: machine.description,
      group,
      kind: 'machine',
      headings,
    });
  }

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
