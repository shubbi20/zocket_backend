"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpError_1 = __importDefault(require("../../util/functions/httpError"));
const auth_js_1 = __importDefault(require("../../models/auth.js"));
const authValidation_js_1 = require("../../util/validation/authValidation.js");
const user_1 = __importDefault(require("../../models/user"));
const JWT_KEY = process.env.JWT_KEY;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [value, error] = (0, authValidation_js_1.loginValidation)({ email, password });
        if (error) {
            return res.status(409).send(error);
        }
        const userEmail = email.toLowerCase().trim();
        const existingUser = await auth_js_1.default.findOne({
            email: userEmail,
        });
        if (!existingUser) {
            return res.status(404).send((0, httpError_1.default)("User is not registered"));
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, existingUser.password);
        if (!isValidPassword) {
            return res.status(401).send((0, httpError_1.default)("invalid credentials"));
        }
        const token = jsonwebtoken_1.default.sign({
            email: existingUser.email,
        }, JWT_KEY, { expiresIn: "24h" });
        const user = await user_1.default.findOne({
            email: existingUser.email,
        });
        if (!user) {
            return res.status(404).send((0, httpError_1.default)("User is not registered"));
        }
        res.send({
            email: existingUser.email,
            name: user.name,
            token: token,
        });
    }
    catch (error) {
        return res.status(422).send(error);
    }
};
exports.default = login;
