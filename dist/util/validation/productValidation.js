"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const createProductSchema = joi_1.default.object()
    .options({ abortEarly: false })
    .keys({
    productName: joi_1.default.string().required(),
    price: joi_1.default.number().min(0).required(),
})
    .unknown();
const createProductValidation = ({ productName, price, }) => {
    const { value, error } = createProductSchema.validate({ productName, price });
    if (error) {
        return [null, error.message];
    }
    else {
        return [value, error];
    }
};
exports.createProductValidation = createProductValidation;
