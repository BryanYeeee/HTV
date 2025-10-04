from argon2 import PasswordHasher
from .database_functions import upload_pharma, check_pharma


phash = PasswordHasher()


def h_signup(username, password):
    password = phash.hash(password)
    upload_pharma(username, password)
    return {"response": "All good!"}


def h_login(username, password):
    hashed = check_pharma(username)
    verify = phash.verify(hashed, password)
    return verify

