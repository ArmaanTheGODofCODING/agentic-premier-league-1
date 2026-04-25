import urllib.request
import json
import urllib.error

url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBjuMWqt30i0CDj5qGk4gVZNEGWDp9mNZA"
data = json.dumps({"contents": [{"parts": [{"text": "hi"}]}]}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print(response.read().decode('utf-8')[:50])
except urllib.error.HTTPError as e:
    print("Error:", e.status)
    print(e.read().decode('utf-8'))
