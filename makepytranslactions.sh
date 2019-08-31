#!/bin/bash

pybabel extract -F translations/babel.cfg -o translations/messages.pot .
pybabel update -i translations/messages.pot -d translations
poedit translations/fr/LC_MESSAGES/messages.po
pybabel compile -d translations
