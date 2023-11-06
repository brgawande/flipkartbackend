import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  // title,tags,category,price,subcategory
  title: {
    type: String,
    required: true,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
    validate: {
      validator: function (t) {
        const words = t.split(" ");
        return words.length >= 2;
      },
      message: "Add Minimum 2 Tags",
    },
  },
  category: {
    type: String,
    required: true,
  },
});

export const Product = mongoose.model("Product", productSchema);
