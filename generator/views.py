from django.template import loader
from django.http import HttpResponse
from django.shortcuts import render
from .models import RickRollInfo

# Create your views here.
def index(request):
    objects = RickRollInfo.objects.all()
    template = loader.get_template("generator/index.html")
    context = {"rick_roll_objects": objects}
    return HttpResponse(template.render(context, request))