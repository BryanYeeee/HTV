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


def upload_drug(username, drugname, amount, description, schedule: list[str], dose, threshold):
    user.update_one({"username": username}, {'$push': {
        "drugs": {"drugname": drugname, "amount": amount, "description": description, "schedule": schedule,
                      "dose": dose, "threshold": threshold}}})

def get_user_info(username):
    results = user.find_one({"username": username})
    if not results:
        return None
    return results["drugs"]

def get_drugs(username):
    results = user.find_one({"username": username})
    return results["drugs"]
