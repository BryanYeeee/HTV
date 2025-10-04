from hasher import h_login, h_signup


def login():
    # TODO: update the variables with request parameters
    username = ""
    password = ""
    verify = h_login(username, password)
    if verify:
        return {"response": "good"}
    return {"response": "bad"}


def signup():
    # TODO: update the variables with request parameters
    username, password = "", ""
    h_signup(username, password)
    return {"response": "good"}


def send_prescription():
    return

