from flask import Blueprint, jsonify, request
from .database_functions import upload_order, get_orders, get_order
import requests

order = Blueprint("order", __name__)


@order.route("/")
def user_index():
    return "hello order"


@order.route("/new_order")
def new_order():
    # params from request
    username, drugname, amount, description, schedule, dose, color = 0, 0, 0, 0, 0, 0, 0
    result = upload_order(username, drugname, amount, description, dose, color)
    if result:
        response = jsonify({"response": "good order"})
        return response


@order.route("/list_orders")
def list_orders():
    # params from request - NONE
    response = jsonify(get_orders())
    return response


@order.route("/get_order")
def one_order():
    data = request.get_json()
    orderd_id = data["order_id"]
    order = get_order(orderd_id)
    response = requests.post("http://localhost:8080/user/confirm_order",
                             {"username": order["username"]})
    return "good boy"

