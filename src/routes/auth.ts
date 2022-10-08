import { Router } from "express";
import signup from "../controller/auth/signup";
import login from "../controller/auth/login";
const router = Router();

router.post("/signup", signup);

router.post("/login", login);

export default router;
