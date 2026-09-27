import {
    type ArgumentsHost,
    Catch,
    type ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { FastifyReply } from "fastify";

interface ErrorEnvelope {
    statusCode: number;
    error: string;
    message: string | string[];
}

const STATUS_TEXT: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    500: "Internal Server Error",
};

function statusText(status: number): string {
    return STATUS_TEXT[status] ?? "Error";
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const reply = host.switchToHttp().getResponse<FastifyReply>();
        const envelope = this.toEnvelope(exception);
        if (envelope.statusCode >= 500) {
            this.logger.error(
                exception instanceof Error ? exception.stack : String(exception)
            );
        }
        void reply.status(envelope.statusCode).send(envelope);
    }

    private toEnvelope(exception: unknown): ErrorEnvelope {
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const body = exception.getResponse();
            let message: string | string[];
            if (typeof body === "string") {
                message = body;
            } else {
                const record = body as { message?: unknown };
                message =
                    Array.isArray(record.message) ||
                    typeof record.message === "string"
                        ? (record.message as string | string[])
                        : exception.message;
            }
            return { statusCode: status, error: statusText(status), message };
        }

        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            if (exception.code === "P2002") {
                return {
                    statusCode: HttpStatus.CONFLICT,
                    error: statusText(409),
                    message: "Запись с таким значением уже есть",
                };
            }
            if (exception.code === "P2025") {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    error: statusText(404),
                    message: "Запись не найдена",
                };
            }
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                error: statusText(400),
                message: "Ошибка базы данных",
            };
        }

        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: statusText(500),
            message: "Internal server error",
        };
    }
}
