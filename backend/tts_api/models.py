from django.db import models

class AudioFile(models.Model):
    language = models.CharField(max_length=50, unique=True)
    url = models.URLField(max_length=500)

    def __str__(self):
        return f"{self.language} Audio"
