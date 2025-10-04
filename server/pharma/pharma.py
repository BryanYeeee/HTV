from .hasher import h_login, h_signup
from flask import Blueprint, jsonify

pharma = Blueprint("pharma", __name__)


@pharma.route("/")
def user_index():
    return "hello user"


@pharma.route("/login")
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


@pharma.route("/signup")
def signup():
    # TODO: update the variables with request parameters
    username, password = "", ""
    h_signup(username, password)
    return jsonify({"response": "good signup"})


def send_prescription():
    return

