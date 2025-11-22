from parser.models import Course, Syllabus, PolicyPeriod, Deadline, User
from django.core.management.base import BaseCommand, CommandError
from core.services.notify_user import notify_user

class Command(BaseCommand):
    help = 'Demo command for use during the live demo in the presentation and on design day'

    def add_arguments(self, parser):
        parser.add_argument(
            '--language',
            type=str,
            help='Specify the language for the demo notification',
            default='en'
        )

    def handle(self, *args, **options):
        language = options['language']
        user = User.objects.first()
        if language == 'en':
            notify_user(user, 'GNG2101', 'Design Day Presentation is due in 2 days')
        elif language == 'fr':
            notify_user(user, 'GNG2501', 'Presentation de la journée de conception est due dans 2 jours')