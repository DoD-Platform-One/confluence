const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    env: {
      url: "https://confluence.bigbang.dev"
    },
    video: true,
    screenshot: true,
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement other node event listeners here
    },
  },
})