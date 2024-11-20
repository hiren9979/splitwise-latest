import { execute } from "../common/common";
import RESPONSES from "../common/response";
import { generateV4uuid } from "../common/util";

export async function addCategoryDB(data: any): Promise<any> {
  try {
    const query = `INSERT INTO category (id, name, createdAt, isDeleted) VALUES (?, ?, ?, ?);`;
    const result = await execute(query, [
      generateV4uuid(),
      data.name,
      Date.now(),
      false
    ]);
    
    if (result.affectedRows > 0) {
      return RESPONSES.success;
    }
    return RESPONSES.badRequest;
  } catch (error) {
    console.error("Error in addCategoryDB:", error);
    return RESPONSES.tryAgain;
  }
}

export async function getCategoriesDB(): Promise<any> {
  try {
    const query = `SELECT * FROM category WHERE isDeleted = false ORDER BY createdAt DESC;`;
    const result = await execute(query, []);
    return result;
  } catch (error) {
    console.error("Error in getCategoriesDB:", error);
    return [];
  }
}

export async function updateCategoryDB(data: any): Promise<any> {
  try {
    const query = `UPDATE category SET name = ? WHERE id = ? AND isDeleted = false;`;
    const result = await execute(query, [
      data.name,
      data.id
    ]);
    
    if (result.affectedRows > 0) {
      return RESPONSES.success;
    }
    return RESPONSES.badRequest;
  } catch (error) {
    console.error("Error in updateCategoryDB:", error);
    return RESPONSES.tryAgain;
  }
}

export async function deleteCategoryDB(id: string): Promise<any> {
  try {
    const query = `UPDATE category SET isDeleted = true WHERE id = ? AND isDeleted = false;`;
    const result = await execute(query, [id]);
    
    if (result.affectedRows > 0) {
      return RESPONSES.success;
    }
    return RESPONSES.badRequest;
  } catch (error) {
    console.error("Error in deleteCategoryDB:", error);
    return RESPONSES.tryAgain;
  }
} 