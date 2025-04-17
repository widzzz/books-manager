import { readMultipartFormData } from 'h3'
import s3Client from '../s3'
import { v4 as uuidv4 } from 'uuid'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

interface UploadError extends Error {
  statusCode?: number
}

const bucketName = process.env.S3_BUCKET_NAME

if (!bucketName) {
    throw new Error('Missing S3 bucket name')
}

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw createError({
        statusCode: 400,
        message: 'No file uploaded'
      })
    }

    const file = formData.find(item => item.type === 'image/jpeg' || item.type === 'image/png' || item.type === 'image/webp')
    if (!file) {
      throw createError({
        statusCode: 400,
        message: 'No valid image file found. Supported formats: JPEG, PNG, WebP'
      })
    }

    // Check file size
    if (file.data.length > MAX_FILE_SIZE) {
      throw createError({
        statusCode: 400,
        message: `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      })
    }

    // Generate a unique filename
    const fileExtension = file.filename?.split('.').pop() || 'jpg'
    const fileName = `${uuidv4()}.${fileExtension}`

    try {
      // Upload to S3
      await s3Client.putObject(
        bucketName,
        fileName,
        file.data
      )
    } catch (s3Error) {
      console.error('S3 upload error:', s3Error)
      throw createError({
        statusCode: 500,
        message: 'Failed to upload file to storage. Please try again later.'
      })
    }

    // Return the public URL of the uploaded file
    const fileUrl = `${process.env.S3_PUBLIC_ENDPOINT}/${fileName}`
    console.log('Generated file URL:', fileUrl)
    
    if (!process.env.S3_PUBLIC_ENDPOINT) {
      throw createError({
        statusCode: 500,
        message: 'S3_PUBLIC_ENDPOINT environment variable is not set'
      })
    }
    
    return {
      url: fileUrl
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    const uploadError = error as UploadError
    throw createError({
      statusCode: uploadError.statusCode || 500,
      message: uploadError.message || 'Failed to upload file'
    })
  }
}) 