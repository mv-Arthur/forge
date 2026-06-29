import { Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    CreateBucketCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    HeadBucketCommand,
    PutBucketPolicyCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function errMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function publicReadPolicy(bucket: string): string {
    return JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Principal: { AWS: ["*"] },
                Action: ["s3:GetObject"],
                Resource: [`arn:aws:s3:::${bucket}/*`],
            },
        ],
    });
}

// Картинки (кроме SVG) отдаём публично и inline; всё остальное (PDF и т.п.) —
// из приватного бакета по signed URL, как вложение.
function isPublicType(contentType: string): boolean {
    return (
        contentType.startsWith("image/") && contentType !== "image/svg+xml"
    );
}

const SIGNED_URL_TTL_SECONDS = 300;

@Injectable()
export class StorageService implements OnModuleInit {
    private readonly logger = new Logger(StorageService.name);
    private readonly client: S3Client;
    private readonly bucket: string;
    private readonly privateBucket: string;
    private readonly publicUrl: string;
    private readonly apiPublicUrl: string;
    private readonly forcePathStyle: boolean;

    constructor(config: ConfigService) {
        const endpoint = config.getOrThrow<string>("S3_ENDPOINT");
        this.bucket = config.getOrThrow<string>("S3_BUCKET");
        this.privateBucket =
            config.get<string>("S3_PRIVATE_BUCKET") ?? `${this.bucket}-private`;
        this.forcePathStyle =
            config.get<string>("S3_FORCE_PATH_STYLE") !== "false";
        this.publicUrl = (
            config.get<string>("S3_PUBLIC_URL") ?? endpoint
        ).replace(/\/$/, "");
        const port = config.get<string>("PORT") ?? "3002";
        this.apiPublicUrl = (
            config.get<string>("API_PUBLIC_URL") ?? `http://localhost:${port}`
        ).replace(/\/$/, "");
        this.client = new S3Client({
            endpoint,
            region: config.get<string>("S3_REGION") ?? "us-east-1",
            forcePathStyle: this.forcePathStyle,
            credentials: {
                accessKeyId: config.getOrThrow<string>("S3_ACCESS_KEY"),
                secretAccessKey: config.getOrThrow<string>("S3_SECRET_KEY"),
            },
        });
    }

    // Публичный бакет — с публичным чтением (www отдаёт картинки по url).
    // Приватный — без политики чтения: не-картинки доступны только по signed URL.
    // Не валим старт, если хранилище недоступно — загрузка упадёт явно позже.
    async onModuleInit(): Promise<void> {
        await this.ensureBucket(this.bucket, true);
        await this.ensureBucket(this.privateBucket, false);
    }

    private async ensureBucket(bucket: string, makePublic: boolean): Promise<void> {
        try {
            await this.client.send(new HeadBucketCommand({ Bucket: bucket }));
        } catch {
            try {
                await this.client.send(
                    new CreateBucketCommand({ Bucket: bucket })
                );
                if (makePublic) {
                    await this.client.send(
                        new PutBucketPolicyCommand({
                            Bucket: bucket,
                            Policy: publicReadPolicy(bucket),
                        })
                    );
                }
                this.logger.log(`Created media bucket "${bucket}"`);
            } catch (error) {
                this.logger.warn(
                    `Media bucket "${bucket}" init failed: ${errMessage(error)}`
                );
            }
        }
    }

    isPublicType(contentType: string): boolean {
        return isPublicType(contentType);
    }

    async put(key: string, body: Buffer, contentType: string): Promise<string> {
        if (isPublicType(contentType)) {
            await this.client.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: body,
                    ContentType: contentType,
                    ContentDisposition: "inline",
                })
            );
            return this.urlFor(key);
        }
        // Не-картинки — в приватный бакет; стабильная ссылка ведёт на /media/raw,
        // который при обращении выдаёт свежий signed URL (302).
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.privateBucket,
                Key: key,
                Body: body,
                ContentType: contentType,
                ContentDisposition: "attachment",
            })
        );
        return `${this.apiPublicUrl}/media/raw?key=${encodeURIComponent(key)}`;
    }

    async remove(key: string, contentType: string): Promise<void> {
        const bucket = isPublicType(contentType)
            ? this.bucket
            : this.privateBucket;
        await this.client.send(
            new DeleteObjectCommand({ Bucket: bucket, Key: key })
        );
    }

    // Временный (TTL) signed URL на скачивание приватного объекта как вложения.
    async signedDownloadUrl(
        key: string,
        filename: string,
        contentType: string
    ): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.privateBucket,
            Key: key,
            ResponseContentType: contentType,
            ResponseContentDisposition: `attachment; filename="${filename.replace(/"/g, "")}"`,
        });
        return getSignedUrl(this.client, command, {
            expiresIn: SIGNED_URL_TTL_SECONDS,
        });
    }

    urlFor(key: string): string {
        return this.forcePathStyle
            ? `${this.publicUrl}/${this.bucket}/${key}`
            : `${this.publicUrl}/${key}`;
    }
}
