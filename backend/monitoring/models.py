from django.db import models


class PacketEvent(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    src_ip = models.CharField(max_length=64)
    dst_ip = models.CharField(max_length=64)
    protocol = models.CharField(max_length=16)
    severity = models.CharField(max_length=8, default="low")

    class Meta:
        indexes = [
            models.Index(fields=["created_at"]),
            models.Index(fields=["protocol"]),
            models.Index(fields=["severity"]),
        ]

    def __str__(self):
        return f"{self.created_at} {self.src_ip}->{self.dst_ip} {self.protocol} {self.severity}"
