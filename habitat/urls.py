from django.urls import path
from . import views


urlpatterns = [
    path("get-lineup-info", views.get_lineup_info, name='get_lineup_info'),
]
