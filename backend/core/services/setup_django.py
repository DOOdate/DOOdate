import django
import os
import sys

def setup_django():
    if os.environ.get('DJANGO_SETTINGS_MODULE'): return

    PROJECT_ROOT = os.path.abspath(os.path.join(__file__, '../../'))

    if PROJECT_ROOT not in sys.path:
        sys.path.append(PROJECT_ROOT)

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'doodate.settings')
    django.setup()

