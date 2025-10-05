import vosk
import pyaudio
import pyttsx3
import json
from dotenv import load_dotenv
from google import genai
import datetime
from text_speech.database_functions import get_user_info
from gtts import gTTS
import io
import pygame


load_dotenv("../server/.env")
#GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client()

# Initialize Vosk
model = vosk.Model("vosk-model-small-en-us-0.15")
recognizer = vosk.KaldiRecognizer(model, 16000)

# Initialize pyttsx3
engine = pyttsx3.init()

now = datetime.datetime.now()
day = now.weekday()
time = now.time()

def record_and_transcribe(duration=5):
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

def query_gemini(username, text):
    user_data = get_user_info(username)
    PROMPT = f"""
    You are a highly concise and accurate medical assistant. You have access to the following user prescription data:

    User Data:
    {user_data}

    Instructions:
    - The user has asked: "{text}"
    - Answer **briefly and clearly**, using only the information in the user data.
    - If the question is **not related to the user's medicines, prescriptions, doses, schedules, or thresholds**, or is about chit-chat, jokes, or unrelated topics, respond politely with: "I don’t have that information."
    - Mention only relevant medicines or details that answer the user's query.
    - Use full sentences but keep them short (1–2 sentences per answer).
    - Do NOT fabricate information; if the answer is not in the user data, say: "I don’t have that information."
    - Prefer medicine names, doses, schedules, and threshold when relevant.
    - Current Day & Time: (Day index: {day}, Time: {time}) for day and time related queries

    Example:
    User Data: [{{"drugname": "ABCIXIMAB", "amount": 7, "description": "Abciximab is a glycoprotein IIb/IIIa inhibitor that helps prevent blood clots.", "schedule": ["0_0800","1_0800"], "dose": 1, "threshold": 10}}]
    User asks: "When should I take ABCIXIMAB? or What medicine do I need to take?"
    Answer: "Take ABCIXIMAB on Monday at 08:00 and Tuesday at 08:00. Dosage is 1 pill per intake."

    Output:
    - Short, relevant response.
    - Use only information from user_data.
    - No extra commentary, no unrelated advice.
    - Always provide times in 24-hour format if mentioning schedule.

    Question: {text}
    """

    response = client.models.generate_content(model="gemini-2.5-flash", contents=f'{PROMPT}')
    return response.text

def speak(text):
    mp3_fp = io.BytesIO()
    tts = gTTS(text=text, tld='ca',lang='en', slow=False)
    tts.write_to_fp(mp3_fp)
    mp3_fp.seek(0)
    pygame.mixer.init()
    pygame.mixer.music.load(mp3_fp, 'mp3')
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        continue

def main():
    while True:
        text = record_and_transcribe()
        if text.lower() in ["exit", "quit", "stop"]:
            break
        response = query_gemini("bob", text)
        speak(response)

if __name__ == "__main__":
    main()
