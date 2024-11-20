import { Response } from "express";
import { CustomRequest } from "../../model/customRequest";
import { sendResponse } from "../../common/common";
import { deleteCategoryDB, getCategoriesDB } from "../../db/category";

export default async function deleteCategory(request: CustomRequest, response: Response) {
  try {
    const categoryId = request.headers.id as string;
    const categories = await deleteCategoryDB(categoryId);
    return sendResponse(request, response, 200, categories);
  } catch (e: any) {
    return sendResponse(request, response, 400, { Message: e.message });
  }
} 