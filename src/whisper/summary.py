import json
import os
import re
from datetime import datetime

import requests
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import SUMMARY_SERVER_IP, SUMMARY_SERVER_PORT
from src.whisper.database_service import DatabaseService
from src.database import Summary as DB_Summary


class Summary:
    def __init__(self, file_name: str, db: AsyncSession):
        self.file_name = file_name
        self.file_path: str = os.path.join(os.path.dirname(__file__), 'files', f'{file_name}.json')
        self.conversation_string = Summary.load_conversation_data(self)
        self.ollama_endpoint = f"http://{SUMMARY_SERVER_IP}:{SUMMARY_SERVER_PORT}/api/generate"
        self.ollama_prompt = '''
Пожалуйста, проанализируй следующие реплики спикеров с встречи и создай подробное резюме по каждому спикеру в формате JSON, включая ключевые моменты и основные идеи. Убедись, что резюме четкое и структурированное. Вот текст реплик спикеров:

''' + self.conversation_string + '''

1. Сначала выдели ключевые моменты для каждого спикера, используя имена спикеров, указанные в репликах. Убедись, что ты учитываешь только те реплики, которые относятся к теме встречи, и исключи не относящиеся к ней моменты (например, пожелания здоровья или личные комментарии).

2. Затем создай общий список ключевых моментов для всей встречи, обобщая основные темы обсуждения, важные решения и любые действия, которые были согласованы.

Ответ должен быть только в формате JSON с двумя полями:
- "speakers": словарь, где ключи - имена спикеров, указанные в репликах, а значения - массив ключевых элементов.
- "meet": массив ключевых моментов.

Пример формата JSON:
{
  "speakers": {
    "Имя Спикера 1": ["Ключевой момент 1", "Ключевой момент 2", "Ключевой момент 3", "Ключевой момент 4", "Ключевой момент 5"],
    "Имя Спикера 2": ["Ключевой момент 1", "Ключевой момент 2", "Ключевой момент 3", "Ключевой момент 4", "Ключевой момент 5"],
    "Имя Спикера 3": ["Ключевой момент 1", "Ключевой момент 2", "Ключевой момент 3", "Ключевой момент 4", "Ключевой момент 5"]
  },
  "meet": ["Общий ключевой момент 1", "Общий ключевой момент 2", "Общий ключевой момент 3", "Общий ключевой момент 4", "Общий ключевой момент 5"]
}

Пожалуйста, предоставь только ответ в формате JSON без каких-либо дополнительных комментариев с твоей стороны. Язык, котором ты будешь давать ответ должен соответствовать языку реплик.

'''
        self.ollama_data = {
            "model": "kulick/t-lite:latest",
            "prompt": self.ollama_prompt,
            "stream": False
        }
        self.db_service = DatabaseService(db)
        self.db = db

    def load_conversation_data(self):
        with open(self.file_path, encoding='utf-8', mode='r') as f:
            json_file = json.load(f)[1:]
            conversation = list(map(lambda x: f"SPEAKER{x['speaker_id']}: {x['text']}", json_file))
            conversation_string = "\n".join(conversation)
            return conversation_string

    async def get_summary(self):
        response = requests.post(self.ollama_endpoint, json=self.ollama_data)
        return response.json()["response"]

    @staticmethod
    async def get_summary_formatted_dict(response: str) -> dict | None:
        new_dict = dict()
        response_dict = re.findall(
            r'\{[\s\n]*[\'\"]\w+[\'\"][\s\n]*:[\s\n]*(?:\{[\s\n]*(?:[\s\n]*[\'\"][\w\s()]+[\'\"][\s\n]*:[\s\n]*\[[\s\n]*[\'\"\w\s,./\\()\n!:?-]+[\s\n]*],?[\s\n]*)+[\s\n]*})[\s\n]*,[\s\n]*[\'\"]\w+[\'\"][\s\n]*:[\s\n]*\[[\w\s\'\".!,:?\\()-]+][\s\n]*}',
            response)
        try:
            if response_dict:
                summary = json.loads(response_dict[0])
                items = list(summary.items())
                new_dict['speakers'] = dict()
                for i, speaker in enumerate(items[0][1]):
                    new_dict['speakers'][f'speaker_{i + 1}'] = items[0][1][speaker]
                new_dict['meet'] = items[1][1]

                return new_dict
        except Exception as e:
            raise e
        return None

    async def get_summary_from_transcription(self, iterations=10) -> dict | None:
        s = {
            "data": "",
            "mistakes": 0
        }
        mistakes_count = 0
        for i in range(iterations):
            response = requests.post(self.ollama_endpoint, json=self.ollama_data)
            response_text = response.json()['response']
            if response_text:
                formatted_dict = await self.get_summary_formatted_dict(response_text)
                if formatted_dict:
                    s["data"] = formatted_dict
                    s["mistakes"] = i
                    return s
            mistakes_count = i
        s["data"] = None
        s["mistakes"] = mistakes_count
        return s['data']

    async def add_to_db(self, token: str, summarization):
        file_id = await self.db_service.get_file_id(token, self.file_name)
        update_data = update(DB_Summary).where(file_id == DB_Summary.file_id).values(
            summarization=summarization,
            uploaded_at=datetime.utcnow()
        )
        await self.db.execute(update_data)
        await self.db.commit()
