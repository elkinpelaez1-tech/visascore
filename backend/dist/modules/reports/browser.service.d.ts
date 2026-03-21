import { OnModuleDestroy } from '@nestjs/common';
import { Browser } from 'puppeteer-core';
export declare class BrowserService implements OnModuleDestroy {
    private browser;
    getBrowser(): Promise<Browser>;
    onModuleDestroy(): Promise<void>;
}
