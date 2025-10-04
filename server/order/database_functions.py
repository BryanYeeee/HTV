import certifi
from bson import ObjectId
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from pymongo.server_api import ServerApi

load_dotenv()

# Replace with your Atlas connection string
uri = os.getenv("MONGO_URI")

# Create a connection
client = MongoClient(uri, tlsCAFile=certifi.where(), server_api=ServerApi('1'))

# Create or switch to a database
db = client["selfPharma"]
order = db["orders"]


def upload_order(username, drugname, amount, description, schedule: list[str], dose, color):
    order.insert_one({"username": username, "drugname": drugname, "amount": amount, "description": description,
                      "schedule": schedule, "dose":dose, "color":color})

def get_order(id):
    try:
        obj_id = ObjectId(id)  # convert string → ObjectId
    except Exception as e:
        print("Invalid ID format:", e)
        return None

    result = order.find_one({"_id": obj_id})
    return result
