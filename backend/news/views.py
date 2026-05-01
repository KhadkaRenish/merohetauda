from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import NewsArticle
from .serializers import NewsArticleSerializer


class NewsArticleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NewsArticleSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return NewsArticle.objects.filter(is_active=True)