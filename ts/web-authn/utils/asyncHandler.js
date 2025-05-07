"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var asyncHandler = function (requestHandler) {
    return function (req, res, next) {
        Promise.resolve(requestHandler(req, res, next)).catch(function (err) { return next(err); });
    };
};
exports.default = asyncHandler;
