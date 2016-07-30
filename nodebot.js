global.jQuery = require("jQuery")
(function($){
alert('after requiring jquery');
	var five = require("johnny-five");

	/*
	  to do:
		we would like to check the wifi/arduino connection at a large interval
		and execute the location service at a small interval

		if the wifi connection is bad, 
		we want to prevent the location service from executing (stop the timer)
		and display an error message to the user saying we cant access the service in their zone
	*/


	//initialize variables

		var colors_by_type = { bar : 'gold', liquor_store : 'green', hospital : 'red' };
		var types = [ 'bar', 'liquor_store', 'hospital' ];
		var timeouts = [];

	//set DOM events

		$('#store_types').on('change', function(){

			//send type param to start function
			var type = $(this).val();
			console.log('selected ' + type);
			stopEvents();
			start(type);

		});

		$('#reset').on('click', function() {

			$('#store_types').each(function(idx, sel) {
			  $(sel).find('option :eq(0)').attr('selected', true);
			});

		});

		//define functions

		function stopEvents() {

			for (var i = 0; i < timeouts.length; i++) {
				clearTimeout(timeouts[i]);
			}
			//quick reset of the timer array you just cleared
			timeouts = [];

		}

		function checkWifi() {

			var test_url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
			var wifi_status = false;

			$.ajax({

				type: "get", 
				async: false,
				url: test_url,
				success: function (data, text) {
				    wifi_status = true;
				},
				error: function (request, status, error) {
				    wifi_status = false;
				}

			});

			console.log('check wifi ' + wifi_status);
			return wifi_status;

		}

		function start(type) {

			stopEvents();

		    timeouts.push( setTimeout(function () {

				var checkWifi = checkWifi();

				if (checkWifi) {

					var current_location = getLocation();

					if (typeof current_location == "object") {

						alert("current_location");
						alert(current_location);

						var nearestType = getNearestType(current_location, type);

			    		/* nearestType is object with properties: nearest_store_distance and nearest_store_type */

						if (nearestType != undefined && typeof nearestType == object) {

							var nearest_type_color = colors_by_type[nearestType];
							var flashedLight = flashLight(nearest_type_color);

						}

					} else if (typeof current_location == "string") {

						console.log('could not find current location');

					}

				}


		    }, 10000) );

		}

		function getLocation() {

			//to do: check speed of function with timestamp as param

			if (navigator.geolocation) {

			    var position = navigator.geolocation.getCurrentPosition(showPosition);

			    return position;

			} else {

			    return "Can't find your current location from this browser.";

			}

		}

		function findStores(current_location, type) {

			// find locations of nearby stores of certain type

			/* stores is an object containing the lat,lng, and store_type of nearby stores within 5 k*/

			//multiple type queries are deprecated, can only use one type at a time and compare distances returned
			//var all_supported_types = 'bar|liquor_store|hospital'; 

			var stores = {};
			var google_url = '';
			var google_key = '';

			$.ajax({

				type: "get", 
				async: false,
				url: 'config/settings.json',
				success: function (data, text) {

				    google_key = data.key;
				    google_url = data.url;
				},
				error: function (request, status, error) {
					alert('here');
				    alert(request.responseText);
				}

			});

			var api_url = google_url;
			api_url = "&location=" + location.coords.latitude + ",";
			api_url += location.coords.longitude;
			api_url += '&radius=1000';
			api_url += type != 'all' ? '&type=' + this_type : '';
			api_url += keyword != '' ? '&keyword=' + keyword : '';

			$.ajax({

				type: "get", 
				async: false,
				url: api_url,
				success: function (data, text) {

				    if (data.status == "OK") {

				    	var results = data.results;
				    	var results_count = count(results);

				    	console.log('results count ' + results_count);
				    	console.log(results);

				    	if (results_count > 0) {

					    	for (var key in results) {

					    		var this_lat = results[key].geometry.location.lat;
					    		var this_lng = results[key].geometry.location.lng;
					    		var this_type = type;
					    		var this_store = { store_type: type, store_lat: this_lat, store_lng: this_lng };
					    		stores.push(this_store);

					    	}

				    	}

				    }
				},
				error: function (request, status, error) {
					alert('here');
				    alert(request.responseText);
				}

			});

			return stores;

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
			var j = 0;

			//returns nearest_store object
			var nearest_store = { nearest_store_type: "", nearest_store_distance: ""};

			if (type == null) {

				//get all types
				for (j = 0; j < types.length; j++) {

					console.log('finding nearby stores for type ' + types[j]);
					this_type_stores = findStores(current_location, types[j]);
					stores = stores + this_type_stores;

					j++;

				}

			} else {

				//get user specified types
				console.log('finding nearby stores for type ' + type);
				stores = findStores(current_location, type);

			}

			console.log('final stores object');
			console.log(stores);

			/* stores is an object containing the lat,lng, and store_type of nearby stores within 5 k*/

			//now that we have nearby stores, lets find the nearest one

			//iterate through stores object to check distance from current location
			for (var store in stores) {

				console.log('iterating through nearby stores');

				if (stores.hasOwnProperty(store)) {

					console.log(key + " -> " + p[key]);

	                var pointDistance = distance(current_lat, current_lng, store.lat, store.lng, 'K');

					pointDistance = pointDistance.toFixed(2);

					distances[i + '_' + store.store_type] = pointDistance;

					i++;

				}

			}

			for (var d in distances) {
				console.log('iterating through distances of stores object');
				if (distances.hasOwnProperty(d)) {

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

		function flashLight(color_by_type) {

			console.log('flashLight flashing color ' + color_by_type);

			var pin_by_color = {
				red: "FF0000", 
				orange: "FF7F00", 
				yellow: "FFFF00", 
				green: "00FF00", 
				blue: "0000FF", 
				purple: "4B0082", 
				lavender: "8F00FF"
			};

			//execute call to arduino to flash a light

  			var board = new five.Board();

			board.on("ready", function() {

			  var pin_color = pin_by_color[color_by_type];
			  var led = new five.Led.RGB({
			    pins: {
			      red: 6,
			      green: 5,
			      blue: 3
			    }
			  });
			  led.color(pin_color);
			  led.blink(500);

			});
		}
});

