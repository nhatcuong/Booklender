from flask import request, Response, g
from functools import wraps
from models import User

def check_auth(username, password):
    user = User.query.filter_by(username = username).first()
    if user and user.password == password:
        g.user = user
        return True
    return False

def authenticate():
    """Sends a 401 response that enables basic auth"""
    return Response('Login required', 401, {'WWW-Authenticate': 'Basic realm="Login Required"'})

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated
