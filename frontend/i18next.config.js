import { defineConfig } from 'i18next-cli';

/** @type {import('i18next-cli').I18nextToolkitConfig} */
export default defineConfig({
  locales: [
    "en",
    "fr"
  ],
  extract: {
    input: "src/**/*.{js,jsx,ts,tsx}",
    output: "public/locales/{{language}}/{{namespace}}.json",
    ignoredAttributes: ['variant', 'sx', 'align', 'focusVisibleClassName', 'labelPlacement', 'id', 'labelId', 'color', 'component', 'accept', 'aria-live']
  }
});