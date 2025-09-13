from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import AudioFile
from .serializers import AudioFileSerializer

class AudioFileDetail(generics.GenericAPIView):
    serializer_class = AudioFileSerializer

    def get(self, request, language, format=None):
        try:
            # Case-insensitive lookup for language
            audio_file = AudioFile.objects.get(language__iexact=language)
            serializer = AudioFileSerializer(audio_file)
            return Response(serializer.data)
        except AudioFile.DoesNotExist:
            return Response(
                {"error": f"Audio file for language '{language}' not found."},
                status=status.HTTP_404_NOT_FOUND
            )

