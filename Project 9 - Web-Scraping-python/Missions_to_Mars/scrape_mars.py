import requests
import pandas as pd
import time
from bs4 import BeautifulSoup as bs
from splinter import Browser
import pymongo


def scrape():

    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)

    # create mars data dictionary and pass to mongo db
    mars_data = {}

    ### NASA Mars News
    url_news = 'https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest'
    response = requests.get(url_news)
    soup = bs(response.text, 'html5lib')
    news_title = soup.find('div', class_='content_title').find('a').text.strip()
    news_preview = soup.find('div', class_='rollover_description_inner').text.strip()

    mars_data['news_title'] = news_title
    mars_data['news_preview'] = news_preview

    print(news_title)
    print(news_preview)

    ### JPL Mars Space Images - Featured Image
    url_image = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(url_image)
    full_image_button = browser.find_by_id("full_image")
    full_image_button.click()
    more_info_button = browser.links.find_by_partial_text("more info")
    more_info_button.click()
    html = browser.html
    image_soup = bs(html, "html.parser")
    image_url = image_soup.find("figure").find("a").find("img")['src']
    featured_image_url = f"https://www.jpl.nasa.gov/{image_url}"

    mars_data['featured_image_url'] = featured_image_url
    print(featured_image_url)

    ### Mars Weather
    twitter = 'https://twitter.com/marswxreport?lang=en'
    twitter_html = requests.get(twitter)
    twitter_soup = bs(twitter_html.text, 'html5lib')

    mars_weather = twitter_soup.find('div', class_="js-tweet-text-container").find('p').text
    mars_weather_img = twitter_soup.find('div', class_="AdaptiveMedia-singlePhoto").find('img')['src']

    mars_data['mars_weather'] = mars_weather
    mars_data['mars_weather_img'] = mars_weather_img
    print(mars_weather)
    print(mars_weather_img)

    ### Mars Facts
    Mars_Facts = 'https://space-facts.com/mars/'
    tables = pd.read_html(Mars_Facts)
    df_Mars_Facts = tables[0]
    df_Mars_Facts.columns = ['Describtion', 'Value']
    df_Mars_Facts = df_Mars_Facts.set_index('Describtion')
    df_Mars_Facts = df_Mars_Facts.to_dict()
    
    mars_data['Mars_Facts'] = df_Mars_Facts
    print(mars_data['Mars_Facts'])

    ### Mars Hemispheres
    Hemispheres = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(Hemispheres)

    Hemispheres_html = browser.html
    Hemispheres_soup = bs(Hemispheres_html, 'html5lib')

    results = Hemispheres_soup.find_all('a', class_="itemLink")

    links = list()

    for result in results:
        link = result['href']
        url = f"https://astrogeology.usgs.gov{link}"
        print(url)
        links.append(url)
    links = list(set(links))

    hemisphere_image_urls = []
    for link in links:
        Hemispheres_repsonse = requests.get(link)
        soup_Hemispheres = bs(Hemispheres_repsonse.text, 'html5lib')
        img_url = soup_Hemispheres('li')[1].a['href']
        title = soup_Hemispheres.h2.text
        hemisphere_image_url = {'title' : title, 'img_url' : img_url}
        hemisphere_image_urls.append(hemisphere_image_url)

    mars_data['hemisphere_image_urls'] = hemisphere_image_urls
    print(hemisphere_image_urls)

    return mars_data

# export data to mongo db
def export_mongo():

    mars_data = scrape()

    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["mars_db"] 
    mars_collection = mydb['mars_collection']
    
    x = mars_collection.insert_one(mars_data)

    print(x.inserted_ids)

if __name__=="__main__":
    scrape()

