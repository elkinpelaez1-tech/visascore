"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
let BrowserService = class BrowserService {
    browser = null;
    async getBrowser() {
        if (!this.browser || !this.browser.connected) {
            const execPath = await chromium_1.default.executablePath();
            if (!execPath) {
                throw new Error("Chromium executable path not found");
            }
            this.browser = await puppeteer_core_1.default.launch({
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
};
exports.BrowserService = BrowserService;
exports.BrowserService = BrowserService = __decorate([
    (0, common_1.Injectable)()
], BrowserService);
//# sourceMappingURL=browser.service.js.map