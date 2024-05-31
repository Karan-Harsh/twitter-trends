import uuid
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import pymongo

# Configure MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/twitter_trends")
db = client["twitter_trends"]
collection = db["trends"]

# Configure Selenium with ProxyMesh
proxy = "YOUR_PROXYMESH_URL"
chrome_options = Options()
chrome_options.add_argument(f"--proxy-server={proxy}")

# Set up WebDriver
driver = webdriver.Chrome(options=chrome_options)
driver.get("https://twitter.com/login")

# Log in to Twitter
username = driver.find_element(By.NAME, "session[username_or_email]")
password = driver.find_element(By.NAME, "session[password]")
username.send_keys("YOUR_TWITTER_USERNAME")
password.send_keys("YOUR_TWITTER_PASSWORD")
password.send_keys(Keys.RETURN)

# Wait for login to complete
time.sleep(5)

# Scrape the trending topics
trends = driver.find_elements(
    By.CSS_SELECTOR, "div[aria-label='Timeline: Trending now'] span.css-901oao"
)

trending_topics = [trend.text for trend in trends[:5]]

# Store results in MongoDB
unique_id = str(uuid.uuid4())
ip_address = "YOUR_PROXYMESH_IP"
end_time = datetime.now()

data = {
    "_id": unique_id,
    "trend1": trending_topics[0],
    "trend2": trending_topics[1],
    "trend3": trending_topics[2],
    "trend4": trending_topics[3],
    "trend5": trending_topics[4],
    "end_time": end_time,
    "ip_address": ip_address,
}

collection.insert_one(data)
driver.quit()
