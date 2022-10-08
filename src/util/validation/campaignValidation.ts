import Joi from "joi";
import { platform } from "os";

const createCampaignSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    campaignName: Joi.string().min(3).max(75),
    budget: Joi.number().min(0).required(),
    isOn: Joi.boolean().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    clicks: Joi.number().integer().min(0).required(),
    location: Joi.string().min(3).required(),
    platform: Joi.string().min(1).required(),
    createdOn: Joi.date().required(),
    // createdBy: Joi.string().min(7).max(24).required(),
  })
  .unknown();

export const createCampaignValidation = ({
  campaignName,
  isOn,
  startDate,
  endDate,
  clicks,
  budget,
  location,
  platform,
  createdOn,
}: {
  campaignName: string;
  isOn: boolean;
  startDate: Date;
  endDate: Date;
  clicks: Number;
  budget: Number;
  location: String;
  platform: String;
  createdOn: Date;
}) => {
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
  } else {
    return [value, error];
  }
};
