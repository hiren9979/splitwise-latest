import { Response } from "express";

import { sanitizeString } from "../../common/util";
import { sendResponse } from "../../common/common";
import { getUserByEmailDB } from "../../db/user";

export default async function loginUser(request: any, response: Response) {
  try {
    const email = sanitizeString(request.headers.email) as string;
    const userData = {
      email: request.headers.email,
      password: request.headers.password,
    };
    const info = await getUserByEmailDB(userData);
    return sendResponse(request, response, 200, info);
  } catch (e: any) {
    return sendResponse(request, response, 400, { Message: e.message });
  }
}
