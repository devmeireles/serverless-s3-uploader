import { APIGatewayProxyEvent } from "aws-lambda"
import { S3 } from 'aws-sdk'
import { v4 as uuid } from 'uuid';
import { BUCKET_NAME, parseFormData } from "libs/fileHandler-lib"

const s3Client = new S3();

const upload = async (event: APIGatewayProxyEvent): Promise<unknown> => {
    const { file } = await parseFormData(event)

    const name = uuid();
    const ext = file.contentType.split('/')
    const key = `${name}.${ext[1]}`;

    try {
        // on Key if you put / it'll be split on folders
        await s3Client.putObject({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file.content,
            ContentType: file.contentType,
            ACL: 'public-read'
        }).promise()

        const url = `https://${process.env.imageUploadBucket}.s3-${process.env.region}.amazonaws.com/${key}`;

        return {
            statusCode: 200,
            body: JSON.stringify({ url }),
        };

    } catch (_error) {
        // this is deficient error handling, but good enough for the purpose of this example
        return {
            statusCode: 409, body: JSON.stringify({ description: _error.message })
        }
    }
}

export default {
    upload
}