from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from django.core import serializers
from .models import Lineup, Event
import json


def index(request):
    template = 'habitat/index.html'
    return render(request, template)

def directions(request):
    template = 'habitat/directions.html'
    return render(request, template)

# Get the lineup data, with an optional filter by event_id
def get_lineup_info(request, event_id=None):
    # If provided, filter lineup based on event ID
    if event_id:
        event = get_object_or_404(Event, pk=event_id)
        results = Lineup.objects.filter(event=event)
    # If event_id not provided, get all lineup data
    else:
        results = Lineup.objects.all()

    # Prepare data for serialization
    formatted_results = [
        {
            'model': 'habitat.lineup',
            'pk': lineup.pk,
            'fields': {
                'artist_name': lineup.artist_name,
                'genre': lineup.genre,
                'start_time': lineup.formatted_start_time(),
                'end_time': lineup.formatted_end_time(),
                'day_of_week': lineup.day_of_week,
                'time_period': lineup.time_period,
                'event': lineup.event_id,
            }
        }
        for lineup in results
    ]

    json_data = json.dumps(formatted_results)
    return HttpResponse(json_data, content_type='application/json')
