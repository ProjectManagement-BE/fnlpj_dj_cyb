import re
import joblib
import tldextract
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
import os

MODEL_FILE = "detection/url_model.pkl"

# Sample training dataset (tiny for demo, replace with real dataset later)
import pandas as pd

MODEL_FILE = "detection/url_model.pkl"
DATASET_FILE = "detection/dataset_urls.csv"

def train_model():
    # Load full dataset
    df = pd.read_csv(DATASET_FILE)
    urls = df['url'].tolist()
    labels = df['label'].tolist()

    # Extract features
    texts = [extract_features(url) for url in urls]

    # Vectorize
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(texts)

    # Train model
    model = LogisticRegression()
    model.fit(X, labels)

    # Save model
    joblib.dump((model, vectorizer), MODEL_FILE)
    print("✅ Model trained with full dataset and saved!")







def extract_features(url):
    """Simple feature extractor: length, digits, special chars"""
    length = len(url)
    digits = sum(c.isdigit() for c in url)
    special = len(re.findall(r"[^a-zA-Z0-9]", url))
    domain = tldextract.extract(url).domain
    return f"{domain} length:{length} digits:{digits} special:{special}"



def predict_url(url):
    if not os.path.exists(MODEL_FILE):
        train_model()

    model, vectorizer = joblib.load(MODEL_FILE)
    features = extract_features(url)
    X = vectorizer.transform([features])
    pred = model.predict(X)[0]
    return "Phishing" if pred == 1 else "Safe"
