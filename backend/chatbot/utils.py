import random

def ask_chatbot(query: str):
    """
    Dummy chatbot for cybersecurity queries.
    Later: integrate real LLM / AI assistant.
    """
    responses = [
        f"Based on your query '{query}', I recommend enabling 2FA.",
        f"The query '{query}' might indicate a phishing attempt. Be cautious!",
        f"'{query}' is related to malware. Run a full system scan.",
        f"For '{query}', you should check recent security advisories.",
        f"Our AI suggests monitoring network traffic for anomalies if '{query}' concerns you.",
    ]
    return random.choice(responses)
