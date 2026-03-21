import { Injectable, OnModuleDestroy } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

@Injectable()
export class BrowserService implements OnModuleDestroy {
  private browser: Browser | null = null;

  async getBrowser() {
    if (!this.browser || !this.browser.connected) {
      const execPath = await chromium.executablePath();
      if (!execPath) {
        throw new Error("Chromium executable path not found");
      }

      this.browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: execPath,
        headless: true,
      });
    }
    return this.browser;
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
