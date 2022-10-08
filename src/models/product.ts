import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: { type: String, required: true },
  price: {
    type: Number,
    required: true,
  },
});

const productModel = mongoose.model("Product", productSchema);
export default productModel;
