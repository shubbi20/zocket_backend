"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = __importDefault(require("../controller/product/product"));
const router = (0, express_1.Router)();
const decodeToken_1 = __importDefault(require("../middleware/decodeToken"));
const product = new product_1.default();
router.post("/product", decodeToken_1.default, product.createProduct);
router.get("/product", decodeToken_1.default, product.getProducts);
exports.default = router;
