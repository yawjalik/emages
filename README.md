# EMages 🧙‍♂️🌌

A web application/service for uploading, validating, storing, and searching PNG images by description. This app primarily runs on NextJS with MongoDB and ElasticSearch.

## Preview
<img width="1437" alt="image" src="https://user-images.githubusercontent.com/70761798/231952007-30685298-4858-4505-8a09-c9fe7c569dc4.png">
<img width="1416" alt="image" src="https://user-images.githubusercontent.com/70761798/231952253-086973c1-f9ba-45cd-86c8-68f10255758a.png">


## Setup

### Prerequisites

You will need to have the following tools installed and configured

1. Docker for running ElasticSearch locally (skip if you have a cloud instance)
2. A MongoDB Atlas cluster
3. An AWS account with an S3 bucket

### Install dependencies

```bash
npm i
```

or

```bash
yarn
```

### Environment Variables

Use the `sample.env` template and fill in the required env variables. You may omit the elastic credentials by passing empty strings

### Database

Head to the `prisma` directory. Create a `.env` file and add your MongoDB cluster url.

Generate the prisma client

```bash
yarn prisma generate
```

Push the prisma schema to your MongoDB cluster

```bash
yarn prisma db push
```

### Configure ElasticSearch

Ideally, you should have a separate ElasticSearch cluster on the cloud and use connectors to sync with your MongoDB cluster, possibly with Kibana for better visualization. For simplicity, will use the `docker-compose.yml` file to spin up a local ElasticSearch cluster.

```bash
cd elastic && docker-compose up -d
```

You can interact with ElasticSearch locally on port `9200`

### Run the app

```bash
yarn dev
```

---

Tools used:

1. NextJS
2. Chakra UI
3. MongoDB
4. ElasticSearch
5. Prisma Client
6. Docker
7. AWS SDK
