# downlow_alert

Downlow Alert notifies you of nearby stores, hooking into hardware functions with johnny-five to blink lights of different shades by store type

# Statement of Purpose

	You can think of it as basically a compass for certain qualities of neighborhoods.

	For example, if you start to enter a dangerous neighborhood, Downlow Alert will send a message to your hardware device board to flash its led red.

	If you start to enter a fun neighborhood, Downlow Alert will send a message to your board to flash its led purple.

	This can adapted according to your device's resources (flashing multiple lights at a time, or different colors), or your preferred events, included in the list below if you want to use the Google Places API.

# To Do

	Tasks remaining in this project include creating an algorithm involving local metrics to assess the fun and danger scores of the neighborhood you're approaching.

	This is meant for use on mobile, when you're in an unfamiliar neighborhood.

# Installation

	Run the following to setup the project:

	npm install
	browserify nodebot.js -o nodebot_bundle.js 

# Notes

	Designed with Arduino Uno in mind, but applicable to all devices that support RGB color events.

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
