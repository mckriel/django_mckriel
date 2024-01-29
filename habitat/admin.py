from django.contrib import admin
from .models import Event, Lineup


class LineupAdmin(admin.ModelAdmin):
    list_display = ["artist_name", "genre", "start_time", "end_time", "day_of_week"]
    list_filter = ["day_of_week"]


admin.site.register(Event)
admin.site.register(Lineup, LineupAdmin)
