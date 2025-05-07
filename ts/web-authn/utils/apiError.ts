class apiError extends Error {
    public statusCode: number;
    public data: null;
    public success: boolean;
    public errors: any[];
  
    constructor(
      statusCode: number,
      message: string = "Something went wrong",
      errors: any[] = [],
      stack: string = ""
    ) {
      super(message);
      this.statusCode = statusCode;
      this.data = null;
      this.success = false;
      this.errors = errors;
  
      if (stack) {
        this.stack = stack;
      } else {
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
      }
    }
  }
  
  export { apiError };
  