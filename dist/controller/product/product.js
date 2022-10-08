"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const product_1 = __importDefault(require("../../models/product"));
const user_1 = __importDefault(require("../../models/user"));
const productValidation_1 = require("../../util/validation/productValidation");
class ProductController {
    constructor() {
        this.createProduct = async (req, res, next) => {
            try {
                const { productName, price } = req.body;
                const [value, error] = (0, productValidation_1.createProductValidation)({ productName, price });
                if (error) {
                    return res.status(401).send(error);
                }
                const product = new product_1.default({
                    productName: productName,
                    price: price,
                });
                const productSave = await product.save();
                res.send({
                    id: productSave.id,
                    msg: "created Successfully",
                });
            }
            catch (error) {
                return res.status(422).send(error);
            }
        };
        this.getProducts = async (req, res, next) => {
            try {
                const emailId = req.decodedToken.email;
                const user = await user_1.default.find({ email: emailId });
                if (!user) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send();
                }
                const products = await product_1.default.find();
                if (!products) {
                    return res.status(400).send("error");
                }
                res.status(200).send({
                    msg: "Successfully",
                    Data: products,
                });
            }
            catch (error) {
                return res.status(422).send(error);
            }
        };
    }
}
exports.default = ProductController;
