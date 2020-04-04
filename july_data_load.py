from flask import Flask, render_template, jsonify
from pymongo import MongoClient
import pandas as pd
import json
import csv
#import requests


# Establish connection with MongoDB. The default port used by MongoDB is 27017
conn='mongodb://localhost:27017'
client = MongoClient(conn)

# Declare the database
db=client.bikeshareDB

# Declare the collection for CitiBike NYC
ny_citibike = db.nyc_bikes


#Empty bike_companies collection if exist
db.ny_citibike.drop()

file= "static/data/201907-citibike-tripdata.csv"

data = pd.read_csv(file)

#convert data to JSON format
data_json = json.loads(data.to_json(orient='records'))

ny_citibike.insert_many(data_json)

