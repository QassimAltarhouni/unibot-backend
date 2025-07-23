export class ErrorResponse extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ErrorSchema';
    this.statusCode = statusCode;

    // Set the prototype explicitly (needed for extending built-in classes in some environments)
    Object.setPrototypeOf(this, ErrorResponse.prototype);
  }
}
