from django.contrib import admin
from .models import AnalyticData, RickRollInfo

# Register your models here.
admin.site.register(RickRollInfo)

@admin.register(AnalyticData)
class AnalyticDataAdmin(admin.ModelAdmin):
    readonly_fields = ['time_opened']