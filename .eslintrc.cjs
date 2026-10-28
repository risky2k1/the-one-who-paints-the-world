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
