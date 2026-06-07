import AWS from 'aws-sdk';

const STORAGE_SERVICE = process.env.STORAGE_SERVICE || 'AWS_S3';

let s3Client = null;

if (STORAGE_SERVICE === 'AWS_S3') {
  s3Client = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
  });
}

/**
 * Upload file to cloud storage
 * @param {Buffer} fileBuffer - File content
 * @param {String} fileName - Original file name
 * @param {String} mimeType - File MIME type
 * @returns {Promise<String>} URL to uploaded file
 */
export const uploadFile = async (fileBuffer, fileName, mimeType) => {
  if (STORAGE_SERVICE === 'AWS_S3') {
    return uploadToS3(fileBuffer, fileName, mimeType);
  } else if (STORAGE_SERVICE === 'ALIYUN_OSS') {
    return uploadToAliyunOSS(fileBuffer, fileName, mimeType);
  }

  throw new Error('Invalid storage service configured');
};

/**
 * Delete file from cloud storage
 * @param {String} fileUrl - URL of file to delete
 */
export const deleteFile = async (fileUrl) => {
  if (STORAGE_SERVICE === 'AWS_S3') {
    return deleteFromS3(fileUrl);
  } else if (STORAGE_SERVICE === 'ALIYUN_OSS') {
    return deleteFromAliyunOSS(fileUrl);
  }

  throw new Error('Invalid storage service configured');
};

// ============ AWS S3 Implementation ============

async function uploadToS3(fileBuffer, fileName, mimeType) {
  const timestamp = Date.now();
  const key = `assets/${timestamp}-${fileName}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: 'public-read'
  };

  try {
    const result = await s3Client.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload to S3: ' + error.message);
  }
}

async function deleteFromS3(fileUrl) {
  try {
    // Extract key from URL
    const urlParts = fileUrl.split('/');
    const key = urlParts.slice(3).join('/');

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    };

    await s3Client.deleteObject(params).promise();
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete from S3: ' + error.message);
  }
}

// ============ Aliyun OSS Implementation ============

async function uploadToAliyunOSS(fileBuffer, fileName, mimeType) {
  // TODO: Implement Aliyun OSS upload
  // This requires aliyun-sdk package configuration
  throw new Error('Aliyun OSS implementation not yet configured');
}

async function deleteFromAliyunOSS(fileUrl) {
  // TODO: Implement Aliyun OSS delete
  throw new Error('Aliyun OSS implementation not yet configured');
}

/**
 * Generate presigned URL for temporary file access
 * @param {String} fileUrl - File URL
 * @param {Number} expiresIn - Expiration time in seconds (default: 3600)
 * @returns {Promise<String>} Presigned URL
 */
export const generatePresignedUrl = async (fileUrl, expiresIn = 3600) => {
  if (STORAGE_SERVICE === 'AWS_S3') {
    try {
      const urlParts = fileUrl.split('/');
      const key = urlParts.slice(3).join('/');

      const url = s3Client.getSignedUrl('getObject', {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Expires: expiresIn
      });

      return url;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw error;
    }
  }

  // For other services or if not using presigned URLs
  return fileUrl;
};
