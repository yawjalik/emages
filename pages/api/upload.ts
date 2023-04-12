import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { NextApiRequest, NextApiResponse } from "next";
import prismaClient from "../../prisma/client";
import elasticClient from "../../elastic/client";
import { CreateImageType } from "@/components/imageTypes";

export interface MongoImageBody {
    name: string;
    description: string;
    width: number;
    height: number;
}

export interface ESImageBody {
    id: string;
    name: string;
    description: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Method Not Allowed" });
        return;
    }
    if (!process.env.AWS_ACCESS_KEY) {
        res.status(500).json({ message: "Missing AWS_ACCESS_KEY" });
        return;
    }
    if (!process.env.AWS_SECRET_ACCESS_KEY) {
        res.status(500).json({ message: "Missing AWS_SECRET_ACCESS_KEY" });
        return;
    }
    if (!process.env.AWS_BUCKET) {
        res.status(500).json({ message: "Missing AWS_BUCKET" });
        return;
    }

    // Validate request body
    const images: CreateImageType[] = req.body;
    if (!images || !Array.isArray(images)) {
        res.status(400).json({ message: "Missing images" });
        return;
    }
    if (images.length > 5) {
        res.status(400).json({ message: "Max 5 images allowed" });
        return;
    }

    const s3 = new S3Client({
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        region: process.env.AWS_REGION,
    });

    // Create mongodb and elasticsearch document for each image
    try {        
        for (const { name, description, width, height } of images) {
            // Create mongodb document
            const data: MongoImageBody = {
                name,
                description,
                width,
                height
            }
            const { id } = await prismaClient.image.create({ data });
            
            // Create elasticsearch document with image id
            const body: ESImageBody = {
                id,
                name: name,
                description: description,
            }
            const result = await elasticClient.index({
                index: "images",
                body
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to create image" });
        return;
    }

    // Upload to S3
    try {
        for (const image of images) {
            const decodedImage = Buffer.from(image.uri.replace(/^data:image\/\w+;base64,/, ""), "base64");
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET,
                Key: image.name,
                Body: decodedImage,
            });
            await s3.send(command);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "S3 upload failed" });
    }

    res.status(201).json({ message: "OK" });
}