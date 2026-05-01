from rest_framework import serializers
from .models import NewsArticle


class NewsArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = [
            "id",
            "title",
            "summary",
            "source_name",
            "original_url",
            "image_url",
            "category",
            "published_at",
            "created_at",
        ]