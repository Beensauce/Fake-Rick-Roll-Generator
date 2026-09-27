from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:special_code>', views.rickRoll, name='generated-url'),
    path('analytics/<str:special_code>', views.analytics, name='analytics'),
    path('<str:special_code>/verify', views.vertify_click, name='human-verify'),
] 