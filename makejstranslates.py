#!/usr/bin/env python3

import json
import os
import re
import subprocess

from collections import OrderedDict


def main(locale):
    out = subprocess.Popen(["pcregrep", "-rh", "-o1", "tr\\(['\"]([^'\"\\,]+)['\"]\\)", "static/component",
                            "static/vue", "static/js/session.js"], stdout=subprocess.PIPE)

    items = [(i, None) for i in out.communicate()[0].decode("utf-8").split("\n") if i != ""]

    out = subprocess.Popen(["pcregrep", "-rh", "-o1", "-o2", "--om-separator=\"|||\"",
                            "tr\\(['\"]([^'\"]+)['\"],\\s*['\"]([^'\"]+)['\"]\\)", "static/component",
                            "static/vue", "static/js/session.js"], stdout=subprocess.PIPE)

    items += [tuple(i.replace("\"", "").replace("'", "").split("|||"))
              for i in out.communicate()[0].decode("utf-8").split("\n") if i != ""]

    # Make unique:
    items = set(items)

    locale_file = f"static/js/locale/{locale}.js"
    data = {}
    if os.path.exists(locale_file):
        with open(locale_file, "r", encoding="utf-8") as locale_f:
            content = ""
            for line in locale_f:
                line = line.rstrip()
                if re.match(r"^\s*" + locale + r"\s*=\s*{", line) is not None:
                    line = "{"
                if line == "};":
                    line = "}"
                content += line
            data = json.loads(content)
    for item in items:
        item_key = "|||".join(item) if item[1] is not None else item[0]
        if item_key not in data:
            data[item_key] = ""
    with open(locale_file, "w", encoding="utf-8") as locale_f:
        locale_f.write(locale + " = " + json.dumps(OrderedDict(sorted(data.items())), indent=4,
                                                   ensure_ascii=False) + ";")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Update JS translates locale file with new translates found in code")
    parser.add_argument("-l", "--locale", help="Locale name (example: fr)", required=True)

    args = parser.parse_args()

    main(args.locale)
