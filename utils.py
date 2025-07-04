from datetime import datetime

def parse_payload(payload, event_type):
    if event_type == "push":
        return {
            "type": "push",
            "author": payload["pusher"]["name"],
            "from_branch": None,
            "to_branch": payload["ref"].split("/")[-1],
            "timestamp": datetime.utcnow()
        }

    elif event_type == "pull_request":
        action = payload["action"]
        if action == "opened":
            return {
                "type": "pull_request",
                "author": payload["pull_request"]["user"]["login"],
                "from_branch": payload["pull_request"]["head"]["ref"],
                "to_branch": payload["pull_request"]["base"]["ref"],
                "timestamp": datetime.utcnow()
            }
        elif action == "closed" and payload["pull_request"]["merged"]:
            return {
                "type": "merge",
                "author": payload["pull_request"]["user"]["login"],
                "from_branch": payload["pull_request"]["head"]["ref"],
                "to_branch": payload["pull_request"]["base"]["ref"],
                "timestamp": datetime.utcnow()
            }

    return None  # Not an event we care about
