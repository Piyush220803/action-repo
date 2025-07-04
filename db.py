from pymongo import MongoClient
from datetime import datetime

# Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["webhook_db"]
collection = db["events"]

def save_event(event):
    collection.insert_one(event)

def get_latest_events(limit=10):
    return list(collection.find().sort("timestamp", -1).limit(limit))
