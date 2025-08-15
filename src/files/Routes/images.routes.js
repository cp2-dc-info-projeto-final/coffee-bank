import express from "express";
var router = express.Router();
import ImageController from "../Controller/ImageController.js"

router.post('/',ImageController.Create);
router.put('/',ImageController.Read);
router.delete('/',ImageController.Delete);

export default router;;