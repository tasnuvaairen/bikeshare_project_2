from flask import Flask, render_template, jsonify
from pymongo import MongoClient
import json
import requests
import time



# Establish connection with MongoDB. The default port used by MongoDB is 27017
conn='mongodb://localhost:27017'
client = MongoClient(conn)

# Declare the database
db=client.bikeshareDB

# Declare the collection for  bike companies
bike_companies = db.companies

#Empty bike_companies collection if exist
db.bike_companies.drop()

url1 = 'http://api.citybik.es/v2/networks'
response1= requests.get(url1)
data = response1.json()
bike_companies_ids=[]
for keys,values in data.items():
    for i in range (0, len(values)):
        bike_companies_ids.append(values[i]['id'])
        db.bike_companies.insert_one(values[i])


#Add urs for the additional information

urls=[]
for i in range(0, len(bike_companies_ids)):
    urls.append(url1 +"/" + bike_companies_ids[i])


for i in range(0, len(urls)):
   
    response=requests.get(urls[i])
    company_id=bike_companies_ids[i]
    stations_data=response.json()
    time.sleep(1)
    print(f"{i} +  {urls[i]}")
    for keys, values in stations_data.items():
        stations=values['stations']
    
    db.bike_companies.update_one({"id":company_id},{"$set":{"stations":stations}})
   
