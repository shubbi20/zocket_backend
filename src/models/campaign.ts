import mongoose, { Schema } from "mongoose";

const campaignSchema = new Schema({
  campaignName: { type: String, required: true },
  isOn: { type: Boolean, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  clicks: { type: Number, required: true },
  budget: { type: Number, required: true },
  location: { type: String, required: true },
  platform: { type: String, required: true },
  createdOn: { type: Date, required: true },
  createdBy: { type: String, required: true },
});

const campaignModel = mongoose.model("Campaign", campaignSchema);
export default campaignModel;
