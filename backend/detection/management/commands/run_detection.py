from django.core.management.base import BaseCommand
from detection.ml_model import predict_url

class Command(BaseCommand):
    help = "Run the AI/ML Threat Detection module"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("🔍 Running Threat Detection Module..."))
        test_urls = [
            "http://paypal.com.secure-login.co",
            "https://www.google.com"
        ]
        for url in test_urls:
            result = predict_url(url)
            self.stdout.write(f"{url} => {result}")
        self.stdout.write(self.style.SUCCESS("✅ Threat Detection Completed"))
