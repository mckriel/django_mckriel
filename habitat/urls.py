from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('directions/', views.directions, name='directions'),
    path('get_lineup_info/', views.get_lineup_info, name='get_lineup_info'),
    path('get_lineup_info/<int:event_id>/', views.get_lineup_info, name='get_lineup_info_with_event_id'),
]
