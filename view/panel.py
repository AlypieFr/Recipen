import json
from flask import Blueprint, render_template, session, redirect, flash, url_for, request, Response, jsonify
from flask_babel import gettext as _
from flask_bcrypt import check_password_hash, generate_password_hash
from mongoengine.errors import DoesNotExist

from exceptions import InvalidPassword, NotActiveUser

from functions import is_authenticated
from settings import PASSWORD_HASH_ROUNDS

from model.user import User

page = Blueprint('panel', __name__, url_prefix="/panel")

@page.context_processor
def inject_default_data():
    return {
        "menus": [
            {
                "label": _("Home"),
                "href": url_for("panel.home"),
                "icon": "mdi-home"
            },
            {
                "label": _("User profile"),
                "href": url_for("panel.profile"),
                "icon": "mdi-face-profile"
            }
        ]
    }

@page.before_request
def before_request():
    if not is_authenticated():
        if "application/json" in dict(request.accept_mimetypes):
            return Response(response={"success": False, "message": _("Not authenticated")}, status=403,
                            mimetype="application/json")
        flash("error|" + _("Please login to continue"))
        return redirect(url_for("login", after=request.full_path, email=session["email"] if "email" in session else ""))


@page.route('/')
def home():
    return render_template("panel/basis.html")


@page.route('/profile')
def profile():
    return render_template("panel/basis.html")


@page.route('/profile', methods=['POST'])
def change_profile():
    data = json.loads(request.data)
    if data["email"] is None or data["email"] == "" or data["name"] is None or data["name"] == "":
        return Response(json.dumps({"success": False, "message": _("Missing required fields")}), status=409)
    email = data["email"]
    password = data["password"] if "password" in data and data["password"] else None
    new_password = data["new_password"] if "new_password" in data and data["new_password"] else None
    try:
        user = User.objects.get(email=email)
        if password is not None:
            if not check_password_hash(user.password, password):
                raise InvalidPassword()
        if not user.active:
            raise NotActiveUser()
    except (DoesNotExist, InvalidPassword):
        return Response(json.dumps({"success": False, "message": _("Incorrect current password")}), status=403)
    except NotActiveUser:
        return Response(json.dumps({"success": False, "message": _("Inactive user")}), status=403)
    user.name = data["name"]
    session["name"] = user.name
    if new_password is not None:
        user.password = generate_password_hash(data["new_password"], PASSWORD_HASH_ROUNDS).decode("utf-8")
    user.save()
    return jsonify(success=True,
                   message=_("User profile successfully updated"))


@page.route('/data/userinfo')
def get_user_infos():
    return jsonify(email=session["email"], name=session["name"])