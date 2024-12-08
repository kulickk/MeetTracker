from contextlib import asynccontextmanager
from aiobotocore.session import get_session
from src.config import S3_SECRET_KEY, S3_ACCESS_KEY, S3_ENDPOINT_URL, S3_BUCKET_NAME


class S3Client:
    def __init__(self):
        self.config = {
            'aws_access_key_id': S3_ACCESS_KEY,
            'aws_secret_access_key': S3_SECRET_KEY,
            'endpoint_url': S3_ENDPOINT_URL,
        }

        self.bucket_name = S3_BUCKET_NAME
        self.session = get_session()

    @asynccontextmanager
    async def get_client(self):
        async with self.session.create_client('s3', **self.config) as s3_client:
            yield s3_client

    async def upload_file(self, file_name, data):
        object_name = file_name
        async with self.get_client() as s3_client:
            await s3_client.put_object(Bucket=self.bucket_name, Key=object_name, Body=data)

    async def get_file(self, file_name: str):
        object_name = file_name
        async with self.get_client() as s3_client:
            resp = await s3_client.get_object(Bucket=self.bucket_name, Key=object_name)
            async with resp['Body'] as stream:
                data = await stream.read()
                data_type = resp['ResponseMetadata']['HTTPHeaders']['content-type']
                return data, data_type
