import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Product } from "../models/productModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ApiFeatures from "../utils/apifeatures.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";

export const uploadProducts = catchAsyncError(async (req, res, next) => {
  const { title, price, description, tags, category } = req.body;

  if (!title || !price || !description || !tags || !category)
    return next(new ErrorHandler("Please Enter All The Fields", 404));

  const file = req.file;

  const fileUri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  await Product.create({
    title,
    price,
    description,
    tags,
    category,
    image: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "Product Uploaded Successfully",
  });
});

export const dleteProducts = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  await cloudinary.v2.uploader.destroy(product.image.public_id);

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

export const getallProducts = catchAsyncError(async (req, res, next) => {
  // isme hume query aur queryStr dena hai...Product.find() hum query denge...aur queryStr me keyword denge...to isse query ka jo keyword hai wo hume find karke de denga

  const resultPerPage = 10;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  // abb iska search feature banate hai utils me

  const products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    resultPerPage,
    productsCount,
  });
});

export const getProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  res.status(200).json({
    success: true,
    product,
  });
});

export const updateProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const { title, price, description, tags, category } = req.body;

  if (title) {
    product.title = title;
  }
  if (price) {
    product.price = price;
  }
  if (description) {
    product.description = description;
  }
  if (tags) {
    product.tags = tags;
  }
  if (category) {
    product.category = category;
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
});

export const updateProductPic = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product Not found", 404));

  const file = req.file;

  const fileUri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  await cloudinary.v2.uploader.destroy(product.image.public_id);

  product.image = {
    public_id: mycloud.public_id,
    url: mycloud.secure_url,
  };

  await product.save();

  res.status(200).json({
    success: true,
    message: "Profile Pic Updated Successfully",
  });
});
