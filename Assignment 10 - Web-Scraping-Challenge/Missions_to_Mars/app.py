from flask import Flask, render_template
import pymongo
import scrape_mars

app = Flask(__name__)

@app.route("/scrape")
def execute_scrape():
    scrape_mars()

@app.route("/")
def render_html():
    # extract data from local mongodb 
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["mars_db"] 
    mars_collection = mydb['mars_collection']
    mars_data = mars_collection.find_one()  

    # render html 
    return render_template("index.html", mars_data=mars_data)


if __name__ == "__main__":
    app.run(debug=True)