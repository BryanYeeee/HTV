from .hasher import h_login, h_signup
from .database_functions import get_stocks
from flask import Blueprint, jsonify, request
import requests

pharma = Blueprint("pharma", __name__)


@pharma.route("/")
def user_index():
    return "hello pharma"


@pharma.route("/login")
def login():
    data = request.get_json()
    username, password = data["username"], data["password"]
    h_login(username, password)
    response = jsonify({"response": "good login"})
    return response


@pharma.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username, password = data["username"], data["password"]
    h_signup(username, password)
    return jsonify({"response": "good signup"})


@pharma.route("/approve", methods=["POST"])
def approve_order():
    data = request.get_json()
    order_id = data["order_id"]
    requests.post("http://localhost:8080/order/")


    return


@pharma.route("/get_stocks", methods=["POST"])
def pharma_stocks():
    data = request.get_json()
    username = data["username"]
    response = jsonify(get_stocks(username))
    return response
