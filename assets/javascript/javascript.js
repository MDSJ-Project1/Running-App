

(function() {
// Firebase set up /////////////////////////////////////////


var config = {
    apiKey: "AIzaSyCEHUOLj9sQo4PFvEtbI0uDOktzzroLcYQ",
    authDomain: "running-app-58fcf.firebaseapp.com",
    databaseURL: "https://running-app-58fcf.firebaseio.com",
    projectId: "running-app-58fcf",
    storageBucket: "running-app-58fcf.appspot.com",
    messagingSenderId: "886763704573"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

    //get user location
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(geoLocation) {
            var latitude = geoLocation.coords.latitude;
            var longitude = geoLocation.coords.longitude
            var location = latitude + "," + longitude;
            //example using places api
        })
    }
            $("#button_submit").on("click", function(e) {
                e.preventDefault()

                var API_KEY = "AIzaSyCQPkqDoLqZjqpqhqnnRyE79yUe0omijso";
                //https://stackoverflow.com/questions/45185061/google-places-api-cors
                var PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
                var caloriesToBurn = parseInt($("#calorie_field").val().trim());
                var weight = parseInt($("#weight_field").val().trim())
                // http://www.livestrong.com/article/314404-how-many-calories-do-you-lose-per-mile/
                var caloriesPerMile = weight * .75


                var milesToRun = caloriesToBurn / caloriesPerMile;
                console.log("milesToRUn", milesToRun)
                var type = "museum";
                var url = PROXY_URL +
                    "https://maps.googleapis.com/maps/api/place/radarsearch/" +
                    "json?location=" + location + "&" +
                    "radius=" + milesToRun + "&" +
                    "type=" + type + "&" +
                    "key=" + API_KEY;

                console.log("url", url)

                $.ajax({
                    method: "GET",
                    url: url
                }).done(function(data) {
                    console.log("done")
                    console.log(data)
                })
                var databaseNameInput = $('#name_field').val().trim();
                var databaseWeightInput = $('#weight_field').val().trim();
                var databaseStartDateInput = $('#start_date_field').val().trim();
                var databaseCalorieInput = $('#calorie_field').val().trim();
                console.log(databaseNameInput, databaseWeightInput, databaseStartDateInput, databaseCalorieInput);

                database.ref().push({
                    name: databaseNameInput,
                    weight: databaseWeightInput,
                    startTime: databaseStartDateInput,
                    calorie: databaseCalorieInput
                })

            })


})()

// Google MAP
// 
// Google MAP
// 
// Google MAP
// 
// Google MAP
// //////////////////////////////////////////////////////////////


// var initMain() = function() {
//     console.log('main map function works');
//     initMap();
//     initStart();
// }

function initMap() {
    console.log('original initMap function run')
  var uluru = {lat: 0, lng: 0};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}

// 
// Address Button Click function
// change map location to address
// 

$('#address_button').on('click', function() {
    var addressInput = $('#address_field').val().trim();
    var cityInput = $('#city_field').val().trim();
    var stateInput = $('#state_field').val().trim();
    var zipInput = $('#zip_field').val().trim();

    var key = "AIzaSyDI4WkP2aEnUvW-xJTF5udyKKnTx2Z5cio";
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
     addressInput + "," + cityInput + "," + stateInput + "&key=" + key;

    $.ajax({method:"GET", 
        url: url}).done(function(response){

      var startLocation = response.results[0].geometry.location;

 // html the start address to the map ////////////////////

      $('#address_html').html('Start Address:' + '<p>' + response.results[0].formatted_address);
      
      //   + addressInput + '<br>' + cityInput +
      // '<br>' + stateInput + '<br>' + zipInput + '</p>');


      function initMap() {
        console.log("start address function run");

          // Create a map object and specify the DOM element for display.
          var map = new google.maps.Map(document.getElementById('map'), {
            center: startLocation,
            zoom: 14
          });

          // Create a marker and set its position.
          var marker = new google.maps.Marker({
            map: map,
            position: startLocation,
            title: 'Start'
          });
      }
    initMap();
    })

})


$('#dest_address_button').on('click', function() {
  console.log('clicked')
    var addressInput = $('#dest_address_field').val().trim();
    var cityInput = $('#dest_city_field').val().trim();
    var stateInput = $('#dest_state_field').val().trim();
    var zipInput = $('#dest_zip_field').val().trim();
    console.log(addressInput, cityInput, stateInput, zipInput);

    var key = "AIzaSyDI4WkP2aEnUvW-xJTF5udyKKnTx2Z5cio";
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    addressInput + "," + cityInput + "," + stateInput + "&key=" + key;
    console.log(key);
    console.log(url);

    $.ajax({method:"GET", 
        url: url}).done(function(destResponse){
      console.log("done");
      console.log(destResponse);

    $('#destination_address_html').html('Destination Address:' + '<p>' + destResponse.results[0].formatted_address);

    var destLocation = destResponse.results[0].geometry.location;
    console.log(destLocation);

    function initMap() {
        console.log("destination function activated");
        console.log(destLocation);
        // sets destination waypoint
        var map = new google.maps.Map(document.getElementById('map'), {
        center: destLocation,
        zoom: 12
        });       


        var marker = new google.maps.Marker({
        map: map,
        position: destLocation,
        title: 'destination'
        });

        // var latlng = [
        // new google.maps.
        // ]

        // var latlngbounds = new google.maps.LatLngBounds();
        // for (var i = 0; i < latlng.length; i++) {
        // latlngbounds.extend(latlng[i]);
        // }
        // map.fitBounds(latlngbounds);
    };
    initMap();
    //     // expands map view to include both waypoints
    //     // shows walking directions

    //     var directionsDisplay = new google.maps.DirectionsRenderer({
    //       map: map
    //     });

    //     // Set destination, origin and travel mode.
    //     var request = {
    //       destination: indianapolis,
    //       origin: chicago,
    //       travelMode: 'DRIVING'
    //     };

    //     // Pass the directions request to the directions service.
    //     var directionsService = new google.maps.DirectionsService();
    //     directionsService.route(request, function(response, status) {
    //       if (status == 'OK') {
    //         // Display the route on the map.
    //         directionsDisplay.setDirections(response);
    //       }
    //     });

    // };
});
//       var location = response.results[0].geometry.location;
//       console.log(location);

});

// AJAX Erorr message, doesnt work /////////////////////////
$(document).ajaxError(function() {
  console.log('ajax error message');
})


// Login
// And
// Authentication
// Section
// 
// 
//     
// initialize authentication ////////////////////////////////////

var uiConfig = {
    callbacks: {
        signInSuccess: function(currentUser, credential, redirectUrl) {
            // Do something.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
    // Query parameter name for mode.
    queryParameterForWidgetMode: 'mode',
    // Query parameter name for sign in success url.
    queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            // Whether the display name should be displayed in the Sign Up page.
            requireDisplayName: true
        },
        {
            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            // Invisible reCAPTCHA with image challenge and bottom left badge.
            recaptchaParameters: {
                type: 'image',
                size: 'invisible',
                badge: 'bottomleft'
            }
        }
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>'
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);