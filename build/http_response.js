"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var response_types_1 = require("./response_types");
var fs = require("fs");
var mime = require("mime-types");
var HTTPResponse = /** @class */ (function () {
    function HTTPResponse(code, response, options) {
        var _this = this;
        if (response === void 0) { response = {}; }
        if (options === void 0) { options = {}; }
        this.headers = {
            'Server': 'shttps',
            'X-Frame-Options': 'sameorigin',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '1; mode=block'
        };
        this.code = code;
        this.headers = Object.assign(this.headers, options.headers);
        if (response.plain) {
            this.headers['Content-Type'] = 'text/plain';
            this.message = response.plain;
        }
        else if (response.file) {
            this.headers['Content-Type'] = mime.contentType(response.file) || 'application/octet-stream';
            this._io = new Promise(function (resolve, reject) {
                fs.readFile(response.file, function (err, data) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    _this.message = data.toString();
                    resolve(_this.message);
                });
            });
        }
        else if (response.json) {
            this.headers['Content-Type'] = 'application/json';
            this.message = JSON.stringify(response.json);
        }
        else {
            this.code = 204;
            this.message = null;
        }
    }
    HTTPResponse.prototype.toString = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lines, message;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lines = [];
                        lines.push("HTTP/1.1 " + this.code + " " + response_types_1.default[this.code]);
                        Object.keys(this.headers).forEach(function (k) {
                            lines.push(k + ": " + _this.headers[k]);
                        });
                        lines.push('');
                        if (!this._io) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._io];
                    case 1:
                        message = _a.sent();
                        lines.push(message);
                        return [3 /*break*/, 3];
                    case 2:
                        if (this.message) {
                            lines.push(this.message);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, lines.join('\r\n')];
                }
            });
        });
    };
    return HTTPResponse;
}());
exports.default = HTTPResponse;
