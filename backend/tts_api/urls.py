from django.urls import path
from .views import AudioFileDetail

urlpatterns = [
    path('audio/<str:language>/', AudioFileDetail.as_view(), name='audio-detail'),
]
