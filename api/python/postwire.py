"""Tiny helper shared by the Python examples. Needs `requests` (pip install requests).

The API key comes from the environment: export POSTWIRE_API_KEY=pw_live_...
"""
import os
import sys

import requests

BASE = os.environ.get("POSTWIRE_BASE", "https://postwire.io")


def api_key():
    key = os.environ.get("POSTWIRE_API_KEY")
    if not key:
        sys.exit("Set POSTWIRE_API_KEY (dashboard -> API & MCP -> Copy key).")
    return key


def pw(method, path, body=None, timeout=90):
    """Call the API and return (status, json). 4xx answers carry a machine-readable `code`."""
    r = requests.request(method, BASE + path, json=body, timeout=timeout,
                         headers={"Authorization": f"Bearer {api_key()}"})
    try:
        return r.status_code, r.json()
    except ValueError:
        return r.status_code, {"raw": r.text}


def summary(body):
    """One line per network from a /api/post answer."""
    if not isinstance(body.get("results"), list):
        return str(body)
    lines = [f"posted to {body.get('posted')} network(s)"]
    for r in body["results"]:
        if r.get("ok"):
            lines.append(f"  ok   {r['platform']}  {r.get('url') or r.get('id') or ''}")
        else:
            lines.append(f"  FAIL {r['platform']}  {r.get('code', '')}  {r.get('fix') or r.get('error')}")
    return "\n".join(lines)
