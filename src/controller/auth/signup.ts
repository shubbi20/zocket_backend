import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import httpError from "../../util/functions/httpError.js";
import userModel from "../../models/user";
import authModel from "../../models/auth";
import { signupValidation } from "../../util/validation/authValidation";

const JWT_KEY: any = process.env.JWT_KEY;

const saltRounds = 12;

const signup = async (req: any, res: any) => {
  try {
    const {
      name,
      email,
      password,
    }: { name: string; email: string; password: string } = req.body;

    const [value, error] = signupValidation({ name, email, password });

    if (error) {
      return res.status(401).send(error);
    }

    const existingUser = await authModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .send(httpError("You have already Registered with us"));
    }
    let userEmail: string = email.toLowerCase().trim();
    let userName: string = name.toLowerCase().trim();

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createdAuth = new authModel({
      email: userEmail,
      password: hashedPassword,
    });

    const createdUser = new userModel({
      name: userName,
      email: userEmail,
    });

    const authSaved = await createdAuth.save();
    const userSaved = await createdUser.save();

    const token = jwt.sign(
      {
        email: createdUser.email,
      },
      JWT_KEY,
      { expiresIn: "24h" }
    );

    res.send({
      email: createdUser.email,
      name: createdUser.name,
      token: token,
    });
  } catch (error) {
    return res.status(422).send(error);
  }
};

export default signup;
