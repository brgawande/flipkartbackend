import express from "express";
import {
  dleteProducts,
  getProduct,
  getallProducts,
  updateProduct,
  updateProductPic,
  uploadProducts,
  // updateproduct,
} from "../controllers/productControllers.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.route("/getallproducts").get(getallProducts);
router.route("/uploadproduct").post(singleUpload, uploadProducts);
router.route("/deleteproduct/:id").delete(dleteProducts);
// router.route("/updateproduct/:id").patch(updateproduct);
router.route("/getproduct/:id").get(getProduct);

router.route("/updateproductpic/:id").put(singleUpload, updateProductPic);

router.route("/updateproduct/:id").put(updateProduct);

export default router;
