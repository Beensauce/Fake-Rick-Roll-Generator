from django import forms
from .models import RickRollInfo

class RickRollForm(forms.ModelForm):
    class Meta:
        model = RickRollInfo
        fields = ['title', 'description', 'image', 'custom_message']