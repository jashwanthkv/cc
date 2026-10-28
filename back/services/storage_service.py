import json
import os
from datetime import datetime

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "users.json")


def _load() -> dict:
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    if not os.path.exists(DATA_FILE):
        return {}
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save(data: dict):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def save_user(user_id: str, user_data: dict):
    data = _load()
    user_data["created_at"] = datetime.now().isoformat()
    data[user_id] = user_data
    _save(data)


def get_user(user_id: str) -> dict | None:
    data = _load()
    return data.get(user_id)


def update_user(user_id: str, updates: dict):
    data = _load()
    if user_id in data:
        data[user_id].update(updates)
        _save(data)


def list_users() -> list:
    data = _load()
    return list(data.keys())
