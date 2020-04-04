# Dependencies
from bs4 import BeautifulSoup
import requests

#from splinter import Browser

import re

import pandas as pd

import pymongo

def get_global_list_mongodb(conn_string) :
	conn = conn_string
	client = pymongo.MongoClient(conn)

	db = client.citibikeDB

	citibike_collection = db.citibike_global

	cursor = citibike_collection.find().limit(1)#.sort({$natural:-1})

	#for record in cursor :
		#print(record)
		#for k in record :
			#print(k)
	
	data_dict = cursor[0]
	del data_dict["_id"]
	#print(data_dict)

	print("Done reading from global DB.")	

	return data_dict

def get_ny_list_mongodb(conn_string, date, max_results) :
	conn = conn_string
	client = pymongo.MongoClient(conn)

	db = client.citibike_feb

	ny_collection = db.citibike_feb_plot

	#cursor = ny_collection.find({"starttime" : "2/1/19 0:00"}).limit(10)
	#cursor = ny_collection.find({"starttime" : "2019-02-01 00:02:04.0010"}).limit(10)

	#date = "12"
	#query_string = "2/" + str(date) + "/.*"

	#date = "05"
	query_string = "2019-02-" + str(date) #+ "/.*"

	cursor = ny_collection.find({"starttime" : {"$regex" : query_string}}).limit(max_results)

	data_dict = []

	csv_result_string = "";

	#csv_result_string = "tripduration,bikeid,usertype,birthyear,gender\n"
	csv_result_string = "tripduration,bikeid,subscribertype,birthyear,gender\n"

	for record in cursor :
		#print(record)
		tripduration = str(record["tripduration"])
		bikeid = str(record["bikeid"])
		gender = str(record["gender"])
		birth_year = str(record["birth year"])
		usertype = str(record["usertype"])

		#csv_result_string = csv_result_string + tripduration + "," + bikeid + "," + usertype + "," + birth_year + "," + gender + "\n"

		# hacks
		age = 2019 - record["birth year"]

		usertypeCode = 0

		if usertype == "Subscriber" : 
			usertypeCode = 1
		elif usertype == "Customer" :
			usertypeCode = 2	

		csv_result_string = csv_result_string + tripduration + "," + bikeid + "," + str(usertypeCode) + "," + str(age) + "," + gender + "\n"

		#print(csv_result_string)
		data_dict.append(record)

	#print(csv_result_string)	

	print("NY DB query found " + str(len(data_dict)) + " records.") 

	print("Done reading from NY DB.")

	return csv_result_string #data_dict 

# Test code
def main():
	#get_global_list_mongodb('mongodb://localhost:27017')
	get_ny_list_mongodb('mongodb://localhost:27017', "05", 25)
	print("Done.")

if __name__ == "__main__":
    main()	