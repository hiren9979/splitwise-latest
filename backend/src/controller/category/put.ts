import { Response } from "express";
import { CustomRequest } from "../../model/customRequest";
import { sendResponse } from "../../common/common";
import { updateCategoryDB } from "../../db/category";

export default async function updateCategory(request: CustomRequest, response: Response) {
  try {
    const data = {
      id: request.body.id,
      name: request.body.name
    };

    const info = await updateCategoryDB(data);
    return sendResponse(request, response, info.statusCode, info.clientMessage);
  } catch (e: any) {
    return sendResponse(request, response, 400, { Message: e.message });
  }
} 