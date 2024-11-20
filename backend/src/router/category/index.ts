import { Router } from "express";
import createCategory from "../../controller/category/post";
import getCategories from "../../controller/category/get";
import updateCategory from "../../controller/category/put";
import authMiddleware from "../../middleware/auth";
import deleteCategory from "../../controller/category/delete";

const router = Router();

router.post("", authMiddleware, createCategory);
router.get("", authMiddleware, getCategories);
router.put("", authMiddleware, updateCategory);
router.delete("", authMiddleware, deleteCategory);

export default router; 