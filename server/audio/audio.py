from flask import Blueprint, request


audio = Blueprint("audio", __name__)


@audio.route("/")
def index():
    return "hello audio"


@audio.route('/upload_audio', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return "No audio file part", 400

    file = request.files['audio']
    # Save it to disk
    file.save("./audio/uploaded_audio.mp3")  # or file.filename if you prefer
    return "Audio received and saved!"
