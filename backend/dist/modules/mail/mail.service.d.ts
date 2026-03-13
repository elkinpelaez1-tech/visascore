export declare class MailService {
    private resend;
    constructor();
    sendResultEmail(email: string, testId: string, score: number, pdfBuffer?: Uint8Array | Buffer): Promise<void>;
}
