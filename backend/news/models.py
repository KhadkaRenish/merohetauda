from django.db import models


class NewsArticle(models.Model):
    CATEGORY_CHOICES = [
        ("local", "Local News"),
        ("development", "Development"),
        ("public_notice", "Public Notice"),
        ("politics", "Politics"),
        ("event", "Event"),
        ("other", "Other"),
    ]

    title = models.CharField(max_length=255)
    summary = models.TextField(blank=True)
    source_name = models.CharField(max_length=120, default="Hetauda Khabar")
    original_url = models.URLField(unique=True)
    image_url = models.URLField(blank=True)
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default="local"
    )
    published_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title