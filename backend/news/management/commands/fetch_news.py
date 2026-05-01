import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from news.models import NewsArticle


SOURCE_PAGES = [
    {
        "source_name": "Hetauda Khabar",
        "category": "local",
        "url": "https://www.hetaudakhabar.com/category/local/",
    },
    {
        "source_name": "Hetauda Khabar",
        "category": "local",
        "url": "https://www.hetaudakhabar.com/category/main-news/",
    },
]


class Command(BaseCommand):
    help = "Fetch latest Hetauda news and save metadata to database"

    def handle(self, *args, **options):
        total_created = 0

        for source in SOURCE_PAGES:
            self.stdout.write(f"Fetching: {source['url']}")

            try:
                response = requests.get(
                    source["url"],
                    timeout=15,
                    headers={
                        "User-Agent": (
                            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                            "AppleWebKit/537.36 (KHTML, like Gecko) "
                            "Chrome/120.0 Safari/537.36"
                        )
                    },
                )
                response.raise_for_status()
            except requests.RequestException as error:
                self.stderr.write(f"Failed to fetch {source['url']}: {error}")
                continue

            soup = BeautifulSoup(response.text, "lxml")
            article_links = self.extract_article_links(soup)

            for article_url, title in article_links:
                created = self.save_article(
                    article_url=article_url,
                    title=title,
                    source_name=source["source_name"],
                    category=source["category"],
                )

                if created:
                    total_created += 1

        self.stdout.write(
            self.style.SUCCESS(f"News fetch completed. New articles added: {total_created}")
        )

    def extract_article_links(self, soup):
        links = []
        seen_urls = set()

        for tag in soup.find_all("a", href=True):
            title = tag.get_text(strip=True)
            url = tag["href"].strip()

            if not title:
                continue

            if len(title) < 15:
                continue

            if not url.startswith("http"):
                continue

            if "hetaudakhabar.com" not in url:
                continue

            if "/category/" in url:
                continue

            if "/author/" in url:
                continue

            if url in seen_urls:
                continue

            seen_urls.add(url)
            links.append((url, title))

        return links[:15]

    def save_article(self, article_url, title, source_name, category):
        if NewsArticle.objects.filter(original_url=article_url).exists():
            return False

        summary, image_url = self.fetch_article_details(article_url)

        NewsArticle.objects.create(
            title=title[:255],
            summary=summary,
            source_name=source_name,
            original_url=article_url,
            image_url=image_url,
            category=category,
            is_active=True,
        )

        self.stdout.write(f"Added: {title}")
        return True

    def fetch_article_details(self, article_url):
        try:
            response = requests.get(
                article_url,
                timeout=15,
                headers={
                    "User-Agent": (
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/120.0 Safari/537.36"
                    )
                },
            )
            response.raise_for_status()
        except requests.RequestException:
            return "", ""

        soup = BeautifulSoup(response.text, "lxml")

        summary = ""
        image_url = ""

        description_tag = soup.find("meta", attrs={"property": "og:description"})
        if description_tag and description_tag.get("content"):
            summary = description_tag["content"].strip()

        if not summary:
            meta_description = soup.find("meta", attrs={"name": "description"})
            if meta_description and meta_description.get("content"):
                summary = meta_description["content"].strip()

        if summary:
            summary = summary[:220]

        image_tag = soup.find("meta", attrs={"property": "og:image"})
        if image_tag and image_tag.get("content"):
            image_url = image_tag["content"].strip()

        return summary, image_url