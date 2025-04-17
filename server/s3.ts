import {Client} from 'minio'

if (!process.env.S3_ENDPOINT || !process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) {
    throw new Error('Missing S3 environment variables')
}

const s3Client = new Client({
    endPoint: process.env.S3_ENDPOINT,
    useSSL: true, // R2 always uses SSL
    accessKey: process.env.S3_ACCESS_KEY,  
    secretKey: process.env.S3_SECRET_KEY,
    region: 'auto' // R2 uses 'auto' as the region
})

// Ensure bucket exists
const ensureBucketExists = async () => {
    const bucketName = process.env.S3_BUCKET_NAME
    if (!bucketName) {
        throw new Error('Missing S3 bucket name')
    }

    try {
        const exists = await s3Client.bucketExists(bucketName)
        if (!exists) {
            await s3Client.makeBucket(bucketName, 'auto')
        }
    } catch (error) {
        console.error('Error checking/creating bucket:', error)
        throw error
    }
}

// Initialize bucket check
ensureBucketExists().catch(console.error)

export default s3Client