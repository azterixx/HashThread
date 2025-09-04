import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Client as MinioClient } from 'minio';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);

  private readonly bucketName = process.env.MINIO_BUCKET ?? 'my-bucket';
  private readonly publicUrl = `https://${process.env.PUBLIC_DOMAIN}`;
  private readonly minioClient = new MinioClient({
    endPoint: process.env.MINIO_ENDPOINT ?? 'minio',
    port: Number(process.env.MINIO_PORT ?? 9000),
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER ?? 'minio',
    secretKey: process.env.MINIO_ROOT_PASSWORD ?? 'minio123',
  });

  constructor() {
    this.ensureBucketExists()
      .then(() => this.logger.log(`MinioService initialized`))
      .catch((err) => {
        this.logger.error('Failed to initialize MinIO:', err);
        throw err;
      });
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<string> {

    try {
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file,
        file.length,
        { 'Content-Type': mimeType },
      );
    } catch (err) {
      this.logger.error('Error uploading to MinIO:', err);
      throw new InternalServerErrorException('Failed to upload file');
    }


    return `${this.publicUrl}/${this.bucketName}/${fileName}`;
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, '');
        this.logger.log(`Bucket "${this.bucketName}" created`);
      } else {
        this.logger.log(`Bucket "${this.bucketName}" already exists`);
      }
    } catch (err: any) {
      if (err?.code === 'BucketAlreadyOwnedByYou' || err?.code === 'BucketAlreadyExists') {
        this.logger.warn(`Bucket "${this.bucketName}" already exists (race)`);
        return;
      }
      this.logger.error('MinIO bucket init failed', err);
      throw err;
    }
  }

}
