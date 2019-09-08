from flask import Blueprint, render_template
from flask_babel import gettext as _

from settings import SITE_NAME

page = Blueprint('panel', __name__)


@page.route('/panel')
def panel_home():
    return render_template("panel/basis.html", title=_("Panel") + " | " + SITE_NAME)