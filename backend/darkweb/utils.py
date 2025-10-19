import random

def search_darkweb(query: str):
    """
    Dummy darkweb search.
    Later: integrate with Tor/OSINT APIs.
    """
    # Pretend we queried some darkweb sources
    sample_results = [
        {"title": "Leaked database found", "source": "DarkForum1", "url": "http://darkweb.onion/db-leak"},
        {"title": "Credential dump", "source": "MarketX", "url": "http://darkweb.onion/creds"},
        {"title": "Phishing kit for sale", "source": "ForumZ", "url": "http://darkweb.onion/phish-kit"},
    ]
    return random.sample(sample_results, k=2)  # return 2 random results
