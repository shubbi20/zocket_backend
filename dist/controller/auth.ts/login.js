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
const JWT_KEY = process.env.JWT_KEY;
const login = async (req, res) => {
    try {
        // extract inputs
        const { email, password } = req.body;
        // check for user exists
        const existingUser = await auth_js_1.default.findOne({ email });
        // user does not exists
        if (!existingUser) {
            return res.status(404).send((0, httpError_1.default)("Login failed"));
        }
        const isValidPassword = await bcryptjs_1.default
            .compare(password, existingUser.password)
            .catch(() => {
            throw (0, httpError_1.default)("Validation failed");
        });
        // invalid password
        if (!isValidPassword) {
            return res.status(401).send((0, httpError_1.default)("invalid credentials"));
            //   throw httpError("invalid credentials");
        }
        // generate token
        const token = jsonwebtoken_1.default.sign({
            email: existingUser.email,
        }, JWT_KEY, { expiresIn: "3h" });
        // send response
        res.send({
            email: existingUser.email,
            token: token,
        });
    }
    catch (err) {
        console.log(err);
        if (err.error) {
            return res.status(422).send(err);
        }
        res.status(422).send((0, httpError_1.default)("Login failed"));
    }
};
exports.default = login;
