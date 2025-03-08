import os
from flask import Flask, flash, request, redirect, url_for, send_from_directory, render_template
from werkzeug.utils import secure_filename
from dotenv import dotenv_values
from pymongo import MongoClient
from bson.objectid import ObjectId
from ultralytics import YOLO

# Load a model
model = YOLO("path/to/best.pt")  # load a custom model

ObjectId()
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
    all_sides = database["Sides"].find({}).to_list()
    for side in all_sides:
        print(side)
        side_name_to_id_map[side["name"]] = side["_id"]
        if side["expected_remainder"] > 0:
            active_list.append(side["name"])

def imageClassificaiton(img):
    # split the image up
    # run ML on each section
    new_list = []
    to_remove = [item for item in active_list if item not in new_list]
    to_add = [item for item in new_list if item not in active_list]
    # mongodb code here
    for item in to_remove:
        database['Sides'].update_one({"_id": side_name_to_id_map(item)},{"expected_remainder": 0})
    for item in to_add:
        database['Sides'].update_one({"_id": side_name_to_id_map(item)},{"expected_remainder": 40})


def objectDectectionWay(img):
    new_list = []
    #run ML here
    # Predict with the model
    results = model("https://ultralytics.com/images/bus.jpg", conf=0.5)  # predict on an image

    # Access the results
    for result in results:
        # xywh = result.boxes.xywh  # center-x, center-y, width, height
        # xywhn = result.boxes.xywhn  # normalized
        # xyxy = result.boxes.xyxy  # top-left-x, top-left-y, bottom-right-x, bottom-right-y
        # xyxyn = result.boxes.xyxyn  # normalized
        names = [result.names[cls.item()] for cls in result.boxes.cls.int()]  # class name of each box
        # confs = result.boxes.conf  # confidence score of each box
        new_list = names

    to_remove = [item for item in active_list if item not in new_list]
    to_add = [item for item in new_list if item not in active_list]
    # mongodb code here
    for item in to_remove:
        database['Sides'].update_one({"_id": side_name_to_id_map(item)},{"expected_remainder": 0})
    for item in to_add:
        database['Sides'].update_one({"_id": side_name_to_id_map(item)},{"expected_remainder": 40})

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
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
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('download_file', name=filename))
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

@app.route('/test')
def view_sides():
    getListOfSides()
    return active_list

if __name__ == "__main__":
    try:
        app.run()
    finally:
        mongodb_client.close()