from server.order.database_functions import completed_order, get_order
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


# def approve_order(id: str):
#     result = get_order(id)
#     if not result:
#         return False

#     username = result["username"]
#     drugname = result["drugname"]
#     amount = result["amount"]
#     schedule = result["schedule"]

#     days = {entry.split("_")[0] for entry in schedule}
#     total_entries = len(schedule)
#     doses_per_day = total_entries / len(days) if days else 1

#     threshold = int(doses_per_day * 3)

#     upload_drug(username, result, threshold)
#     decrease_stock(username, drugname, amount)
#     completed_order(id)
#     return True
