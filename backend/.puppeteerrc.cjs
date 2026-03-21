const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Configura la caché de puppeteer en una carpeta local
  // para que Render la almacene y no la elimine en cada build
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
