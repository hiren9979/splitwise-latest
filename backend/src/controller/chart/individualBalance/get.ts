import { Response } from "express";
import { CustomRequest } from "../../../model/customRequest";
import { sendResponse } from "../../../common/common";
import { getExpenseByCategoryDB, getIndividualBalanceDB } from "../../../db/chart";

export default async function getIndividualBalanceChart(request: CustomRequest, response: Response) {
  try {
    const id = request.user.userId;
    const info = await getIndividualBalanceDB(id);
    return sendResponse(request, response, 200, info);
  } catch (e: any) {
    return sendResponse(request, response, 400, { Message: e.message });
  }
} 