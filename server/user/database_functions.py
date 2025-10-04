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


def confirm_order(username):
    # TODO: update username with ready tag
    return
