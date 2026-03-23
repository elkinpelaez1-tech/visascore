import { OnModuleDestroy } from '@nestjs/common';
export declare class BrowserService implements OnModuleDestroy {
    private browser;
    getBrowser(): Promise<any>;
    onModuleDestroy(): Promise<void>;
}
