module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/features/*/*'],
            message: 'Import feature qua public index: @/features/<name>',
          },
          {
            group: ['../../*', '../../../*'],
            message: 'Dùng alias @/ thay vì ../../',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      // Quality & file-size limits — applies to ALL code. New modules are covered automatically.
      files: ['src/**/*.{ts,tsx}'],
      plugins: ['@typescript-eslint'],
      rules: {
        'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
        'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
        'max-params': ['error', 4],
        'max-depth': ['error', 3],
        complexity: ['error', 15],
        'react/jsx-max-depth': ['error', { max: 6 }],
        'no-console': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/ban-ts-comment': 'error',
      },
    },
    {
      // Neo-brutalism is the default design system. Only the 3D portfolio uses its own pastel style.
      files: ['src/**/*.tsx'],
      excludedFiles: ['src/features/portfolio/**', 'src/app/portfolio/**'],
      rules: {
        'no-restricted-syntax': [
          'error',
          ...['Literal[value', 'TemplateElement[value.raw'].map((node) => ({
            selector: `${node}=/(^|[\\s:])(shadow(-(xs|sm|md|lg|xl|2xl))?|rounded-3xl|bg-gradient-\\S+|backdrop-blur\\S*|(bg|border|text|ring|from|to|via)-(slate|gray|zinc|stone|amber|indigo|rose|sky|emerald|red|blue|green|yellow|orange|violet|purple|pink|teal|cyan|lime|fuchsia)-\\d+(\\/\\d+)?)(?=\\s|$)/]`,
            message:
              'Neo-brutalism: dùng neo-card/neo-btn/neo-box*, màu #FFE600 #FF90E8 #A6FAFF #B8FF9F #FFB86B, viền đen; cấm bóng mờ, rounded-3xl, gradient, blur, palette Tailwind.',
          })),
        ],
      },
    },
    {
      files: ['src/app/**/page.tsx', 'src/app/**/layout.tsx'],
      rules: { 'max-lines': ['error', { max: 40, skipBlankLines: true, skipComments: true }] },
    },
    {
      files: ['src/features/*/views/**'],
      rules: { 'max-lines': ['error', { max: 180, skipBlankLines: true, skipComments: true }] },
    },
    {
      files: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      rules: { 'max-lines': ['error', { max: 400 }], 'max-lines-per-function': 'off', 'no-console': 'off' },
    },
    {
      // Static content, not logic.
      files: ['src/**/*.data.ts'],
      rules: { 'max-lines': 'off' },
    },
    {
      // LEGACY baseline (code written before these rules). This list may only SHRINK:
      // never add a file here — fix it instead. Remove a line once the file passes.
      files: [
        'src/app/layout.tsx',
        'src/features/home/components/NeoAbout.tsx',
        'src/features/home/components/NeoFooter.tsx',
        'src/features/home/components/NeoHero.tsx',
        'src/features/home/components/NeoNavbar.tsx',
        'src/features/home/components/NeoProjects.tsx',
        'src/features/home/components/NeoTechStack.tsx',
        'src/features/portfolio/PortfolioView.tsx',
        'src/features/portfolio/components/CompactNavbar.tsx',
        'src/features/portfolio/components/ContactCard.tsx',
        'src/features/portfolio/components/DestinationDock.tsx',
        'src/features/portfolio/components/FloatingContentPanel.tsx',
        'src/features/portfolio/components/JourneyProgress.tsx',
        'src/features/portfolio/components/ProjectDetailOverlay.tsx',
        'src/features/portfolio/lib/navigationState.ts',
        'src/features/portfolio/lib/portfolio.test.ts',
        'src/features/portfolio/scene/CameraController.tsx',
        'src/features/portfolio/scene/Landmark.tsx',
        'src/features/portfolio/scene/Landscape.tsx',
        'src/features/portfolio/scene/Road.tsx',
        'src/features/portfolio/scene/Vehicle.tsx',
        'src/shared/api/portfolio/portfolioApi.ts',
      ],
      rules: {
        'max-lines': 'off',
        'max-lines-per-function': 'off',
        complexity: 'off',
        'react/jsx-max-depth': 'off',
        'no-console': 'off',
        'no-restricted-syntax': 'off',
      },
    },
    {
      files: ['src/shared/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@/features/*', '@/app/*'],
                message: 'shared không được import từ features hay app',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['src/features/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@/app/*', '@/features/*/*'],
                message: 'features không được import app hay import sâu feature khác',
              },
              {
                group: ['../../*', '../../../*'],
                message: 'Dùng alias @/ thay vì ../../',
              },
            ],
          },
        ],
      },
    },
  ],
};
