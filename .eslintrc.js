module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // 如果你在 Node.js 中使用
    es6: true, // 确保支持 ES6 全局变量和语法
  },
  extends: [
    'prettier',
    'prettier/vue',
    'plugin:vue/vue3-essential',
    'plugin:vue/recommended',
  ],
  overrides: [
    {
      files: ['pages/**/*.vue', 'layouts/*.vue'],
      rules: {
        'vue/multi-word-component-names': 0,
      },
    },
  ],
  plugins: ['prettier', 'vue'],
  rules: {
    'linebreak-style': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        'linebreak-style': 'off',
        endOfLine: 'auto',
      },
    ],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
}
