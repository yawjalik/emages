import prismaClient from "@/prisma/client";
import elasticClient from "../../elastic/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getPresignedUrl } from "../../utils/s3util";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.status(405).json({ message: "Method Not Allowed" });
        return;
    }

    // Check if index exists, if not create it
    try {
        const indexExists = await elasticClient.indices.exists({ index: "images" });
        if (!indexExists) {
            await elasticClient.indices.create({ index: "images" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create index" });
        return;
    }

    const searchBody = req.query.q && typeof req.query.q === "string" ? {
        query: {
            match: {
                description: req.query.q,
            },
        },
    } : {};

    // Search for images by description
    let imageIds: string[] = [];
    try {
        const { hits } = await elasticClient.search({
            index: "images",
            body: searchBody
        });
        const matchingImages = hits.hits;
        if (!matchingImages || matchingImages.length === 0) {
            res.status(404).json({ message: "No images found" });
            return;
        }
        
        for (const image of matchingImages) {
            const { id } = image._source as { id: string };
            imageIds.push(id);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to perform search" });
        return;
    }
    
    // Get image data from mongodb based on id and add presigned url
    try {
        const images = await prismaClient.image.findMany({
            where: { id: { in: imageIds } }
        });
        const imageResponses = images.map((image) => ({
            id: image.id,
            name: image.name,
            description: image.description,
            url: "",
            width: image.width,
            height: image.height,
        }));
        for (let i = 0; i < imageResponses.length; i++) {
            imageResponses[i].url = await getPresignedUrl(imageResponses[i].name);
        }
        res.status(200).json(imageResponses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to query images" });
    }
}