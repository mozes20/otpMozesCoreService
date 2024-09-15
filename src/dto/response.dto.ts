export class ResponseDto<T> {
  success: boolean;
  data: T | ErrorData;

  constructor(success: boolean, data: T | ErrorData) {
    this.success = success;
    this.data = data;
  }
}

export class ErrorData {
  message: string;
  event: string;
  code: number;

  constructor(message: string, event: string, code: number) {
    this.message = message;
    this.event = event;
    this.code = code;
  }
}
