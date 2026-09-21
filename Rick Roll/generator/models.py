import secrets
from django.urls import reverse
from django.db import models
from PIL import Image
from django.utils.text import slugify

# Create your models here.
class RickRollInfo(models.Model):
    code = models.CharField(blank=True, null=True)
    title = models.CharField(max_length=300)
    description = models.TextField()
    image = models.ImageField(upload_to='thumbnails', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    custom_message = models.TextField(blank=True, null=True)
    views = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.code:
            clean_slug = slugify(self.title) or "rickroll"
                        
            # Option A: Timestamp suffix (mama-mia-20260812122155)
            # timestamp = timezone.now().strftime("%Y%m%d%H%M%S")
            # self.code = f"{clean_slug}-{timestamp}"
            
            # Option B: Short random hash suffix (mama-mia-a1b2c3)
            random_hash = secrets.token_hex(4)
            self.code = f"{clean_slug}-{random_hash}"

        super().save(*args, **kwargs)   
        if self.image:
            img = Image.open(self.image.path)

            if img.height > 630 or img.width > 1200:
                output_size = (1200, 630)
                img.thumbnail(output_size)
                img.save(self.image.path)

    def get_relative_url(self):
        return reverse('generated-url', args=[self.code])

    def __str__(self):
        return self.title


class AnalyticData(models.Model):
    rick_roll = models.ForeignKey(RickRollInfo, on_delete=models.CASCADE)
    referer = models.CharField(max_length=300)
    user_device = models.CharField(max_length=300, blank=True, null=True)
    user_browser = models.CharField(max_length=300, blank=True, null=True)
    user_os = models.CharField(max_length=300, blank=True, null=True)
    user_country = models.CharField(max_length=300, blank=True, null=True)
    time_opened = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.rick_roll.title} from {self.user_country}"
