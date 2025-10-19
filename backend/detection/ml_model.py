import re
import joblib
import tldextract
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
import os

MODEL_FILE = "detection/url_model.pkl"

# Sample training dataset (tiny for demo, replace with real dataset later)
TRAIN_URLS = [
    ("http://paypal.com.secure-login.co", 1),   # phishing
    ("http://secure-update-account.com", 1),   # phishing
    ("http://example.com", 0),                 # safe
    ("https://www.google.com", 0),             # safe
]

def extract_features(url):
    """Simple feature extractor: length, digits, special chars"""
    length = len(url)
    digits = sum(c.isdigit() for c in url)
    special = len(re.findall(r"[^a-zA-Z0-9]", url))
    domain = tldextract.extract(url).domain
    return f"{domain} length:{length} digits:{digits} special:{special}"

def train_model():
    texts = [extract_features(url) for url, label in TRAIN_URLS]
    labels = [label for url, label in TRAIN_URLS]

    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(texts)

    model = LogisticRegression()
    model.fit(X, labels)

    joblib.dump((model, vectorizer), MODEL_FILE)
    print("✅ Model trained and saved!")

def predict_url(url):
    if not os.path.exists(MODEL_FILE):
        train_model()

    model, vectorizer = joblib.load(MODEL_FILE)
    features = extract_features(url)
    X = vectorizer.transform([features])
    pred = model.predict(X)[0]
    return "Phishing" if pred == 1 else "Safe"
