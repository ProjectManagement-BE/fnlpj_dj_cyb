from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Run Cyber Security Chatbot"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("🤖 Running Cyber Security Chatbot..."))
        self.stdout.write("Chatbot ready to answer security questions...")
        self.stdout.write(self.style.SUCCESS("✅ Chatbot Session Ended"))
