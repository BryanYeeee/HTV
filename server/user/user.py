from .database_functions import upload_drug
from .hasher import h_login, h_signup
from flask import Blueprint, jsonify, request
from .ocr import parse_text


user = Blueprint("user", __name__)


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
        response = jsonify({"response": "good login"})
        return response

    response = jsonify({"response": "bad login"})
    return response


@user.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username, password = data["username"], data["password"]
    h_signup(username, password)
    return jsonify({"response": "good signup"})


@user.route("/new_order", methods=["POST"])
def send_prescription():
    # recieves image in mime type

    if "file" not in request.files:
        return "No file uploaded", 400

    file = request.files["file"]
    # Check mimetype (e.g., "image/jpeg", "image/png")
    mimetype = file.mimetype
    filename = file.filename

    # Save the file if you want
    file.save("./prescription.png")
    response = parse_text()

    for drug in response:
        upload_drug()



    return {"filename": filename, "mimetype": mimetype}, 200


