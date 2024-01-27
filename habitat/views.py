from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404

from django.core import serializers
from .models import Lineup, Event


# Get the lineup data, with an optional filter by event_id
def get_lineup_info(request, event_id=None):
    # If provided, filter lineup based on event ID
    if event_id:
        event = get_object_or_404(Event, pk=event_id)
        results = Lineup.objects.filter(event=event)
    # If event_id not provided, get all lineup data
    else:
        results = Lineup.objects.all()

    # Serialize and return the data in JSON format
    json_data = serializers.serialize('json', results)
    return HttpResponse(json_data)
