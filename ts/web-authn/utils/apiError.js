"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiError = void 0;
var apiError = /** @class */ (function (_super) {
    __extends(apiError, _super);
    function apiError(statusCode, message, errors, stack) {
        if (message === void 0) { message = "Something went wrong"; }
        if (errors === void 0) { errors = []; }
        if (stack === void 0) { stack = ""; }
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.data = null;
        _this.success = false;
        _this.errors = errors;
        if (stack) {
            _this.stack = stack;
        }
        else {
            if (Error.captureStackTrace) {
                Error.captureStackTrace(_this, _this.constructor);
            }
        }
        return _this;
    }
    return apiError;
}(Error));
exports.apiError = apiError;
