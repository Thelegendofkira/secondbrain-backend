"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.LinkModel = exports.ContentModel = exports.TagModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
mongoose_1.default.connect("mongodb+srv://mandadijaideep:s3I2jEqtIMkMQumA@second-brain.qcrx6we.mongodb.net/secondbrain");
const User = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const tagschema = new mongoose_1.Schema({
    title: {
        type: String, required: true, unique: true
    }
});
const enumobj = ['youtube', 'twitter'];
const contentSchema = new mongoose_1.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: enumobj, required: true },
    title: { type: String, required: true },
    tags: [{ type: String }],
    description: { type: String },
    userid: { type: mongoose_1.Types.ObjectId, ref: 'users', required: true }
});
const linkSchema = new mongoose_1.Schema({
    hash: {
        type: String, required: true, unique: true
    },
    userid: { type: mongoose_1.Types.ObjectId, ref: 'users', required: true, unique: true }
});
exports.TagModel = (0, mongoose_1.model)('tags', tagschema);
exports.ContentModel = (0, mongoose_1.model)('content', contentSchema);
exports.LinkModel = (0, mongoose_1.model)('links', linkSchema);
exports.UserModel = (0, mongoose_1.model)('users', User);
//# sourceMappingURL=db.js.map