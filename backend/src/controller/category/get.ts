import { Response } from "express";
import { CustomRequest } from "../../model/customRequest";
import { sendResponse } from "../../common/common";
import { addCategoryDB, getCategoriesDB } from "../../db/category";

export default async function getCategories(request: CustomRequest, response: Response) {
  try {

    const info = await getCategoriesDB();
    return sendResponse(request, response, 200, info);
  } catch (e: any) {
    return sendResponse(request, response, 400, { Message: e.message });
  }
} 