import { Injectable, OnModuleDestroy } from '@nestjs/common';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

@Injectable()
export class BrowserService implements OnModuleDestroy {
  private browser: any = null;

  async getBrowser() {
    if (!this.browser || !this.browser.connected) {
      const execPath = await chromium.executablePath();
      if (!execPath) {
        throw new Error("Chromium executable path not found");
      }

      this.browser = await puppeteer.launch({
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
