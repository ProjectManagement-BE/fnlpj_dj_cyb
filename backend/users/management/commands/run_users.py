from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Run User Awareness Module"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("👤 Running User Awareness Module..."))
        self.stdout.write("Calculating user awareness score...")
        self.stdout.write(self.style.SUCCESS("✅ User Awareness Completed"))
