// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const packageJson = require('../../package.json');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'react-international-phone',
  tagline: 'International phone input component for React',
  url: 'https://react-international-phone-docs.vercel.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  organizationName: 'ybrusentsov',
  projectName: 'react-international-phone',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/ybrusentsov/react-international-phone/tree/master/packages/docs/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: 'support_ukraine',
        content:
          '<a target="_blank" rel="noopener noreferrer" href="https://war.ukraine.ua/support-ukraine/" style="display: flex; align-items: center; justify-content: center">Support Ukraine<img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1fa-1f1e6.svg" width="20px" style="margin-left: 8px" /></a>',
        backgroundColor: 'var(--ifm-color-emphasis-900)',
        textColor: 'var(--ifm-color-emphasis-0)',
        isCloseable: false,
      },
      navbar: {
        title: 'react-international-phone',
        logo: undefined,
        items: [
          {
            type: 'doc',
            docId: 'getting-started',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/ybrusentsov/react-international-phone',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/getting-started',
              },
              {
                label: 'Usage',
                to: '/docs/Usage/PhoneInput',
              },
              {
                label: 'Subcomponents API',
                to: '/docs/Subcomponents%20API/',
              },
              {
                label: 'Advanced Usage',
                to: '/docs/Advanced%20Usage/usePhoneInput',
              },
              {
                label: 'Migrations',
                to: '/docs/Migrations/migrate-to-v2',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Github Discussions',
                href: 'https://github.com/ybrusentsov/react-international-phone/discussions',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/ybrusentsov/react-international-phone',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} react-international-phone. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      metadata: [
        { name: 'keywords', content: packageJson.keywords.join(', ') },
      ],
    }),
};

module.exports = config;
