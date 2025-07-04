from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from utils import parse_payload
from db import save_event, get_latest_events

app = Flask(__name__)
CORS(app)  # Allow frontend requests

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/webhook', methods=['POST'])
def webhook():
    event_type = request.headers.get('X-GitHub-Event')
    payload = request.get_json()

    event = parse_payload(payload, event_type)
    if event:
        save_event(event)
        return jsonify({"message": "Event saved"}), 200
    return jsonify({"message": "Ignored"}), 200

@app.route('/events', methods=['GET'])
def events():
    events = get_latest_events()
    
    # Convert timestamp to ISO format for frontend
    for event in events:
        event['_id'] = str(event['_id'])  # Convert ObjectId to string
        event['timestamp'] = event['timestamp'].isoformat() + "Z"
    
    return jsonify(events)

if __name__ == '__main__':
    app.run(debug=True)
