import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename
from dotenv import dotenv_values
from pymongo import MongoClient
from ultralytics import YOLO

# Load a model
model = YOLO(r"C:\Users\Neko\Documents\ref\yolo\runs\detect\train8\weights\best.pt")  # load a custom model

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

def imageClassificaiton(img):
    global active_list
    # split the image up
    # run ML on each section?
    new_list = []
    to_remove = [item for item in active_list if item not in new_list]
    active_list = list(filter(lambda side: side not in to_remove, active_list))
    to_add = set([item for item in new_list if item not in active_list])
    active_list.extend(to_add)
    # mongodb code here
    for item in to_remove:
        database['Sides'].update_one({"_id": side_name_to_id_map[item]},{"$set": {"expected_remainder": 0}})
    for item in to_add:
        database['Sides'].update_one({"_id": side_name_to_id_map[item]},{"$set": {"expected_remainder": 40}})

def objectDectectionWay(imgpath):
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
    # mongodb code here
    for item in to_remove:
        database['Sides'].update_one({"_id": side_name_to_id_map[item]},{"$set": {"expected_remainder": 0}})
    for item in to_add:
        database['Sides'].update_one({"_id": side_name_to_id_map[item]},{"$set": {"expected_remainder": 40}})

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
            imgpath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(imgpath)
            objectDectectionWay(imgpath)
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

@app.route('/test')
def view_sides():
    # getListOfSides()
    return active_list

if __name__ == "__main__":
    try:
        getListOfSides()
        app.run(debug=True)
    finally:
        mongodb_client.close()