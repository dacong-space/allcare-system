const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node events here if needed
    }
  }
});
