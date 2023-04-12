import { NextApiRequest, NextApiResponse } from "next";
import prismaClient from "../../prisma/client";
import elasticClient from "../../elastic/client";
import { purgeBucket } from "../../utils/s3util";

// Purge all images from mongodb, elasticsearch, and s3
// For development purposes only
export default async function purge(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") {
        res.status(405).json({ message: "Method Not Allowed" });
        return;
    }

    try {
        // Get all image names
        const names = await prismaClient.image.findMany({ select: { name: true } });

        // Delete all images from mongodb and elasticsearch
        await prismaClient.image.deleteMany();
        await elasticClient.indices.delete({ index: "images" });

        // Purge images from s3
        await purgeBucket(names.map((name) => name.name));

        res.status(200).json({ message: "Purged" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to purge" });
    }
} 