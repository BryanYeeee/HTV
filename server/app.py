from user.user import user
from pharma.pharma import pharma
from flask import Flask, jsonify

app = Flask(__name__)
app.register_blueprint(user, url_prefix="/user")
app.register_blueprint(pharma, url_prefix="/pharma")

@app.route("/")
def index():
    response = jsonify({"response": "hello"})
    return response


if __name__ == "__main__":
    app.run(port=8080, debug=True)

