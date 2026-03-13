"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisaTestModule = void 0;
const common_1 = require("@nestjs/common");
const visa_test_service_1 = require("./visa-test.service");
const visa_test_controller_1 = require("./visa-test.controller");
let VisaTestModule = class VisaTestModule {
};
exports.VisaTestModule = VisaTestModule;
exports.VisaTestModule = VisaTestModule = __decorate([
    (0, common_1.Module)({
        providers: [visa_test_service_1.VisaTestService],
        controllers: [visa_test_controller_1.VisaTestController]
    })
], VisaTestModule);
//# sourceMappingURL=visa-test.module.js.map