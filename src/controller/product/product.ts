import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import productModel from "../../models/product";
import userModel from "../../models/user";
import { createProductValidation } from "../../util/validation/productValidation";

class ProductController {
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productName, price } = req.body;

      const [value, error] = createProductValidation({ productName, price });
      if (error) {
        return res.status(401).send(error);
      }
      const product = new productModel({
        productName: productName,
        price: price,
      });

      const productSave = await product.save();
      res.send({
        id: productSave.id,
        msg: "created Successfully",
      });
    } catch (error) {
      return res.status(422).send(error);
    }
  };

  getProducts = async (req: any, res: Response, next: NextFunction) => {
    try {
      const emailId: string = req.decodedToken.email;

      const user = await userModel.find({ email: emailId });
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).send();
      }

      const products = await productModel.find();
      if (!products) {
        return res.status(400).send("error");
      }

      res.status(200).send({
        msg: "Successfully",
        Data: products,
      });
    } catch (error) {
      return res.status(422).send(error);
    }
  };
}

export default ProductController;
