from .database_functions import get_stocks, increase_stock, approve_order
import certifi
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from pymongo.server_api import ServerApi
from flask import Blueprint, jsonify, request
load_dotenv()
import requests
from .hasher import h_login, h_signup
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

@pharma.route("/approve", methods=["POST"])
def approve_order_pharma():

    data = request.get_json()

    order_id = data["order_id"]

    approve_order(order_id, data["username"])


    return "approve"