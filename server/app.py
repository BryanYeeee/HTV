from doctest import debug

from flask import Flask

app = Flask(__name__)


@app.route("/")
def index():
    return "ni hao"


if __name__ == "__main__":
    app.run(port=8080, debug=True)

