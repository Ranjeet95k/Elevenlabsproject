import os
import django
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

MONGO_URI = "mongodb+srv://ranjeet9559k_db_user:1fjD4vJ4Q0PbhN0o@cluster0.a9md7o1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

DB_NAME = "elevenlabs_db" 


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tts_project.settings')
django.setup()

from tts_api.models import AudioFile

def populate_data():
    """
    Connects to MongoDB directly to insert data.
    This bypasses the Django ORM for initial population to ensure it works
    before the full app is running.
    """
    print("Connecting to MongoDB...")
    try:
        client = MongoClient(MONGO_URI)
        client.admin.command('ismaster')
        print("MongoDB connection successful.")
    except ConnectionFailure as e:
        print(f"MongoDB connection failed: {e}")
        return

    db = client[DB_NAME]
    collection = db['tts_api_audiofile']

    audio_data = [
        {
            "language": "English",
            "url": "https://raw.githubusercontent.com/Ranjeet95k/Elevenlabsproject/main/English.mp3"
        },
        {
            "language": "Arabic",
            "url": "https://raw.githubusercontent.com/Ranjeet95k/Elevenlabsproject/main/Arabic.mp3"
        }
    ]

    print("Clearing existing data...")
    collection.delete_many({})

    print("Inserting new data...")
    for data in audio_data:
        # Check if language already exists
        if not collection.find_one({"language": data["language"]}):
            collection.insert_one(data)
            print(f"  - Added: {data['language']}")
        else:
            print(f"  - Skipped (already exists): {data['language']}")

    print("\nDatabase population complete.")
    client.close()

if __name__ == '__main__':
    populate_data()

