import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";

export class CommonException {
    static handle(error: Error): void {

        if (error instanceof NotFoundException) {
            throw new NotFoundException(error.message);
        } else if (error instanceof BadRequestException) {
            throw new BadRequestException(error.message);
        }else if (error instanceof ConflictException) {
            throw new ConflictException(error.message);
        }else {
            console.error('Error occurred:', error); // Ghi log lỗi cụ thể
            throw new InternalServerErrorException('An unexpected error occurred.');
        }
    }
}