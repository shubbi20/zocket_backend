import { Http2ServerResponse } from "http2";
import Joi from "joi";
import httpError from "../functions/httpError";

const signupSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string().trim().min(3).max(24).required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .trim()
      .min(7)
      .max(24)
      .required(),
    password: Joi.string().trim().min(5).max(24).required(),
  });

const loginSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .trim()
      .min(7)
      .max(24)
      .required(),
    password: Joi.string().trim().min(5).max(24).required(),
  });

export const signupValidation = ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  const { value, error } = signupSchema.validate({ email, password, name });
  if (error) {
    return [null, error.message];
  } else {
    return [value, error];
  }
};

export const loginValidation = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { value, error } = loginSchema.validate({ email, password });
  if (error) {
    return [null, error.message];
  } else {
    return [value, error];
  }
};
