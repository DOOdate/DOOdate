from core.services.notify_user import notify_user
from parser.models import Course, Syllabus, PolicyPeriod, Deadline, User
from django.core.management.base import BaseCommand, CommandError
from time import sleep
from django.utils import timezone
from datetime import timedelta
# WILL NOT WORK UNTIL LOGIN IS DONE
# CURRENTLY, WHEN ADDING A COURSE, USER IS NULL

while True:
    users = User.objects.all()
    for user in users: # loop through all users
        courses = Course.objects.filter(user=user)
        for course in courses: # loop through all courses for that user
            deadlines = Deadline.objects.filter(course=course)
            for deadline in deadlines: # loop through all deadlines for that course
                now = timezone.now()
                if now + timedelta(days=2) <= deadline.due_date <= now + timedelta(days=2, minutes=1): # if deadline is in 2 days
                    notify_user(user.notification_token, course.course_code, deadline.title + " is due in 2 days")
    sleep(60)  # wait 60 seconds (1 min)