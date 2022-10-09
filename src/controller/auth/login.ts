import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import httpError from "../../util/functions/httpError";
import authModel from "../../models/auth.js";
import { loginValidation } from "../../util/validation/authValidation.js";
import userModel from "../../models/user";

const JWT_KEY: any = process.env.JWT_KEY;

const login = async (req: any, res: any) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const [value, error] = loginValidation({ email, password });

    if (error) {
      return res.status(409).send(error);
    }

    const userEmail: string = email.toLowerCase().trim();
    const existingUser = await authModel.findOne({
      email: userEmail,
    });

    if (!existingUser) {
      return res.status(404).send(httpError("User is not registered"));
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(401).send(httpError("invalid credentials"));
    }

    const token = jwt.sign(
      {
        email: existingUser.email,
      },
      JWT_KEY,
      { expiresIn: "24h" }
    );

    const user = await userModel.findOne({
      email: existingUser.email,
    });
    if (!user) {
      return res.status(404).send(httpError("User is not registered"));
    }

    res.send({
      email: existingUser.email,
      name: user.name,
      token: token,
    });
  } catch (error) {
    return res.status(422).send(error);
  }
};

export default login;
