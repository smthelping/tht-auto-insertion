// AstroWind's `getPermalink` already prefixes the deployment sub-path
// (`site.base`), so the helpers in `~/utils/machines` are used here instead:
// they add the sub-path *and* the trailing slash that GitHub Pages serves
// directly, avoiding a redirect hop on every navigation click.
import { CATEGORIES, categoryUrl, machinesIndexUrl } from '~/utils/machines';

const CATEGORY_LINKS = CATEGORIES.map((category) => ({
  text: category.name,
  href: categoryUrl(category.slug),
}));

export const headerData = {
  links: [
    {
      text: 'Machines',
      links: CATEGORY_LINKS,
    },
    {
      text: 'Overview',
      href: machinesIndexUrl(),
    },
    {
      text: 'Machine catalogue',
      href: 'https://file.autoinsertion.com/public/Southern-Machinery-Product-Catalog-Board.html',
      target: '_blank',
    },
    {
      text: 'Videos',
      href: 'https://file.autoinsertion.com/public/Southern-Machinery-YouTube-Video-Board.html',
      target: '_blank',
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'THT auto insertion',
      links: CATEGORY_LINKS,
    },
    {
      title: 'Machine resources',
      links: [
        {
          text: 'Product catalogue board',
          href: 'https://file.autoinsertion.com/public/Southern-Machinery-Product-Catalog-Board.html',
        },
        {
          text: 'YouTube video board',
          href: 'https://file.autoinsertion.com/public/Southern-Machinery-YouTube-Video-Board.html',
        },
        { text: 'Machine photo library', href: 'https://ph.smthelp.com' },
        { text: 'Previous landing pages', href: 'https://smthelping.github.io/smt-product-landing-html/' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'www.smthelp.com', href: 'https://www.smthelp.com' },
        { text: 'All machines', href: machinesIndexUrl() },
        { text: 'info@smthelp.com', href: 'mailto:info@smthelp.com' },
        { text: 'WhatsApp +86 136 0256 2576', href: 'https://wa.me/8613602562576' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Overview', href: machinesIndexUrl() },
    { text: 'Contact', href: 'mailto:info@smthelp.com' },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/smtmachine' },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: 'https://www.youtube.com/c/Smthelping' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/autoinsertion' },
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://twitter.com/smtspecialist' },
  ],
  footNote: `
    Shenzhen Southern Machinery Sales and Service Co., Ltd. · Design and manufacturing of SMT and THT machines for smart EMS factories.
  `,
};
