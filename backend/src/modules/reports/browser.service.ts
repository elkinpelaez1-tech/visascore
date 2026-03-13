import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class BrowserService implements OnModuleDestroy {
  private browser: puppeteer.Browser | null = null;

  async getBrowser() {
    if (!this.browser || !this.browser.connected) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
