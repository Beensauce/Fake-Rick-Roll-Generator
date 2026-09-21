from django.db.models import F
from django.db.models.aggregates import Count
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, redirect, render
from .forms import RickRollForm
from .models import RickRollInfo, AnalyticData
from django.contrib import messages
from django.contrib.gis.geoip2 import GeoIP2
from django_ratelimit.decorators import ratelimit

# Create your views here.

# Base view for the index page

@ratelimit(key='ip', rate='150/h')
def index(request):
    form = RickRollForm(request.POST, request.FILES)
    if form.is_valid() and request.method == 'POST':
        rick_roll_info = form.save(commit=False)
        rick_roll_info.save()

        # Finding the link to the rick roll
        relative_url= rick_roll_info.get_relative_url()
        absolute_url = request.build_absolute_uri(relative_url)

        # Creating context to pass
        context = {
            'title': rick_roll_info.title,
            'description': rick_roll_info.description,
            'image': rick_roll_info.image.url if rick_roll_info.image else None,
            'code': rick_roll_info.code,
            'link': absolute_url,
        }

        # Store context in session
        request.session['rick_roll_data'] = context
        messages.success(request, 'Rick Roll created successfully!')
        
        return redirect('index')  # Redirect to the same page

    rick_roll_data = request.session.pop('rick_roll_data', None)
    context = {
        'form': form,
        'rick_roll_data': rick_roll_data,
    }

    return render(request, 'index.html', context)


# Rick roll site
def rickRoll(request, special_code):
    # Getting country data
    ip_address = request.META.get('HTTP_X_FORWARDED_FOR')
    # Handle local testing (127.0.0.1 won't return a country)
    if ip_address == '127.0.0.1' or ip_address == 'localhost':
        ip_address = '8.8.8.8' 
    g = GeoIP2()
    country = g.country(ip_address)['country_name'] if ip_address else 'Unknown'

    if not request.user_agent.is_bot:
        # This way works, but if 2 ppl use it at the same time it causes errors
        # data = get_object_or_404(RickRollInfo, code=special_code)
        # data.views += 1
        # data.save()
        
        # This way is better, uses the F() expression, doesn't run methods in save() in models.py. So won't open the image and waste resources
        data =  RickRollInfo.objects.filter(code=special_code).update(views=F('views') + 1)
        data = get_object_or_404(RickRollInfo, code=special_code)
        # Creation click info
        rick_roll_info = AnalyticData.objects.create(
            rick_roll = data,
            referer = request.META.get('HTTP_REFERER') or 'Unknown', 
            user_device = request.user_agent.device.family or 'Direct URL',
            user_browser = request.user_agent.browser.family or 'Unknown',
            user_os = request.user_agent.os.family or 'Unknown',
            user_country = country
        )

    data = get_object_or_404(RickRollInfo, code=special_code)

    context = {
        'data': data
    }

    return render (request, 'fake-link.html', context)


# Analytics view
def analytics(request, special_code):
    
    rick_roll = get_object_or_404(RickRollInfo, code=special_code)
    relative_url= rick_roll.get_relative_url()
    absolute_url = request.build_absolute_uri(relative_url)

    rick_roll_data = AnalyticData.objects.filter(
        rick_roll=rick_roll
    ).order_by('-time_opened', '-id')

    # Count views by country
    country_data = countData(rick_roll_data, 'user_country')

    # Count views by browser
    browser_data = countData(rick_roll_data, 'user_browser')

    # Count views by device
    device_data = countData(rick_roll_data, 'user_device')

    # Count views by OS
    os_data = countData(rick_roll_data, 'user_os')

    # Count views by referer
    referer_data = countData(rick_roll_data, 'referer')

    click_paginator = Paginator(rick_roll_data, 25)
    click_page = click_paginator.get_page(request.GET.get('page'))

    context = {
        'rickRoll': rick_roll,
        'absolute_url': absolute_url,
        'rickRollData': click_page,
        'clickPage': click_page,
        'countryData': country_data,
        'browserData': browser_data,
        'deviceData': device_data,
        'osData': os_data,
        'refererData': referer_data
    }

    return render(request, 'analytics.html', context)


def countData(rick_roll_data, user_information):
    data = rick_roll_data.values(user_information).annotate(count=Count('id')).order_by('-count')
    total_data = list(data[:3])
    others_count = 0
    for i in data[3:]:
        others_count += i['count']

    if others_count > 0:
        total_data.append({ user_information: 'Others', 'count': others_count})
    return total_data