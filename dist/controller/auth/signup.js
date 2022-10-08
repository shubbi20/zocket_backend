"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpError_js_1 = __importDefault(require("../../util/functions/httpError.js"));
const user_1 = __importDefault(require("../../models/user"));
const auth_1 = __importDefault(require("../../models/auth"));
const authValidation_1 = require("../../util/validation/authValidation");
const JWT_KEY = process.env.JWT_KEY;
const saltRounds = 12;
const signup = async (req, res) => {
    try {
        const { name, email, password, } = req.body;
        const [value, error] = (0, authValidation_1.signupValidation)({ name, email, password });
        if (error) {
            return res.status(401).send(error);
        }
        const existingUser = await auth_1.default.findOne({ email });
        if (existingUser) {
            return res
                .status(409)
                .send((0, httpError_js_1.default)("You have already Registered with us"));
        }
        let userEmail = email.toLowerCase().trim();
        let userName = name.toLowerCase().trim();
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        const createdAuth = new auth_1.default({
            email: userEmail,
            password: hashedPassword,
        });
        const createdUser = new user_1.default({
            name: userName,
            email: userEmail,
        });
        const authSaved = await createdAuth.save();
        const userSaved = await createdUser.save();
        const token = jsonwebtoken_1.default.sign({
            email: createdUser.email,
        }, JWT_KEY, { expiresIn: "24h" });
        res.send({
            email: createdUser.email,
            name: createdUser.name,
            token: token,
        });
    }
    catch (error) {
        return res.status(422).send(error);
    }
};
exports.default = signup;
