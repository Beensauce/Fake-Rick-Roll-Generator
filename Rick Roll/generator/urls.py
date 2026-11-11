from django.urls import path
from . import views
from django.contrib.sitemaps.views import sitemap
from .sitemaps import StaticViewSitemap
from django.views.generic import TemplateView

sitemaps = {
    'static': StaticViewSitemap,
}

urlpatterns = [
    path('', views.index, name='index'),
    path('about', views.about, name='about'),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='sitemap'),
    path(
        "robots.txt",
        TemplateView.as_view(template_name="robots.txt", content_type="text/plain"),
        name="robots",
    ),
    path('<str:special_code>', views.rickRoll, name='generated-url'),
    path('analytics/<str:special_code>', views.analytics, name='analytics'),
    path('<str:special_code>/verify', views.vertify_click, name='human-verify'),
] 