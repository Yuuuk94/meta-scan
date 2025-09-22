export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
  static badRequest(msg: string) {
    return new ApiError(400, msg);
  }
  static notFound(msg = "Not Found") {
    return new ApiError(404, msg);
  }
  static internal(msg = "Internal Server Error") {
    return new ApiError(500, msg);
  }
}
