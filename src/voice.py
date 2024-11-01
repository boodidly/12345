import pyttsx3
import sys
import json

engine = pyttsx3.init()

# Get the command line argument (the text to speak)
data = json.loads(sys.argv[1])
text = data['text']
rate = data.get('rate', 175)
volume = data.get('volume', 1.0)
voice_id = data.get('voice', None)

# Configure the engine
engine.setProperty('rate', rate)
engine.setProperty('volume', volume)

if voice_id:
    voices = engine.getProperty('voices')
    for voice in voices:
        if voice.id == voice_id:
            engine.setProperty('voice', voice.id)
            break

# Speak the text
engine.say(text)
engine.runAndWait()