import Joi from "joi";

const createProductSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    productName: Joi.string().required(),
    price: Joi.number().min(0).required(),
  })
  .unknown();

export const createProductValidation = ({
  productName,
  price,
}: {
  productName: string;
  price: number;
}) => {
  const { value, error } = createProductSchema.validate({ productName, price });
  if (error) {
    return [null, error.message];
  } else {
    return [value, error];
  }
};
