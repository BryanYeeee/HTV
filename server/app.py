from user.user import user
from audio.audio import audio
from pharma.pharma import pharma
from order.order import order
from flask import Flask, jsonify

app = Flask(__name__)
app.register_blueprint(audio, url_prefix="/audio")
app.register_blueprint(user, url_prefix="/user")
app.register_blueprint(pharma, url_prefix="/pharma")
app.register_blueprint(order, url_prefix="/order")


@app.route("/")
def index():
    response = jsonify({"response": "hello"})
    return response


if __name__ == "__main__":
    app.run(port=8080, debug=True)

