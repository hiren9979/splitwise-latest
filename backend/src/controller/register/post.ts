import { Response } from "express";
import { sendResponse } from "../../common/common";
import { addUserDB } from "../../db/user";
import { generateV4uuid } from "../../common/util";
import bcrypt from "bcrypt";

export default async function registerUser(request: any, response: Response) {
  try {
    const hashedPassword: string = await bcrypt.hash(request.body.password, 10);
    const data = {
      id: generateV4uuid(),
      name: request.body.username,
      email: request.body.email,
      password: hashedPassword,
      createdAt: Date.now(),
    };

    const info = await addUserDB(data);
    return sendResponse(request, response, info.statusCode, info.clientMessage);
  } catch (e: any) {
    return sendResponse(request, response, 400, { Message: e.message });
  }
}
