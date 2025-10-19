import requests
from django.conf import settings



def check_url_with_virustotal(url):
    """
    Query VirusTotal API to check if a URL is malicious.
    """
    api_key = settings.VIRUSTOTAL_API_KEY
    headers = {"x-apikey": api_key}
    scan_url = "https://www.virustotal.com/api/v3/urls"

    # Encode URL for VT API
    resp = requests.post(scan_url, headers=headers, data={"url": url})
    if resp.status_code != 200:
        return {"error": "VirusTotal API error", "status": resp.status_code}

    # Get analysis ID
    analysis_id = resp.json()["data"]["id"]

    # Fetch analysis report
    report_url = f"https://www.virustotal.com/api/v3/analyses/{analysis_id}"
    report_resp = requests.get(report_url, headers=headers)

    if report_resp.status_code != 200:
        return {"error": "Failed to fetch analysis"}

    report = report_resp.json()
    stats = report["data"]["attributes"]["stats"]

    return {
        "harmless": stats.get("harmless", 0),
        "malicious": stats.get("malicious", 0),
        "suspicious": stats.get("suspicious", 0),
        "undetected": stats.get("undetected", 0),
    }

import random

def analyze_url(url: str):
    """
    Fake analysis function.
    Later we will connect ML + VirusTotal.
    """
    prediction = random.choice(["Safe", "Malicious", "Suspicious"])
    threat = prediction != "Safe"

    result = {
        "url": url,
        "ml_prediction": prediction,
        "threat": threat,
        "virustotal": {
            "harmless": random.randint(0, 5),
            "malicious": random.randint(0, 3),
            "suspicious": random.randint(0, 2),
            "undetected": random.randint(0, 5),
        },
    }
    return result

