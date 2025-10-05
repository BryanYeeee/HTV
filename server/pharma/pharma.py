# from server.order.database_functions import completed_order, get_order
# from server.user.database_functions import upload_drug
import certifi
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from pymongo.server_api import ServerApi
from flask import Blueprint, jsonify, request
load_dotenv()
import requests
from .hasher import h_login, h_signup

# Replace with your Atlas connection string
uri = os.getenv("MONGO_URI")
pharma = Blueprint("pharma", __name__)
# Create a connection
client = MongoClient(uri, tlsCAFile=certifi.where(), server_api=ServerApi('1'))

# Create or switch to a database
db = client["selfPharma"]
pharmacy = db["pharmacy"]

@pharma.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    username, password = data["username"], data["password"]
    verify = h_login(username, password)
    if verify:
        response = jsonify({"type": "pharma"})
        return response
    response = jsonify(({"response": "bad login"}))
    return response


@pharma.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username, password = data["username"], data["password"]
    h_signup(username, password)
    return jsonify({"response": "good signup"})

@pharma.route("/increase_stock", methods=["POST"])
def increase_stock_pharma():
    data = request.get_json()
    pharma_id, drugname = data["username"], data["drugname"]
    increase_stock(pharma_id, drugname)
    return "increase"

@pharma.route("/get_stocks", methods=["POST"])
def pharma_stocks():
    data = request.get_json()
    username = data["username"]
    response = jsonify(get_stocks(username))
    return response

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
        pharmacy.update_one({"username": username}, {"$push": {"stock": {"drugname": drugname, "name":drugname, "amount": 100}}})
    return "increased"


def approve_order(id: str, username):
    result = get_order(id)
    if not result:
        return False

    result["name"] = result["drugname"]
    result["count"] = result["amount"]
    result["dosage"] = result["dose"]
    result["property"] = result["color"]
    user_username = result["username"]
    drugname = result["drugname"]
    amount = result["amount"]
    schedule = result["schedule"]

    days = {entry.split("_")[0] for entry in schedule}
    total_entries = len(schedule)
    doses_per_day = total_entries / len(days) if days else 1

    threshold = int(doses_per_day * 3)

    upload_drug(user_username, result, threshold)
    decrease_stock(username, drugname, amount)
    completed_order(id)
    return True