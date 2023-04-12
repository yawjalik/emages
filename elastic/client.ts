import { Client } from '@elastic/elasticsearch';

if (!process.env.ELASTIC_USERNAME || !process.env.ELASTIC_PASSWORD || !process.env.ELASTIC_URL) {
    throw new Error("Missing Elastic environment variables");
} 

const elasticClient = new Client({
    node: process.env.ELASTIC_URL,
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
    }
});

// Initialize images index
const initIndex = async () => {
    try {
        const exists = await elasticClient.indices.exists({ index: 'images' });
        if (!exists) {
            const res = await elasticClient.indices.create({ index: 'images' });
            console.log(`Created index ${res.index}`);
        }
    } catch (err) {
        console.error("Failed to create index");
        console.error(err);
        throw err;
    }
}
initIndex();

export default elasticClient;