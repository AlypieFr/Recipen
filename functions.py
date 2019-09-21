from flask import session
import random
import string


def random_string(string_length=50):
    """Generate a random string of letters and digits """
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choice(letters_and_digits) for i in range(string_length))


def is_authenticated():
    return "is_authenticated" in session and session["is_authenticated"] is True
