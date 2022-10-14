import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import campaignModel from "../../models/campaign";
import userModel from "../../models/user";
import { createCampaignValidation } from "../../util/validation/campaignValidation";

class CampaignController {
  createCampaign = async (req: any, res: Response, next: NextFunction) => {
    try {
      const {
        campaignName,
        isOn,
        startDate,
        endDate,
        clicks,
        budget,
        location,
        platform,
        createdOn,
      } = req.body;
      const [value, error] = createCampaignValidation({
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
      const createdBy: string = req.decodedToken.email;
      const user = await userModel.findOne({
        email: createdBy,
      });
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).send("unauthorized");
      }

      const campaign = new campaignModel({
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
    } catch (error) {
      return res.status(422).send(error);
    }
  };

  getCampaign = async (req: any, res: Response, next: NextFunction) => {
    try {
      const emailId: string = req.decodedToken.email;

      const user = await userModel.find({ email: emailId });
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).send();
      }

      console.log("query", req.query);
      const { platform, tags, day } = req.query;

      let d = new Date();
      let dated = d.getTime() - 30 * 24 * 60 * 60 * 1000;

      if (day !== "All") {
        dated = d.getTime() - parseInt(day) * 24 * 60 * 60 * 1000;
        console.log("dated", new Date(dated));
      }

      //same for apiRequest
      let campaigns = await campaignModel
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
    } catch (error) {
      return res.status(422).send(error);
    }
  };
}

export default CampaignController;
