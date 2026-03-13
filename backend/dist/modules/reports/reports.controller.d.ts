import { ReportsService } from './reports.service';
import type { Response } from 'express';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generate(id: string, res: Response): Promise<void>;
}
