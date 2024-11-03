const RESPONSES = {
    success: {
      statusCode: 200,
      message: "success",
      clientMessage: { Message: "success" },
    },
    created: {
      statusCode: 201,
      message: "created",
      clientMessage: { Message: "created" },
    },
    badRequest: {
      statusCode: 400,
      message: "bad request",
      clientMessage: { Message: "bad request" },
    },
    unauthorized: {
      statusCode: 401,
      message: "unauthorized",
      clientMessage: { Message: "unauthorized" },
    },
    paymentRequired: {
      statusCode: 402,
      message: "payment required",
      clientMessage: { Message: "payment required" },
    },
    notFound: {
      statusCode: 404,
      message: "not found",
      clientMessage: { Message: "not found" },
    },
    serverTimeout: {
      statusCode: 408,
      message: "server timeout",
      clientMessage: { Message: "server timeout" },
    },
    requestEntryLarge: {
      statusCode: 413,
      message: "request entry to large",
      clientMessage: { Message: "request entry to large" },
    },
    requestURLToLong: {
      statusCode: 414,
      message: "request-URL too long",
      clientMessage: { Message: "request-URL too long" },
    },
    unsupportedMedia: {
      statusCode: 415,
      message: "unsupported media type",
      clientMessage: { Message: "unsupported media type" },
    },
    expectationFailed: {
      statusCode: 417,
      message: "expectation failed",
      clientMessage: { Message: "expectation failed" },
    },
    serverError: {
      statusCode: 500,
      message: "internal server error",
      clientMessage: { Message: "internal server error" },
    },
    unavailable: {
      statusCode: 503,
      message: "service unavailable",
      clientMessage: { Message: "service unavailable" },
    },
    validEmail: {
      statusCode: 400,
      message: "bad request",
      clientMessage: { Message: "Please enter valid email" },
    },
    validUserName: {
      statusCode: 400,
      message: "bad request",
      clientMessage: { Message: "Please enter valid UserName" },
    },
    validPassword: {
      statusCode: 400,
      message: "bad request",
      clientMessage: { Message: "Please enter valid password" },
    },
    tryAgain: {
      statusCode: 400,
      message: "bad request",
      clientMessage: { Message: "Something went wrong, Please try again later" },
    },
  };
  
  export default RESPONSES;
  