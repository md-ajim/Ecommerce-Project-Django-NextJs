# models.py

from django.db import models
from django.utils import timezone
from datetime import timedelta

class OTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_valid(self):
        return timezone.now() <= self.created_at + timedelta(minutes=10) and not self.is_used
