import { S3Client, GetObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET || !process.env.AWS_REGION) {
    throw new Error("Missing AWS credentials");
}

export const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});

export async function getPresignedUrl(key: string) {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 * 24 * 7 });
    return presignedUrl;
}

export async function purgeBucket(keys: string[]) {
    const command = new DeleteObjectsCommand({
        Bucket: process.env.AWS_BUCKET,
        Delete: {
            Objects: keys.map((key) => ({ Key: key })),
        },
    });

    try {
        await s3Client.send(command);
    } catch (err) {
        console.error(err);
        throw new Error("Failed to purge bucket");
    }
}