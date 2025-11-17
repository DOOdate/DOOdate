from core.services.setup_django import setup_django
setup_django()
from parser.models import User
import firebase_admin
from firebase_admin import messaging, credentials

cred = credentials.Certificate("./doodate-firebase-adminsdk.json") # pls nobody mess with my account
firebase_admin.initialize_app(cred)


def notify_user(user, title, body): # TESTED WORKING
    """
    Sends a notification to a user with the given title and body.
    """
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        token=user.notification_token,
    )
    response = messaging.send(message)
