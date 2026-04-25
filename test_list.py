import urllib.request
import json

url = "https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyBjuMWqt30i0CDj5qGk4gVZNEGWDp9mNZA"

try:
    with urllib.request.urlopen(url) as response:
        models = json.loads(response.read().decode('utf-8'))
        for m in models.get('models', []):
            if 'generateContent' in m.get('supportedGenerationMethods', []):
                print(m['name'])
except Exception as e:
    print("Error:", e)
