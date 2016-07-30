# downlow_alert

Downlow Alert notifies you of nearby stores, hooking into hardware functions with johnny-five to blink lights of different shades by store type

# Statement of Purpose

	You can think of it as basically a compass for certain qualities of neighborhoods.

	For example, if you start to enter a dangerous neighborhood, Downlow Alert will send a message to your hardware device board to flash its led red.

	If you start to enter a fun neighborhood, Downlow Alert will send a message to your board to flash its led purple.

	This can adapted according to your device's resources (flashing multiple lights at a time, or different colors), or your preferred events, included in the list below if you want to use the Google Places API.

# To Do

	Tasks remaining in this project include creating an algorithm involving local metrics to assess the fun and danger scores of the neighborhood you're approaching.

	Translate this to use nw so it's independent of browserify.

	This is meant for use on mobile, when you're in an unfamiliar neighborhood.

# Installation

	Run the following to setup the project if you'd like to use browserify instead of nwjs (not recommended):

		npm install
		browserify nodebot.js -o nodebot_bundle.js 

	The above is invalid if you want to use NW.

	If you want to use NW (recommended) and don't have it installed, you can download it here:

		http://nwjs.io/

	Take note of the directory path to your install, if you move it out of your default downloads folder. You'll be referencing the path to run the executable, unless you drag it into your project root folder (./downlow_alert).

	Full install instructions are here:
	
		http://docs.nwjs.io/en/latest/For%20Users/Getting%20Started/

	If you have nwjs installed on your computer, and are using a Mac, the directory path is:

		/PATH/nwjs.app/Contents/MacOS/nwjs

	where PATH represents the location where you've installed nwjs.

	If you drag nwjs.app to this project root, you'll be able to run your app with the following command:

		nw .

	Otherwise use the full path to the nwjs executable or add the path to your PATH variable so you can use the above syntax.

		/PATH/nwjs.app/Contents/MacOS/nwjs .

	The above command is run from project root.

	If you use nw instead of bundling your dependencies with browserify, you'll see a popup window instead of viewing index_bundle.html in the browser.

	If you want to use browserify, view index_bundle.html in the browser to test your output according to user store type selections.

	Copy config/sample_settings.json to config/settings.json and add your Google API key to the key element in the JSON inside settings.json.

# Notes

	Designed with Arduino Uno in mind, but applicable to all devices that support RGB colors.

# Example API Request

	Substitute your key and latitude/longitude in for the KEY string in the URL below, as well as the latitude and longitude of your location:
	
		https://maps.googleapis.com/maps/api/place/search/json?key=KEY&location=38.8961270,-77.0735960&radius=10000&type=bar&keyword=dragon

	Sample data returned from a Google Place API request is in the file: 
		sample_data.json

# Testing
	
	Run the following to receive a validation status from the nodebot workshop tool from project root:
		nodebot-workshop verify

# Additional Types

	Google Place Search supports the following place types in its type parameter:

	    accounting
	    airport
	    amusement_park
	    aquarium
	    art_gallery
	    atm
	    bakery
	    bank
	    bar
	    beauty_salon
	    bicycle_store
	    book_store
	    bowling_alley
	    bus_station
	    cafe
	    campground
	    car_dealer
	    car_rental
	    car_repair
	    car_wash
	    casino
	    cemetery
	    church
	    city_hall
	    clothing_store
	    convenience_store
	    courthouse
	    dentist
	    department_store
	    doctor
	    electrician
	    electronics_store
	    embassy
	    establishment (deprecated)
	    finance (deprecated)
	    fire_station
	    florist
	    food (deprecated)
	    funeral_home
	    furniture_store
	    gas_station
	    general_contractor (deprecated)
	    grocery_or_supermarket (deprecated)
	    gym
	    hair_care
	    hardware_store
	    health (deprecated)
	    hindu_temple
	    home_goods_store
	    hospital
	    insurance_agency
	    jewelry_store
	    laundry
	    lawyer
	    library
	    liquor_store
	    local_government_office
	    locksmith
	    lodging
	    meal_delivery
	    meal_takeaway
	    mosque
	    movie_rental
	    movie_theater
	    moving_company
	    museum
	    night_club
	    painter
	    park
	    parking
	    pet_store
	    pharmacy
	    physiotherapist
	    place_of_worship (deprecated)
	    plumber
	    police
	    post_office
	    real_estate_agency
	    restaurant
	    roofing_contractor
	    rv_park
	    school
	    shoe_store
	    shopping_mall
	    spa
	    stadium
	    storage
	    store
	    subway_station
	    synagogue
	    taxi_stand
	    train_station
	    transit_station
	    travel_agency
	    university
	    veterinary_care
	    zoo
