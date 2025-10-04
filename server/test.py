from server.user.database_functions import upload_user, check_user, upload_drug, get_drugs
from server.order.database_functions import upload_order, get_order
from server.pharma.database_functions import upload_pharma, check_pharma, increase_stock, approve_order
from bson import ObjectId

# ---------------------------
# 1️⃣ Create users
# ---------------------------
print(upload_user("alice", "password123"))
print(upload_user("bob", "securepass"))

# Check user
print("Check alice:", check_user("alice"))
print("Check bob:", check_user("bob"))

# ---------------------------
# 2️⃣ Create pharmacies
# ---------------------------
print(upload_pharma("GoodHealth", "pharma123"))
print(upload_pharma("MediCare", "medicarepass"))

# Check pharmacy
print("Check GoodHealth:", check_pharma("GoodHealth"))
print("Check MediCare:", check_pharma("MediCare"))

# ---------------------------
# 3️⃣ Increase pharmacy stock
# ---------------------------
increase_stock("GoodHealth", "Atorvastatin")
increase_stock("GoodHealth", "Metformin")
increase_stock("MediCare", "Metformin")

# ---------------------------
# 4️⃣ Upload orders
# ---------------------------
order_id1 = upload_order(
    "alice",
    "Atorvastatin",
    30,
    "Daily cholesterol control",
    ["0_0800", "1_0800", "2_0800", "3_0800", "4_0800", "5_0800", "6_0800"],
    "10mg",
    "blue"
)
order_id2 = upload_order(
    "bob",
    "Metformin",
    60,
    "Diabetes management",
    ["0_0800", "0_2000", "1_0800", "1_2000"],
    "500mg",
    "white"
)

# ---------------------------
# 5️⃣ Get and inspect orders
# ---------------------------
print("Get order 1:", get_order(str(order_id1)))
print("Get order 2:", get_order(str(order_id2)))

# ---------------------------
# 6️⃣ Approve orders (user receives medicine)
# ---------------------------
print("Approve Alice's order:", approve_order(str(order_id1), "GoodHealth"))
print("Approve Bob's order:", approve_order(str(order_id2), "MediCare"))

# ---------------------------
# 7️⃣ Check user medicines
# ---------------------------
print("Alice medicines:", get_drugs("alice"))
print("Bob medicines:", get_drugs("bob"))

# ---------------------------
# 8️⃣ Check stock after approval (optional)
# ---------------------------
# (assuming you implemented decrease_stock in pharmacy module)
# e.g., decrease_stock("GoodHealth", "Atorvastatin", 30)
# print("GoodHealth stock after approval:", pharmacy.find_one({"username": "GoodHealth"})["stock"])
