from whisper_service import WhisperService
import asyncio

file_name = "1208_004e1b9345cc4b4595e7dd97e481c41f"

whisper = WhisperService(file_name)


async def main():
    await whisper.run()

if __name__ == "__main__":
    asyncio.run(main())
