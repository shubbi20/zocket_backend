"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const authSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 7,
        maxLength: 24,
    },
    password: { type: String, required: true, minLength: 5 },
});
const authModel = mongoose_1.default.model("Auth", authSchema);
exports.default = authModel;
