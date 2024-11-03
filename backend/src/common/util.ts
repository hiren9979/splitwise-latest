import { v4 as uuidv4 } from "uuid";
export function sanitizeString(data: any): string | null {
    if (data === undefined) {
      return null;
    }
    if (data === null) {
      return null;
    }
    if (typeof data !== "string") {
      return null;
    }
    if (data.trim() === "") {
      return null;
    }
    if (data.trim().toLocaleLowerCase() === "null") {
      return null;
    }
    if (data.trim() === "undefined") {
      return null;
    }
    return data.trim();
  }

  export function generateV4uuid() {
    return uuidv4();
  }