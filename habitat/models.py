from django.db import models


class Event(models.Model):
    event_name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.event_name


class Lineup(models.Model):
    DAY_OF_WEEK = [
        (0, "Monday"),
        (1, "Tuesday"),
        (2, "Wednesday"),
        (3, "Thursday"),
        (4, "Friday"),
        (5, "Saturday"),
        (6, "Sunday"),
    ]

    TIME_PERIOD = [
        (0, "Morning (06:00 - 12:00)"),
        (1, "Afternoon (12:00 - 18:00)"),
        (2, "Evening (18:00 - 00:00)"),
        (3, "Early Morning (00:00 - 06:00)"),
    ]

    artist_name = models.CharField(max_length=100)
    genre = models.CharField(max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()
    day_of_week = models.IntegerField(choices=DAY_OF_WEEK)
    time_period = models.IntegerField(choices=TIME_PERIOD)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    def __str__(self):
        return self.artist_name
