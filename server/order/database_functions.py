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


def delete():
    # only for testing
    order.delete_many({})


def upload_order(username, drugname, amount, description, schedule: list[str], dose, color):
    # create a new order
    result = order.insert_one({"username": username, "drugname": drugname, "amount": amount, "description": description,
                               "schedule": schedule, "dose": dose, "color": color, "ready": False})
    return str(result.inserted_id)

def completed_order(id):
    try:
        obj_id = ObjectId(id)  # convert string → ObjectId
    except Exception as e:
        print("Invalid ID format:", e)
        return None

    order.update_one({"_id":obj_id}, {"$set":{"ready": True}})


def get_order(id):
    # gets a specific order - can be used to approve orders?
    try:
        obj_id = ObjectId(id)  # convert string → ObjectId
    except Exception as e:
        print("Invalid ID format:", e)
        return None

    result = order.find_one({"_id": obj_id})
    return result


def get_orders():
    result = order.find({"ready": False})
    orders_list = []

    for doc in result:
        doc["_id"] = str(doc["_id"])  # Convert ObjectId to string for JSON compatibility
        orders_list.append(doc)

    return orders_list
