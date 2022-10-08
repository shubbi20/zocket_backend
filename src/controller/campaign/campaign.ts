import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import campaignModel from "../../models/campaign";
import userModel from "../../models/user";
import httpError from "../../util/functions/httpError";
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

      const campaigns = await campaignModel.find();
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
