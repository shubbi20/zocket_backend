"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCampaignValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const createCampaignSchema = joi_1.default.object()
    .options({ abortEarly: false })
    .keys({
    campaignName: joi_1.default.string().min(3).max(75),
    budget: joi_1.default.number().min(0).required(),
    isOn: joi_1.default.boolean().required(),
    startDate: joi_1.default.date().required(),
    endDate: joi_1.default.date().required(),
    clicks: joi_1.default.number().integer().min(0).required(),
    location: joi_1.default.string().min(3).required(),
    platform: joi_1.default.string().min(1).required(),
    createdOn: joi_1.default.date().required(),
})
    .unknown();
const createCampaignValidation = ({ campaignName, isOn, startDate, endDate, clicks, budget, location, platform, createdOn, }) => {
    const { value, error } = createCampaignSchema.validate({
        campaignName,
        isOn,
        startDate,
        endDate,
        clicks,
        budget,
        location,
        platform,
        createdOn,
    });
    if (error) {
        return [null, error.message];
    }
    else {
        return [value, error];
    }
};
exports.createCampaignValidation = createCampaignValidation;
