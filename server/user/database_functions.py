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
user = db["users"]
order = db["orders"]

def delete():
    user.delete_many({})

def upload_user(username, password):
    user.insert_one({"username": username, "password": password, "drugs": []})


def check_user(username):
    result = user.find_one({"username": username})
    if result:
        return result["password"]
    return None


def upload_drug(username, input:dict, threshold):
    user.update_one({"username": username}, {'$push': {
        "drugs": {"drugname": input["name"], "amount": input["count"], "description": input["description"], "schedule": input["schedule"],
                      "dose": input["dosage"], "threshold": threshold, "properties": input["property"]}}})


def get_drugs(username):
    results = user.find_one({"username": username})
    return results["drugs"]

def upload_order(username, drugname, amount, description, schedule: list[str], dose, color):
    # create a new order
    result = order.insert_one({"username": username, "drugname": drugname, "amount": amount, "description": description,
                               "schedule": schedule, "dose": dose, "color": color, "ready": False})
    return str(result.inserted_id)

def take_pill(username, drugname):
    # Decrease user’s pill count
    user.update_one(
        {"username": username, "drugs.drugname": drugname},
        {"$inc": {"drugs.$.amount": -1}}
    )
    med = user.find_one({"username": username, "drugs.drugname": drugname}, {"drugs.$": 1})

    med = med["drugs"][0]

    # Auto-order if below threshold
    if med["amount"] <= med["threshold"]:
        prev_order = order.find_one({"username": username, "drugname": drugname})
        amount = prev_order["amount"]

        upload_order(
            username,
            drugname,
            amount,
            med["description"],
            med["schedule"],
            med["dose"],
            med["properties"]
        )
