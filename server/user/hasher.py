from argon2 import PasswordHasher
from database_functions import upload_user, check_user


phash = PasswordHasher()


def h_signup(username, password):
    password = phash.hash(password)
    upload_user(username, password)
    return {"response": "All good!"}


def h_login(username, password):
    hashed = check_user(username)
    verify = phash.verify(hashed, password)
    return verify

