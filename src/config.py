from dotenv import load_dotenv
import os

load_dotenv()

DB_HOST = 'postgres_db'
DB_PORT = '5432'
DB_NAME = 'postgres'
DB_USER = os.environ.get('DB_USER')
DB_PASS = os.environ.get('DB_PASS')

GMAIL_ADDRESS = os.environ.get('GMAIL_ADDRESS')
GMAIL_APP_PASSWORD = os.environ.get('GMAIL_APP_PASSWORD')

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY")
S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

SUMMARY_SERVER_IP = 'ollama'
SUMMARY_SERVER_PORT = '11434'

TELEGRAM_BOT_TOKEN = "7818243390:AAEK7bCLAOcmKt6P2xuzcndqxvB2F2kaMbU"
TELEGRAM_BOT_USERNAME = 'MeetTrackerAIbot'
