from .database_functions import get_drugs, take_pill
from .hasher import h_login, h_signup
from flask import Blueprint, jsonify, request
from .ocr import parse_text
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
user = Blueprint("user", __name__)

def upload_order(username, drugname, amount, description, schedule: list[str], dose, color):
    # create a new order
    result = order.insert_one({"username": username, "drugname": drugname, "amount": amount, "description": description,
                               "schedule": schedule, "dose": dose, "color": color, "ready": False})
    return str(result.inserted_id)

@user.route("/")
def user_index():
    return "hello user"


@user.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    verify = h_login(username, password)
    if verify:
        response = jsonify({"type": "user"})
        return response

    response = jsonify({"response": "bad login"})
    return response


@user.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username, password = data["username"], data["password"]
    h_signup(username, password)
    return jsonify({"response": "good signup"})


@user.route("/new_order", methods=["POST", "OPTIONS"])
def send_prescription():
    print("Content-Type:", request.content_type)
    print("Form keys:", request.form.keys())
    print("Files keys:", request.files.keys())
    # recieves image in mime type
    file = request.files.get("file")
    username = request.form.get("username")
    print(username, file)

    if not file:
        return {"error": "No file uploaded"}, 400
    # Check mimetype (e.g., "image/jpeg", "image/png")
    mimetype = file.mimetype
    filename = file.filename

    # Save the file if you want
    file.save("./prescription.png")
    response = parse_text()

    for drug in response:
        drugname = drug["name"]
        amount = drug["count"]
        description = drug["description"]
        schedule = drug["schedule"]
        upload_order(username, drugname, amount, description, schedule, drug["dosage"], drug["property"])

    return "good"
    # return {"filename": filename, "mimetype": mimetype}, 200


@user.route("/confirm_order", methods=["POST"])
def change_user_tag():
    data = request.get_json()
    username = data["username"]
    # confirm_order(username)
    return "GREAT"


@user.route("/get_drugs", methods=["POST"])
def get_user_drugs():
    data = request.get_json()
    username = data["username"]
    response = jsonify(get_drugs(username))
    return response

@user.route("/subtract", methods=["POST"])
def take_pill_pharma():
    data = request.get_json()
    username = data["username"]
    drugname = data["drugname"]
    take_pill(username, drugname)
    return "done"
