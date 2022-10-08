"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaign_1 = __importDefault(require("../controller/campaign/campaign"));
const router = (0, express_1.Router)();
const decodeToken_1 = __importDefault(require("../middleware/decodeToken"));
const campaign = new campaign_1.default();
router.post("/campaign", decodeToken_1.default, campaign.createCampaign);
router.get("/campaign", decodeToken_1.default, campaign.getCampaign);
exports.default = router;
