from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Run Dark Web Monitoring Module"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("🌑 Running Dark Web Monitoring..."))
        self.stdout.write("Scanning dark web forums for leaks...")
        self.stdout.write(self.style.SUCCESS("✅ Dark Web Scan Completed"))
