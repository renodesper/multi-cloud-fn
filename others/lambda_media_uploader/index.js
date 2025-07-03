const AWS = require('aws-sdk')
const parser = require('lambda-multipart-parser')

const awsAccessKey = process.env.AWS_ACCESS_KEY
const awsSecretKey = process.env.AWS_SECRET_KEY
const awsEndpoint = process.env.AWS_ENDPOINT || 's3.ap-southeast-1.amazonaws.com'
const awsS3Bucket = process.env.AWS_S3_BUCKET

const allowedContentType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
const defaultUploadDirectory = 'uploads'
const limitFileSizeKB = 4096 // 4 MB

exports.handler = async (event) => {
  try {
    const endpoint = new AWS.Endpoint(awsEndpoint)
    const s3 = new AWS.S3({
      endpoint,
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretKey,
    })

    const request = await parser.parse(event)
    const file = request?.files?.[0]

    if (!file) {
      throw new Error('File is missing')
    }

    const contentType = file.contentType.toLowerCase()
    const isInvalidContentType = !allowedContentType.includes(contentType)
    const fileSizeKB = Math.floor(Buffer.byteLength(file.content) / 1024)

    if (isInvalidContentType) {
      throw new Error('Invalid content type')
    }

    if (fileSizeKB > limitFileSizeKB) {
      throw new Error('File is too big')
    }

    const userId = request?.user_id || ''
    const directory = request?.directory || ''
    const prefix = request?.prefix || ''

    const uploadDir = defaultUploadDirectory + (directory ? `/${directory}` : '')
    const fileExtension = file.filename?.split('.').pop() || 'jpg'
    const filename = `${userId ? `${userId}_` : ''}${
      prefix ? `${prefix}_` : ''
    }${getRandomNumber()}${getCurrentTimeStamp()}.${fileExtension}`
    const objectName = `${uploadDir}/${filename}`

    const isPublic = request?.is_public !== 'false'

    const uploadParams = {
      Bucket: awsS3Bucket,
      Key: objectName,
      Body: Buffer.from(file.content, 'binary'),
      ContentType: contentType,
      ACL: isPublic ? 'public-read' : 'private',
    }

    const result = await s3.upload(uploadParams).promise()

    return sendRes(200, {
      error: false,
      message: 'Image uploaded successfully',
      data: {
        name: objectName,
        url: result.Location,
      },
    })
  } catch (error) {
    return sendRes(500, {
      error: true,
      message: error.message || 'Something went wrong',
    })
  }
}

const getRandomNumber = (min = 100000, max = 999999) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const getCurrentTimeStamp = () => {
  return Date.now()
}

const sendRes = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
})
