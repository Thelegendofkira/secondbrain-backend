"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const auth = async (req, res, next) => {
    const header = req.headers["token"];
    if (!header)
        return res.json('Not Authorized');
    const decode = jsonwebtoken_1.default.verify(header, config_1.jwt_secret);
    if (decode) {
        if (typeof decode == 'string') {
            return res.json({
                "message": "not logged in"
            });
        }
        req.userid = decode.id;
        next();
    }
    else {
        res.json("not logged in");
    }
};
exports.auth = auth;
//# sourceMappingURL=middleware.js.map