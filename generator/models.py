from django.db import models

# Create your models here.
class RickRollInfo(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField()
    image = models.ImageField(upload_to="thumbnails", blank=True, null=True)

    def __str__(self):
        return self.title