import { execute } from "../common/common";
import RESPONSES from "../common/response";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export async function getUsersDB(userId: string): Promise<any[]> {
  try {
    let query = `SELECT * FROM users WHERE id <> ?;`;
    let result = await execute(query, [userId]);
    return result;
  } catch (e) {
    return [];
  }
}

export async function updateAuthtoken(data: any) {
  try {
    const query = `UPDATE users SET authToken = ? WHERE id = ?;`;
    const result = await execute(query, [data.authToken, data.id]);
    if (result.affectedRows == 1) {
      return RESPONSES.success;
    } else {
      return RESPONSES.badRequest;
    }
  } catch (error) {
    return RESPONSES.tryAgain;
  }
}

export async function getUserByEmailDB(data: any): Promise<any> {
  try {
    let query = `SELECT * FROM users WHERE email = ?;`;
    let result = await execute(query, [data.email]);

    if (result !== null && result.length !== 0) {
      const user = result;
      const passwordMatch = await bcrypt.compare(
        data.password,
        user[0].password
      );

      if (passwordMatch) {
        const authToken = jwt.sign(
          { userId: user[0].id },
          process.env.PRIVATE_KEY!,
          { expiresIn: "24h" }
        );

        const authData: any = {
          authToken: authToken,
          id: user[0].id,
          name: user[0].name,
          email: user[0].email,
        };

        const info = await updateAuthtoken(authData);
        if (info.statusCode !== 200) {
          return RESPONSES.tryAgain;
        }

        return { authData };
      } else {
        return RESPONSES.tryAgain;
      }
    } else {
      return RESPONSES.badRequest;
    }
  } catch (e) {
    return [];
  }
}

export async function addUserDB(data: any) {
  try {
    let query = `INSERT INTO users (id,name, email, password, createdAt) VALUES (?, ?, ?, ?, ?);`;
    let result = await execute(query, [
      data.id,
      data.name,
      data.email,
      data.password,
      data.createdAt,
    ]);
    if (result.affectedRows === 0) {
      return RESPONSES.badRequest;
    }
    return RESPONSES.success;
  } catch (e) {
    return RESPONSES.tryAgain;
  }
}

export async function updateActualDB(data: any) {
  try {
    let query = `UPDATE actual SET wellnessId = ?, value = ?, date = ?, lastUpdatedBy = ?, updatedAt = ? WHERE id = ? AND workspaceId = ? AND isDeleted = false;`;
    let result = await execute(query, [
      data.wellnessId,
      data.value,
      data.lastUpdatedBy,
      data.updatedAt,
      data.id,
      data.workspaceId,
    ]);
    if (result.changedRows === 0 && result.affectedRows === 0) {
      return RESPONSES.badRequest;
    }
    return RESPONSES.success;
  } catch (e) {
    return RESPONSES.tryAgain;
  }
}

export async function deleteActualDB(data: any) {
  try {
    let query = `UPDATE actual SET isDeleted = ?, deletedBy = ?, deletedAt = ? WHERE id = ? AND workspaceId = ? AND isDeleted = false;`;
    let result = await execute(query, [
      data.isDeleted,
      data.deletedBy,
      data.deletedAt,
      data.id,
      data.workspaceId,
    ]);
    if (result.changedRows === 0 && result.affectedRows === 0) {
      return RESPONSES.badRequest;
    }
    return RESPONSES.success;
  } catch (e) {
    return RESPONSES.tryAgain;
  }
}
