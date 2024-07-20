import { HttpException, HttpStatus } from "@nestjs/common";

export class BussException extends HttpException {

    constructor(message: string) {
        super(message, HttpStatus.OK);
    }

    getErrorCode() {
        return HttpStatus.INTERNAL_SERVER_ERROR
    }
} 