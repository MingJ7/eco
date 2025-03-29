import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename
from dotenv import dotenv_values
from pymongo import MongoClient
from bson.objectid import ObjectId
from ultralytics import YOLO, settings
import requests

# Load a model
model = YOLO(os.path.realpath(r"best.pt"))  # load a custom model

config = dotenv_values(".env")
active_list = []
all_sides = []
side_name_to_id_map = dict()

UPLOAD_FOLDER = './'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000 #16 MB

mongodb_client = MongoClient(config["MONGODB_URI"])
database = mongodb_client["EconomicRice"]

def getListOfSides():
    active_list.clear()
    all_sides = database["Sides"].find({}).to_list()
    for side in all_sides:
        print(side)
        side_name_to_id_map[side["name"]] = side["_id"]
        if side["expected_remainder"] > 0:
            active_list.append(side["name"])

def getListOfSidesWebAPI():
    r = requests.get("https://" +  config["NEXT_URL"] + "/api/side", verify=False)
    all_sides = r.json()
    for side in all_sides:
        print(side)
        side_name_to_id_map[side["name"]] = side["_id"]
        if side["expected_remainder"] > 0:
            active_list.append(side["name"])

def updateMongoDB(to_remove, to_add):
    for item in to_remove:
        database['Sides'].update_one({"_id": ObjectId(side_name_to_id_map[item])},{"$set": {"expected_remainder": 0}})
    for item in to_add:
        database['Sides'].update_one({"_id": ObjectId(side_name_to_id_map[item])},{"$set": {"expected_remainder": 40}})

def getChanges(imgpath):
    global active_list
    new_list = []
    #run ML here
    # Predict with the model
    results = model(imgpath, conf=0.5)  # predict on an image

    # Access the results
    for result in results:
        names = [result.names[cls.item()] for cls in result.boxes.cls.int()]  # class name of each box
        # confs = result.boxes.conf  # confidence score of each box
        new_list = names

    to_remove = [item for item in active_list if item not in new_list]
    active_list = list(filter(lambda side: side not in to_remove, active_list))
    to_add = set([item for item in new_list if item not in active_list])
    active_list.extend(to_add)
    return to_remove, list(to_add)

def getBoxes(imgpath):
    ret = dict()
    #run ML here
    # Predict with the model
    results = model(imgpath, conf=0.5)  # predict on an image

    # Access the results
    for result in results:
        names = [result.names[cls.item()] for cls in result.boxes.cls.int()]  # class name of each box
        # confs = result.boxes.conf  # confidence score of each box
        boxes = [box.xyxy.tolist() for box in result.boxes]
        # new_list = list(zip(names, boxes))
        ret = {"names": names, "boxes": boxes}

    return ret

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['POST'])
def upload_file():
    # check if the post request has the file part
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        imgpath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(imgpath)
        to_remove, to_add = getChanges(imgpath)
        to_add = [side_name_to_id_map[item] for item in to_add]
        to_remove = [side_name_to_id_map[item] for item in to_remove]
        return {"to_remove_list": to_remove, "to_add_list": to_add}

@app.route('/box', methods=['POST'])
def upload_file_box():
    # check if the post request has the file part
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        imgpath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(imgpath)
        return getBoxes(imgpath)

@app.route('/test', methods=['GET', 'POST'])
def upload_file_test():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            imgpath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(imgpath)
            to_remove, to_add= getChanges(imgpath)
            updateMongoDB(to_remove, to_add)
            return redirect(url_for('view_sides'))
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

@app.route('/view')
def view_sides():
    return active_list

if __name__ == "__main__":
    try:
        getListOfSidesWebAPI()
        app.run(debug=True)
    finally:
        mongodb_client.close()