import { OnModuleDestroy } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
export declare class BrowserService implements OnModuleDestroy {
    private browser;
    getBrowser(): Promise<puppeteer.Browser>;
    onModuleDestroy(): Promise<void>;
}
