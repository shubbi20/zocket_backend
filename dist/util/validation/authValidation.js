"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.signupValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const signupSchema = joi_1.default.object()
    .options({ abortEarly: false })
    .keys({
    name: joi_1.default.string().trim().min(3).max(24).required(),
    email: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .trim()
        .min(7)
        .max(24)
        .required(),
    password: joi_1.default.string().trim().min(5).max(24).required(),
});
const loginSchema = joi_1.default.object()
    .options({ abortEarly: false })
    .keys({
    email: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .trim()
        .min(7)
        .max(24)
        .required(),
    password: joi_1.default.string().trim().min(5).max(24).required(),
});
const signupValidation = ({ email, password, name, }) => {
    const { value, error } = signupSchema.validate({ email, password, name });
    if (error) {
        return [null, error.message];
    }
    else {
        return [value, error];
    }
};
exports.signupValidation = signupValidation;
const loginValidation = ({ email, password, }) => {
    const { value, error } = loginSchema.validate({ email, password });
    if (error) {
        return [null, error.message];
    }
    else {
        return [value, error];
    }
};
exports.loginValidation = loginValidation;
