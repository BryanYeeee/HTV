from .hasher import h_login, h_signup
from flask import Blueprint, jsonify, request

user = Blueprint("user", __name__)


@user.route("/")
def user_index():
    return "hello user"


@user.route("/login")
def login():
    # TODO: update the variables with request parameters
    username = ""
    password = ""
    # verify = h_login(username, password)
    # if verify:
    #     response = jsonify({"response": "good login"})
    #     return response

    response = jsonify({"response": "bad login"})
    return response


@user.route("/signup")
def signup():
    # TODO: update the variables with request parameters
    username, password = "", ""
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
    file.save(f"./uploads/{filename}")

    return {"filename": filename, "mimetype": mimetype}, 200


