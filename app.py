from flask import Flask, render_template, jsonify
from pymongo import MongoClient
import pymongo
import json

from app_db import get_global_list_mongodb
from app_db import get_ny_list_mongodb

# Flask setup
app = Flask(__name__)


globalData=[]
nycData_jan=[]
nycData_apr=[]
nycData_july=[]
nycData_oct=[]
nycData_feb=[]

# Flask Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home')
def home():
    return render_template('index.html')



@app.route('/stations1')
def stations1():
    return render_template('stations1.html')

@app.route('/citibike')
def citibike():
    return render_template('citibike.html')

@app.route('/nyc_stat')
def nyc():
    return render_template('nyc_stat.html')

@app.route('/age')
def nyc_total_trips():
    return render_template('nyc_age.html')

@app.route('/citibike_stat')
def filter():
    return render_template('blank1.html')

#to clear cache
@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r



#To get data from MongoDB
@app.before_first_request
def loadGlobal():
    conn='mongodb://localhost:27017'
    client = MongoClient(conn)
    db=client.bikeshareDB
    stations = db.bike_companies.find()

    #global data load 
    data=[]
    global globalData
    
    for station in stations:
        
        data.append({'id': station['id'],'name': station['name'], 'country': station['location']['country'], 'city': station['location']['city'],
        'lat': station['location']['latitude'], 'lng': station['location']['longitude'], 'stations':station['stations']})
        
    globalData=data

    #January data load
    trips = db.nyc_bikes_jan.find()
    
    data=[]
    i=0
    global nycData_jan
    for trip in trips:    
        if (i>=100000): 
            break
        data.append({'duration':trip['tripduration'], 'gender':trip['gender'], 'birth_year':trip['birth year']})  
        i=i+1

    nycData_jan=data


    #February data load
    trips = db.nyc_bikes_feb.find()
    
    data=[]
    i=0
    global nycData_feb

    for trip in trips:    
        if (i>=100000): 
            break
        data.append({'duration':trip['tripduration'], 'gender':trip['gender'], 'birth_year':trip['birth year']})  
        i=i+1
    
    nycData_feb=data

    #April data load
    trips = db.nyc_bikes_apr.find()
    
    data=[]
    i=0
    global nycData_apr

    for trip in trips:    
        if (i>=100000): 
            break
        data.append({'duration':trip['tripduration'], 'gender':trip['gender'], 'birth_year':trip['birth year']})  
        i=i+1
    
    nycData_apr=data

    #July data load
    trips = db.nyc_bikes.find()
    data=[]
    i=0
    global nycData_july

    for trip in trips:    
        if (i>=100000): 
            break
        data.append({'duration':trip['tripduration'], 'gender':trip['gender'], 'birth_year':trip['birth year']})  
        i=i+1

    nycData_july=data
    
    #October data load
    trips = db.nyc_bikes_oct.find()
    
    data=[]
    i=0
    global nycData_oct

    for trip in trips:    
        if (i>=100000): 
            break
        data.append({'duration':trip['tripduration'], 'gender':trip['gender'], 'birth_year':trip['birth year']})  
        i=i+1

    nycData_oct=data

    

@app.route('/stationlocations') 
def stationlocation():
    return {'companies':globalData}

@app.route("/global_list")
def global_list_filter():
    return render_template("global_list.html")


@app.route("/ny_plot")
def ny_plot():
    return render_template("ny_plot.html")

@app.route("/get_ny_list_db/<start_date>/<max_results>") # not user url
def get_ny_list_db(start_date, max_results):
    print("Fetching data ... ")
    db_conn_string = 'mongodb://localhost:27017'
    return get_ny_list_mongodb(db_conn_string, start_date, int(max_results))

@app.route('/nyc_data_jan')
def jan_nycdata():
    return {'trips':nycData_jan}

@app.route('/nyc_data_feb')
def feb_nycdata():
    return {'trips':nycData_feb} 

@app.route('/nyc_data_apr')
def apr_nycdata():
    return {'trips':nycData_apr} 

@app.route('/nyc_data_july')
def july_nycdata():
    return {'trips':nycData_july} 

@app.route('/nyc_data_oct')
def oct_nycdata():
    return {'trips':nycData_oct} 


if __name__ == '__main__':
    app.run(debug=True)