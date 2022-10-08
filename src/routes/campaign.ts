import { Router } from "express";
import CampaignController from "../controller/campaign/campaign";

const router = Router();
import tokenValidator from "../middleware/decodeToken";

const campaign = new CampaignController();
router.post("/campaign", tokenValidator, campaign.createCampaign);
router.get("/campaign", tokenValidator, campaign.getCampaign);
export default router;
