from django.http import HttpResponse
from django.shortcuts import render
from django.core import serializers
from .models import Lineup


def get_lineup_info(event_id=None):
    results = Lineup.objects.all()
    json_data = serializers.serialize('json', results)
    return HttpResponse(json_data)
