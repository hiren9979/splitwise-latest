import { Response } from "express";

import { sanitizeString } from "../../common/util";
import { sendResponse } from "../../common/common";
import { getUserByEmailDB, getUsersDB } from "../../db/user";

export default async function getUsers(request: any, response: Response) {
  try {
    const info = await getUsersDB();
    return sendResponse(request, response, 200, info);
  } catch (e: any) {
    return sendResponse(request, response, 400, { Message: e.message });
  }
}
