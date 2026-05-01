from django.contrib import admin
from .models import NewsArticle


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "source_name",
        "category",
        "is_active",
        "published_at",
        "created_at",
    )
    list_filter = ("source_name", "category", "is_active", "published_at")
    search_fields = ("title", "summary", "source_name")
    readonly_fields = ("created_at", "updated_at")