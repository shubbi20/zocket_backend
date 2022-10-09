"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const campaign_1 = __importDefault(require("../../models/campaign"));
const user_1 = __importDefault(require("../../models/user"));
const campaignValidation_1 = require("../../util/validation/campaignValidation");
class CampaignController {
    constructor() {
        this.createCampaign = async (req, res, next) => {
            try {
                const { campaignName, isOn, startDate, endDate, clicks, budget, location, platform, createdOn, } = req.body;
                const [value, error] = (0, campaignValidation_1.createCampaignValidation)({
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
                    return res.status(401).send(error);
                }
                const createdBy = req.decodedToken.email;
                const user = await user_1.default.findOne({
                    email: createdBy,
                });
                if (!user) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send("unauthorized");
                }
                const campaign = new campaign_1.default({
                    campaignName,
                    isOn,
                    startDate,
                    endDate,
                    clicks,
                    budget,
                    location,
                    platform,
                    createdOn,
                    createdBy,
                });
                const campaignSave = await campaign.save();
                res.status(201).send({
                    id: campaignSave.id,
                    msg: "created Successfully",
                });
            }
            catch (error) {
                return res.status(422).send(error);
            }
        };
        this.getCampaign = async (req, res, next) => {
            try {
                const emailId = req.decodedToken.email;
                const user = await user_1.default.find({ email: emailId });
                if (!user) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send();
                }
                console.log("query", req.query);
                const { platform, tags, day } = req.query;
                let d = new Date();
                let dated = d.getTime() - 30 * 24 * 60 * 60 * 1000;
                if (day !== "All") {
                    dated = d.getTime() - parseInt(day) * 24 * 60 * 60 * 1000;
                    console.log("dated", new Date(dated));
                }
                let campaigns = await campaign_1.default
                    .aggregate()
                    .match({
                    $expr: {
                        $eq: ["$createdBy", emailId],
                    },
                })
                    .addFields({
                    tagValue: {
                        $cond: {
                            if: { $lt: [d, "$startDate"] },
                            then: {
                                $cond: {
                                    if: { $eq: ["$isOn", true] },
                                    then: "Pending",
                                    else: "Pending",
                                },
                            },
                            else: {
                                $cond: {
                                    if: { $gte: [d, "$endDate"] },
                                    then: "Exhausted",
                                    else: {
                                        $cond: {
                                            if: { $eq: ["$isOn", false] },
                                            then: "Paused",
                                            else: "Live-Now",
                                        },
                                    },
                                },
                            },
                        },
                    },
                })
                    .match({
                    $expr: {
                        $cond: {
                            if: { $ne: [platform, null] },
                            then: { $eq: ["$platform", platform] },
                            else: { $eq: ["$createdBy", emailId] },
                        },
                    },
                })
                    .match({
                    $expr: {
                        $cond: {
                            if: { $ne: [tags, null] },
                            then: { $eq: ["$tagValue", tags] },
                            else: { $eq: ["$createdBy", emailId] },
                        },
                    },
                })
                    .addFields({
                    datecomp: {
                        $cond: {
                            if: { $ne: [day, "All"] },
                            then: { $cmp: ["$createdOn", new Date(dated)] },
                            else: 1,
                        },
                    },
                })
                    .match({
                    $expr: {
                        $eq: ["$datecomp", 1],
                    },
                });
                if (!campaigns) {
                    return res.status(400).send("error");
                }
                res.status(200).send({
                    msg: "Successfully",
                    Data: campaigns,
                });
            }
            catch (error) {
                return res.status(422).send(error);
            }
        };
    }
}
exports.default = CampaignController;
