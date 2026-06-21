import { Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    CreateBucketCommand,
    DeleteObjectCommand,
    HeadBucketCommand,
    PutBucketPolicyCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";

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

@Injectable()
export class StorageService implements OnModuleInit {
    private readonly logger = new Logger(StorageService.name);
    private readonly client: S3Client;
    private readonly bucket: string;
    private readonly publicUrl: string;
    private readonly forcePathStyle: boolean;

    constructor(config: ConfigService) {
        const endpoint = config.getOrThrow<string>("S3_ENDPOINT");
        this.bucket = config.getOrThrow<string>("S3_BUCKET");
        this.forcePathStyle =
            config.get<string>("S3_FORCE_PATH_STYLE") !== "false";
        this.publicUrl = (
            config.get<string>("S3_PUBLIC_URL") ?? endpoint
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

    // Гарантируем наличие bucket с публичным чтением (www отдаёт картинки по url).
    // Не валим старт, если хранилище недоступно — загрузка упадёт явно позже.
    async onModuleInit(): Promise<void> {
        try {
            await this.client.send(
                new HeadBucketCommand({ Bucket: this.bucket })
            );
        } catch {
            try {
                await this.client.send(
                    new CreateBucketCommand({ Bucket: this.bucket })
                );
                await this.client.send(
                    new PutBucketPolicyCommand({
                        Bucket: this.bucket,
                        Policy: publicReadPolicy(this.bucket),
                    })
                );
                this.logger.log(`Created media bucket "${this.bucket}"`);
            } catch (error) {
                this.logger.warn(
                    `Media bucket init failed: ${errMessage(error)}`
                );
            }
        }
    }

    async put(key: string, body: Buffer, contentType: string): Promise<string> {
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: body,
                ContentType: contentType,
            })
        );
        return this.urlFor(key);
    }

    async remove(key: string): Promise<void> {
        await this.client.send(
            new DeleteObjectCommand({ Bucket: this.bucket, Key: key })
        );
    }

    urlFor(key: string): string {
        return this.forcePathStyle
            ? `${this.publicUrl}/${this.bucket}/${key}`
            : `${this.publicUrl}/${key}`;
    }
}
