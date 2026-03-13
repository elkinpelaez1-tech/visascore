"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisaTestController = void 0;
const common_1 = require("@nestjs/common");
const visa_test_service_1 = require("./visa-test.service");
let VisaTestController = class VisaTestController {
    visaTestService;
    constructor(visaTestService) {
        this.visaTestService = visaTestService;
    }
    async submit(profile) {
        return this.visaTestService.submitTest(profile);
    }
    async getStatus(id) {
        return this.visaTestService.getStatus(id);
    }
    async getResult(id) {
        return this.visaTestService.getResult(id);
    }
};
exports.VisaTestController = VisaTestController;
__decorate([
    (0, common_1.Post)('submit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VisaTestController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisaTestController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('result/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisaTestController.prototype, "getResult", null);
exports.VisaTestController = VisaTestController = __decorate([
    (0, common_1.Controller)('visa-test'),
    __metadata("design:paramtypes", [visa_test_service_1.VisaTestService])
], VisaTestController);
//# sourceMappingURL=visa-test.controller.js.map