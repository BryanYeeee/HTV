from .hasher import h_login, h_signup
from .database_functions import get_stocks, increase_stock
from flask import Blueprint, jsonify, request
import requests

pharma = Blueprint("pharma", __name__)


@pharma.route("/")
def user_index():
    return "hello pharma"


@pharma.route("/login", methods=["POST"])
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


@pharma.route("/approve", methods=["POST"])
def approve_order():
    data = request.get_json()
    order_id = data["order_id"]
    approve_order(order_id)
    return "approve"


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
