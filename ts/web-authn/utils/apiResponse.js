"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiResponse = void 0;
var apiResponse = /** @class */ (function () {
    function apiResponse(statusCode, data, message) {
        if (message === void 0) { message = "Success"; }
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
    return apiResponse;
}());
exports.apiResponse = apiResponse;
