# import moduals

import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

# mapping database

engine = create_engine("sqlite:///resources/hawaii.sqlite")
Base = automap_base()
Base.prepare(engine, reflect=True)

Measurement = Base.classes.measurement
Station = Base.classes.station

session = Session(engine)

# create Flask

app = Flask(__name__)

# define route


@app.route("/")
def homepage():
    # List all routes that are available
    return(
        f"Avaiable Routes: <br/>"
        f"Date range from 2016-06-01 to 2017-06-01 <br/><br/>"

        f"/api/v1.0/precipitation <br/>"
        f"List of the Date and precipitation from 2016-06-01 to 2017-06-01 <br/><br/>"

        f"/api/v1.0/stations <br/>"
        f"List of the stations <br/><br/>"

        f"/api/v1.0/tobs <br/>"
        f"List of the Date and temperature from 2016-06-01 to 2017-06-01. <br/><br/>"

        f"/api/v1.0/yyyy-mm-dd <br/>"
        f"Average, Max and Min temperature for a given start date. <br/><br/>"

        f"/api/v1.0/yyyy-mm-dd/yyyy-mm-dd <br/>"
        f"Average, Max and Min temperature for a given date range. <br/><br/>"
    )

@app.route("/api/v1.0/precipitation")
def precipitation():
    query = session.query(Measurement.date, Measurement.prcp).\
    filter(Measurement.date > '2016-06-01').filter(Measurement.date < '2017-06-01' ).all()
    
    precipitation_list = [query]

    return jsonify(precipitation_list)

@app.route("/api/v1.0/stations")
def stations():

    query = session.query(Station.name, Station.station).all()

    station_list = []
    for result in query:
        row = {}
        row['name'] = result[0]
        row['station'] = result[1]
        station_list.append(row)
    return jsonify(station_list)

@app.route("/api/v1.0/tobs")
def temperature():
    query = session.query(Station.name, Measurement.date, Measurement.tobs).\
            filter(Measurement.date > "2016-06-01", Measurement.date < "2017-06-01").all()
    
    temp_list = []
    for temp in query:
        row = {}
        row['Station'] = temp[0]
        row["Date"] = temp[1]
        row["Temperature"] = temp[2]
        temp_list.append(row)

    return jsonify(temp_list)

@app.route('/api/v1.0/<date>')

def given_date(date):
    query = session.query(func.avg(Measurement.tobs), func.max(Measurement.tobs), func.min(Measurement.tobs)).\
        filter(Measurement.date > date).all()

    data_list = []

    for result in query:
        row = {}
        row['Date'] = f"From {date} to the last date"
        row['Average Temperature'] = result[0]
        row['Highest Temperature'] = result[1]
        row['Lowest Temperature'] = result[2]
        data_list.append(row)

    return jsonify(data_list)

@app.route('/api/v1.0/<start_date>/<end_date>')

def date_range (start_date, end_date):
    query = session.query(func.avg(Measurement.tobs), func.max(Measurement.tobs), func.min(Measurement.tobs)).\
        filter(Measurement.date > start_date, Measurement.date < end_date).all()

    data_list_range = []
        
    for result in query:
        row = {}
        row["Start Date"] = start_date
        row["End Date"] = end_date
        row["Average Temperature"] = result[0]
        row["Highest Temperature"] = result[1]
        row["Lowest Temperature"] = result[2]
        data_list_range.append(row)

    return jsonify(data_list_range)

if __name__ == "__main__":
    app.run(debug=True)