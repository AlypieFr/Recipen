import random
import string

from flask import session
from flask_babel import gettext as _

from settings import SITE_NAME


def random_string(string_length=50):
    """Generate a random string of letters and digits """
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choice(letters_and_digits) for i in range(string_length))


def is_authenticated():
    return "is_authenticated" in session and session["is_authenticated"] is True


def get_title(endpoint, title=None):
    if title is not None:
        title = title + " | " + SITE_NAME
    elif endpoint == "/panel/profile":
        title = _("User profile") + " | " + SITE_NAME
    elif endpoint.startswith("/panel"):
        title = _("Panel") + " | " + SITE_NAME
    elif endpoint == "/login":
        title = _("Login") + " | " + SITE_NAME
    elif endpoint == "/register":
        title = _("Register") + " | " + SITE_NAME
    else:
        title = SITE_NAME
    return title
