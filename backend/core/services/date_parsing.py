import datetime
from math import ceil
from dateutil import parser as dateparser

# Hardcoded start date. This would need to be changed if the app is used in another semester
START = datetime.datetime(2025, 8, 31, 0, 0 ,0) # The first day of the week which the semester starts (Sunday for worst case)
INVALID = datetime.datetime(1, 1, 1, 0, 0, 0)

def relative_date_to_absolute(date: str) -> datetime.datetime:
    date = date.lower()
    if date.startswith('week'):
        try:
            weeknum = int(date[4:])
            return START + datetime.timedelta(weeks=max(weeknum-1, 0)) # Week 1 likely means 0 weeks offset from start
        except ValueError:
            return INVALID
    elif date.startswith('lecture'):
        try:
            """
            Some classes have 1 lecture per week, some 2 per week.
            Some classes will have only 1 lecture in the first week since it might start on a wednesday, others 2.
            Most cases could likely be resolved by having the parsing lecture times from the syllabus.
            Here we will assume that the class has 2 lectures per week and the first week had 2 lectures.
            """
            lecturenum = int(date[7:])
            return START + datetime.timedelta(weeks=max(ceil(lecturenum/2)-1, 0))
        except ValueError:
            return INVALID
    return INVALID


def str_to_datetime(date: str) -> datetime.datetime:
    date = date.lower()
    if date.startswith('week') or date.startswith('lecture'):
        return relative_date_to_absolute(date)
    if 'tba' in date or 'tbd' in date:
        return INVALID
    return dateparser.parse(date, fuzzy=True)

