import pymongo
import pandas as pd
import json
import os

def import_csvfile(filepath):
	mng_client = pymongo.MongoClient('localhost', 27017)
	mng_db = mng_client['citibike_feb'] # Replace mongo db name
	collection_name = 'citibike_feb_plot' # Replace mongo db collection name
	db_cm = mng_db[collection_name]
	cdir = os.path.dirname(__file__)
	file_res = os.path.join(cdir, filepath)
	data = pd.read_csv(file_res)
	data_json = json.loads(data.to_json(orient='records'))
	db_cm.remove()
	db_cm.insert(data_json)

if __name__ == "__main__":
	filepath = 'static/data/201902-citibike-tripdata.csv' # pass csv file path
	import_csvfile(filepath)
	#print("Done.")
