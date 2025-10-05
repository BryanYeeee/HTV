from bson import ObjectId
import certifi
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
pharmacy = db["pharmacy"]
order = db["orders"]
user = db["users"]


def delete():
    pharmacy.delete_many({})

def upload_pharma(username, password):
    pharmacy.insert_one({"username": username, "password": password, "stock": []})

def get_stocks(username):
    result = pharmacy.find_one({"username": username})
    return result["stock"]

def check_pharma(username):
    result = pharmacy.find_one({"username": username})
    if result:
        return result["password"]
    return None


def decrease_stock(username, drugname, amount):
    pharmacy.update_one({"username": username, "stock.drugname": drugname}, {"$inc": {"stock.$.amount": -amount}})


def increase_stock(username, drugname):
    if not check_pharma(username):
        return None
    pharma_info = pharmacy.find_one({"username": username})
    if drugname in [name["drugname"] for name in pharma_info["stock"]]:
        pharmacy.update_one({"username": username, "stock.drugname": drugname}, {"$inc": {"stock.$.amount": 100}})
    else:
        pharmacy.update_one({"username": username}, {"$push": {"stock": {"drugname": drugname, "amount": 100}}})
    return "increased"

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

def upload_drug(username, input:dict, threshold):
    user.update_one({"username": username}, {'$push': {
        "drugs": {"drugname": input["name"], "amount": input["count"], "description": input["description"], "schedule": input["schedule"],
                      "dose": input["dosage"], "threshold": threshold, "properties": input["property"]}}})


def approve_order(id: str):
    result = get_order(id)
    if not result:
        return False

    username = result["username"]
    drugname = result["drugname"]
    amount = result["amount"]
    schedule = result["schedule"]

    days = {entry.split("_")[0] for entry in schedule}
    total_entries = len(schedule)
    doses_per_day = total_entries / len(days) if days else 1

    threshold = int(doses_per_day * 3)

    upload_drug(username, result, threshold)
    decrease_stock(username, drugname, amount)
    completed_order(id)
    return True
