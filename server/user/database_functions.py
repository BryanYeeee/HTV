from pymongo import MongoClient

# Replace with your Atlas connection string
uri = "mongodb+srv://rianmehta20_db_user:XjvPPSFZ0eGEGz3D@selfpharma.lasodmi.mongodb.net/?retryWrites=true&w=majority&appName=SelfPharma"
# Create a connection
client = MongoClient(uri)

# Create or switch to a database
db = client["selfPharma"]
user = db["user"]


def upload_user(username, password):
    user.insert_one({"username": username, "password": password, "medicines": []})


def check_user(username):
    result = user.find_one({"username": username})
    if result:
        return result["password"]
    return None


def upload_medicine(username, medicine_name, amount, schedule: list[str], dose, threshold):
    user.update_one({"username": username}, {'$push': {"medicines": [
        {"name": medicine_name, "amount": amount, "schedule": schedule, "dose": dose, "threshold": threshold}]}})


def get_medicines(username):
    results = user.find_one({"username": username})
    return results["medicines"]
