from flask import Blueprint, request
from text_speech import text_to_speech
import requests

audio = Blueprint("audio", __name__)


@audio.route("/")
def index():
    return "hello audio"


@audio.route('/upload_audio', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return "No audio file part", 400

    file = request.files['audio']
    username = request.form.get('username')
    recorded_text = text_to_speech.transcribe(file)
    print(recorded_text)
    speak_text = text_to_speech.query_gemini(username, recorded_text)
    text_to_speech.speak(speak_text)
    return "200"
