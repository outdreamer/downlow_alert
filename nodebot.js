global.jQuery = require("jquery")

(function($){

	//initialize variables
	var colors_by_type = { starbucks : 'green', bar : 'gold', crime : 'red' };
	var types = [ starbucks, bar, crime ];
	var timeouts = [];

	//set events in dom
	$('#store_types').on('change', function(){

		//send type param to start function
		var type = $(this).val();
		alert('selected ' + type);
		stopTimer();
		start(type);

	});

	$('#reset').on('click', function() {

		$('#store_types').each(function(idx, sel) {
		  $(sel).find('option :eq(0)').attr('selected', true);
		});

	});

	//define functions

	//we would like to check the wifi/arduino connection at a large interval
	//and execute the location service at a small interval

	//if the wifi/arduino connection is null, 
	//we want to prevent the location service from executing (stop the timer)
	//and display an error message to the user saying we cant access the service in their zone

	function stopTimer() {

		for (var i = 0; i < timeouts.length; i++) {
			clearTimeout(timeouts[i]);
		}
		//quick reset of the timer array you just cleared
		timeouts = [];

	}

	function checkWifi() {

		var return_val = false;

		var test_url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';

		$.ajax({

			type: "get", 
			async: false,
			url: test_url,
			success: function (data, text) {
			    return_val = true;
			},
			error: function (request, status, error) {
			    alert(request.responseText);
			    return_val = false;
			}

		});

		console.log('check wifi ' + return_val);

	}

		function start(type) {
			alert('start');

			    timeouts.push( setTimeout(function () {

						var checkWifi = checkWifi();

						if (checkWifi) {

							var current_location = getLocation();

							if (typeof current_location == object) {

								alert(current_location);

								var nearestType = getNearestType(current_location, type);

				    			/* nearestType is object with properties: nearest_store_distance and nearest_store_type */
								if (nearestType != undefined && typeof nearestType == object) {
									var nearest_type_color = colors_by_type[nearestType];
									var flashedLight = flashLight(nearest_type_color);
								}

							} else if (typeof current_location == string) {

								alert('could not find current location');

							}

						}

			        if (exit) {
			          return;
			        }

		    }, 1000) );

		}

		function getLocation() {

			//fetch geocode
			//need to consider whether location will be irrelevant by the time it fetches the location
			//check speed of function with timestamp as param

			if (navigator.geolocation) {

			    var position = navigator.geolocation.getCurrentPosition(showPosition);

			    return position;

			} else {

			    return "Geolocation is not supported by this browser.";

			}

		}

		function findStores(type) {

			//find locations of nearby stores of certain type
			//returns array of locations
			//need to call apis that provide lat/long of starbucks, bars, high-crime neighborhoods

			/* stores is an object containing the lat,lng, and store_type of nearby stores within 5 k*/

		}

	    function distance(lat1, lon1, lat2, lon2, unit) {

	        var radlat1 = Math.PI * lat1/180;
	        var radlat2 = Math.PI * lat2/180;
	        var theta = lon1-lon2;
	        var radtheta = Math.PI * theta/180;
	        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	        dist = Math.acos(dist);
	        dist = dist * 180/Math.PI;
	        dist = dist * 60 * 1.1515;
	        if (unit=="K") { dist = dist * 1.609344 }
	        if (unit=="N") { dist = dist * 0.8684 }
	        return dist;

	}

		function getNearestType(current_location,type) {
			
			//need to return nearest type, or error if no types found within 5 k?
			//if they select a certain type, do we want to return distance instead?

			var current_lat = current_location.coords.latitude;
			var current_lng = current_location.coords.longitude;
			var stores = {};
			var distances = {};
			var min = Infinity, max = -Infinity;
			var i = 0;
			var k = 0;

			//returns nearest_store object
			var nearest_store = { nearest_store_type: "", nearest_store_distance: ""};

			if (type == null) {

				//get all types
				stores = findStores('all');

			} else {
				//get user specified types
				stores = findStores(type);

			}

			/* stores is an object containing the lat,lng, and store_type of nearby stores within 5 k*/

			//iterate through stores object to check distance from current location
			for (var store in stores) {

				console.log('iterating through nearby stores');

				if (stores.hasOwnProperty(store) {

					console.log(key + " -> " + p[key]);

	                var pointDistance = distance(current_lat, current_lng, store.lat, store.lng, 'K');

					pointDistance = pointDistance.toFixed(2);

					distances[i + '_' + store.store_type] = pointDistance;

					i++;

				}

			}

			for (var d in distances) {
				console.log('iterating through distances of stores object');
				if (distances.hasOwnProperty(d) {

					console.log(distances[d]);

				    if( distances[d] < min) {
				    	nearest_store.nearest_store_distance = distances[d];
				    	var nearest_store_type_split = d.split("_");
				    	nearest_store.nearest_store_type = nearest_store_type_split[1];
				    }

				    k++;
				}

			}

			//return distance to nearest store, and type of store that is nearest
			console.log('nearest store');
			console.log(nearest_store);

			return nearest_store;

		}

		function flashLight(type) {

			//execute call to arduino to flash a light
			var five = require("johnny-five"),
			  board,
			  led,
			  motor;

  			var board = new five.Board();

			board.on("ready", function() {

			  var led = new five.Led(13);
			  led.blink(500);
			  
			});
		}
});

