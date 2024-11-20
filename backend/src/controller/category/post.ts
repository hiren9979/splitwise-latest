import { Response } from "express";
import { CustomRequest } from "../../model/customRequest";
import { sendResponse } from "../../common/common";
import { addCategoryDB } from "../../db/category";

export default async function createCategory(request: CustomRequest, response: Response) {
  try {
    const data = {
      name: request.body.name
    };

    const info = await addCategoryDB(data);
    return sendResponse(request, response, info.statusCode, info.clientMessage);
  } catch (e: any) {
    return sendResponse(request, response, 400, { Message: e.message });
  }
} 