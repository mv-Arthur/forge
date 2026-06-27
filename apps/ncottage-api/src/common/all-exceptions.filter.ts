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
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
};

function statusText(status: number): string {
    return STATUS_TEXT[status] ?? "Error";
}

// Единый формат ответа об ошибке для всего API: { statusCode, error, message }.
// Сводит вместе class-validator, zod-ошибки сервисов, ошибки Prisma и
// необработанные исключения к одной форме (message — строка или массив строк).
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
            return this.fromPrisma(exception);
        }

        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: statusText(500),
            message: "Internal server error",
        };
    }

    private fromPrisma(
        error: Prisma.PrismaClientKnownRequestError
    ): ErrorEnvelope {
        switch (error.code) {
            case "P2002": {
                const target = error.meta?.target;
                const fields = Array.isArray(target)
                    ? ` (${target.join(", ")})`
                    : "";
                return {
                    statusCode: HttpStatus.CONFLICT,
                    error: statusText(409),
                    message: `Запись с таким значением уже существует${fields}`,
                };
            }
            case "P2025":
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    error: statusText(404),
                    message: "Запись не найдена",
                };
            case "P2003":
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    error: statusText(400),
                    message: "Нарушение ссылочной целостности",
                };
            default:
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    error: statusText(400),
                    message: "Ошибка базы данных",
                };
        }
    }
}
