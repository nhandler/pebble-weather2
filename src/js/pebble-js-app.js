// Function to send a message to the Pebble using AppMessage API
function sendMessage(msg) {
	Pebble.sendAppMessage({"message": msg});
	
	// PRO TIP: If you are sending more than one message, or a complex set of messages, 
	// it is important that you setup an ackHandler and a nackHandler and call 
	// Pebble.sendAppMessage({ /* Message here */ }, ackHandler, nackHandler), which 
	// will designate the ackHandler and nackHandler that will be called upon the Pebble 
	// ack-ing or nack-ing the message you just sent. The specified nackHandler will 
	// also be called if your message send attempt times out.
}

function getLocation() {
    if ("geolocaiton" in navigator) {
        console.log("Geolocation is available");
        navigator.geolocation.getCurrentPosition(getWeather);
    }
    else {
        console.log("Geolocation is NOT available");
    }
}

function getWeather(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    console.log("Getting Weather");
    console.log("Latitude: " + lat);
    console.log("Longitude: " + lon);

    var baseUrl = "http://api.openweathermap.org/data/2.5/weather?units=imperial&";
    var url = baseUrl + "lat=" + lat + "&lon=" + lon;
    console.log("URL: " + url);

    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function(e) {
        if (req.readyState == 4 && req.status == 200) {
            var response = JSON.parse(req.responseText);
            var fahrenheit = response.main.temp;
            var temperature = fahrenheit.toFixed(0) + "F";

            console.log("Weather: " + temperature);
            sendMessage(temperature);
        }
        else {
            console.log("Error Getting Weather: " + req.status);
            sendMessage("ERR");
        }
    };
    req.send(null);
}

// Called when JS is ready
Pebble.addEventListener("ready",
							function(e) {
                                getLocation();
							});
												
// Called when incoming message from the Pebble is received
Pebble.addEventListener("appmessage",
							function(e) {
								console.log("Received Message: " + e.payload[0]);
							});
