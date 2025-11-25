from core.services import setup_django
setup_django.setup_django()
from parser.models import Course, User

def new_user():
    u = User()
    u.save()
    c = Course()