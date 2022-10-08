import { Router } from "express";
import ProductController from "../controller/product/product";
const router = Router();
import tokenValidator from "../middleware/decodeToken";

const product = new ProductController();
router.post("/product", tokenValidator, product.createProduct);
router.get("/product", tokenValidator, product.getProducts);
export default router;
