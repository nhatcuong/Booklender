from flask import jsonify

def getData(req):
    if len(req.form):
        return req.form
    if req.json:
        return req.json
    if req.args:
        return req.args

def getError(msg):
    return jsonify({"error": msg})


def getSuccess(msg):
    return jsonify({"success": msg})