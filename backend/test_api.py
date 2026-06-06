import json
import urllib.request
import urllib.error

def post_json(url, payload):
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type':'application/json'})
    with urllib.request.urlopen(req) as resp:
        return resp.read().decode('utf-8')

def main():
    try:
        health = urllib.request.urlopen('http://localhost:8000/health').read().decode('utf-8')
        print('health:', health)
    except Exception as e:
        print('health error', e)

    payload = {
        'items': [
            {'name': 'Tomato', 'quantity': '2', 'unit': 'pcs', 'category': 'vegetable'}
        ],
        'preferences': 'vegan'
    }
    try:
        resp = post_json('http://localhost:8000/api/ai-chef/generate-recipes', payload)
        print('generate-recipes response:', resp)
    except Exception as e:
        print('generate-recipes error', e)

if __name__ == '__main__':
    main()
