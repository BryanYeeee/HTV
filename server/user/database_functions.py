from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://rianmehta20_db_user:<db_password>@selfpharma.lasodmi.mongodb.net/?retryWrites=true&w=majority&appName=SelfPharma"
# Create a new client and connect to the server
client = MongoClient(uri)
db = client["selfPharma"]
user =


def upload_user(username, password):
    # TODO: upload to user database using username and password
    # password is hashed (not that it matters)
    return None


def check_user(username):
    # TODO: query the databse to return the hashed_password that is stored
    return
