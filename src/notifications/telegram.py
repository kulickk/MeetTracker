import asyncio
from typing import AsyncGenerator
from aiogram import Bot, Dispatcher, types
from sqlalchemy.future import select
from aiogram.filters import CommandStart
from src.config import TELEGRAM_BOT_TOKEN
from src.database import User as DB_USER, async_session_db

bot = Bot(token=TELEGRAM_BOT_TOKEN)
dp = Dispatcher()


async def get_telegram_bot() -> AsyncGenerator[Bot, None]:
    async with bot as tg_bot:
        yield tg_bot


async def on_start(message: types.Message) -> None:
    link_code = message.text.split(' ')[-1]
    db = async_session_db()
    result = await db.execute(select(DB_USER).where(link_code == DB_USER.link_code))
    user = result.scalar_one_or_none()

    if user:
        user.telegram_id = str(message.from_user.id)
        user.link_code = None
        await db.commit()
        await message.reply("Ваш аккаунт успешно привязан!")
    else:
        await message.reply("Код привязки не найден.")


@dp.message(CommandStart())
async def start_command(message: types.Message):
    await on_start(message)


async def main():
    await dp.start_polling(bot)


if __name__ == '__main__':
    asyncio.run(main())
