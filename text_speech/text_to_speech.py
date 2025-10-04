import vosk
import pyaudio
import pyttsx3
import json
from dotenv import load_dotenv
import os
from google import genai

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client()

# Initialize Vosk
model = vosk.Model("vosk-model-small-en-us-0.15")
recognizer = vosk.KaldiRecognizer(model, 16000)

# Initialize pyttsx3
engine = pyttsx3.init()

def record_and_transcribe(duration=3):
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16,
                    channels=1,
                    rate=16000,
                    input=True,
                    frames_per_buffer=8000)
    print("Recording...")
    frames = []
    for _ in range(0, int(16000 / 8000 * duration)):
        data = stream.read(8000)
        frames.append(data)
        if recognizer.AcceptWaveform(data):
            pass
    stream.stop_stream()
    stream.close()
    p.terminate()
    print("Recording finished.")

    text = recognizer.FinalResult()
    text = json.loads(text).get("text", "")
    print(f"Recognized: {text}")
    return text

def query_gemini(text, ):

    PROMPT = f'Translate the given text into pirate language: {text}'

    response = client.models.generate_content(model="gemini-2.5-flash", contents=f'{PROMPT}')
    return response.text

def speak(text):
    engine.say(text)
    engine.runAndWait()

def main():
    while True:
        text = record_and_transcribe()
        if text.lower() in ["exit", "quit", "stop"]:
            break
        response = query_gemini(text)
        speak(response)

if __name__ == "__main__":
    main()
