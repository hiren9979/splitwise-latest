import dbConn from "../db/db";

// executeQuery function
export async function execute(query: string, parameters: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    dbConn.query(query, parameters, (err: any, rows: any) => {
      if (err) {
        reject(err); // Reject on error
      } else {
        resolve(rows); // Resolve with rows on success
      }
    });
  });
}

export function sendResponse<T>(
  request: any,
  response: any,
  statusCode: number,
  message: any
) {
  sendJSONResponse<T>(request, response, statusCode, message);
}

function sendJSONResponse<T>(
  request: any,
  response: any,
  statusCode: number,
  message: T
) {
  response.statusCode = statusCode;
  response.json(message);
}
