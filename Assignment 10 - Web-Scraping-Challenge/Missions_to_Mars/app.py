from flask import Flask, render_template
import scrape_mars

mars_date = scrape_mars.scrape()
print(mars_date)

app = Flask(__name__)

@app.route("/scrape")
def echo_scrape():
    result = scrape_mars.scrape()
    print(result)

@app.route("/")
def echo():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)