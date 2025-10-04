from server.order.database_functions import get_order
from server.user.database_functions import upload_drug
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


def upload_pharma(username, password):
    pharmacy.insert_one({"username": username, "password": password, "stock": []})


def check_pharma(username):
    result = pharmacy.find_one({"username": username})
    if result:
        return result["password"]
    return None


def increase_stock(username, drugname):
    if not check_pharma(username):
        return None
    pharma_info = pharmacy.find_one({"username": username})
    if drugname in [name["drugname"] for name in pharma_info["stock"]]:
        pharmacy.update_one({"username": username, "stock.drugname": drugname}, {"$inc": {"stock.$.amount": 100}})
    else:
        pharmacy.update_one({"username": username}, {"$push": {"stock": {"drugname": drugname, "amount": 100}}})


def approve_order(id) -> bool:
    result = get_order(id)
    username = result["username"]
    drugname = result["drugname"]
    amount = result["amount"]
    description = result["description"]
    schedule = result["schedule"]
    dose = result["dose"]
    threshold = int(len(schedule)/7) * 3
    return upload_drug(username, drugname, amount, description, schedule, dose, threshold)
