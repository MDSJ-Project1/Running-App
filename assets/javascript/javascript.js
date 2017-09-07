function initMap() {
    console.log('original initMap function run')
  var uluru = {lat: 0, lng: 0};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 1,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });

   google.maps.event.addListener(map, 'click', function(event) {
     marker = new google.maps.Marker({position: event.latLng, map: map});
     console.log(event.latLng);   // Get latlong info as object.
     console.log( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng()); // Get separate lat long.
 });
};

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
                weight = parseInt($("#weight_field").val().trim())
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
                });

            });



// Google MAP
// 
// Google MAP
// 
// Google MAP
// 
// Google MAP
// //////////////////////////////////////////////////////////////



// 
// Route button function
// Displays route on map
// Calculates total miles in route
// 

$('#route_button').on('click', function() {
    console.log('clicked');

    var startInput = $('#start_input').val().trim();

    var key = "AIzaSyDI4WkP2aEnUvW-xJTF5udyKKnTx2Z5cio";
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    startInput + "&key=" + key;

    var dest_input = $('#destination_input').val().trim();

    var url2 = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    dest_input + "&key=" + key;
    function initMap(start, zoom) {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: start,
          zoom: zoom
        });

        var marker = new google.maps.Marker({
            position: start,
            map: map,
            title: 'start Location'
        });

    };

    $.ajax({method:"GET", 
        url: url}).done(function(response){
        console.log('first ajax run');
        console.log(response);
        var startLocation = response.results[0].geometry.location;
        
        // html the start address to the map ////////////////////
        initMap(startLocation, 10);
        $('#address_html').html('Start Address:' + '<p>' + response.results[0].formatted_address);
       

        // if statement if destination input is filled in ///////////////////////////
        if (dest_input) {
        $.get(url2, function(destResponse) {
            console.log('get worked');
            console.log(destResponse);

            $('#destination_address_html').html('Destination Address:' + '<p>' + destResponse.results[0].formatted_address);

            var destLocation = destResponse.results[0].geometry.location;

            function initMap() {
                var map = new google.maps.Map(document.getElementById('map'), {
                  center: startLocation,
                  zoom: 7
                });

                
                var directionsDisplay = new google.maps.DirectionsRenderer({
                  map: map
                });
                var waypts = [];

                // pushes waypoints into array between start and destination
                waypts.push({
                location: destLocation,
                stopover: true, 
                });

                waypts.push({
                location: "335 Highland Ave, Piedmont, CA 94611",
                stopover: true,  
                });
                
                // Sets start as dest and origin for round trip
                
                var request = {
                  destination: startLocation,
                  origin: startLocation,
                  waypoints: waypts,
                  travelMode: 'WALKING',
                  avoidHighways: true,
                };

                // Pass the directions request to the directions service.
                
                var directionsService = new google.maps.DirectionsService();
                directionsService.route(request, function(routeResponse, status) {
                  if (status == 'OK') {
                    // Display the route on the map.
                    directionsDisplay.setDirections(routeResponse);
                    console.log(routeResponse);                    

                    var legsArray = routeResponse.routes[0].legs;
                    var sum = 0
                    console.log(legsArray);
                    for (var i = 0; i < legsArray.length; i++) {
                        var legsArray2 = legsArray[i].distance.value;
                        sum += legsArray2;
                        console.log(sum);
                    }
                    // totalMiles converts meters to miles //////////////////
                    var totalMiles = sum / 1609.34;
                    var totalMilesRound = Math.round(totalMiles * 100) / 100;

                    $('#route_distance_html').html("Round Trip Distance: " + totalMilesRound + "mi");
                    
                    var weight = 100;

                    var caloriesPerMile = weight * .75

                    var caloriesBurn = totalMiles * caloriesPerMile; 
                    var caloriesBurned = Math.round(caloriesBurn * 100) / 100;

                    $('#calories_burned_html').html("Estimated Calories Burned: " + caloriesBurned + "cal");
                  };

                });
            };
            // initMap function ends ////////////////////
            initMap();           
        });
        };

    });

});

// AJAX Erorr message, doesnt work /////////////////////////
$(document).ajaxError(function() {
  alert('Route not found, please try again');
})


// Login
// And
// Authentication
// Section
// 
// 
//     
// initialize authentication ////////////////////////////////////

  // FirebaseUI config.
  var uiConfig = {
    signInSuccessUrl: 'http://localhost:5012/',
    // signInSuccessUrl: 'localhost:5008',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>'
  };

  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);

  //writes new user data to database
  function writeUserData(userId, name, email, imageUrl, phoneNumber) {
    firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl,
      phoneNumber: phoneNumber
    });
  }

  //add click event to push data to user's data node
  function setupClickEvent(userId) {

      $("#button_submit").on("click", function(event) {
          // Prevent default behavior
          event.preventDefault();

          var input1 = $("#name_field").val().trim();
          var input2 = $("#weight_field").val().trim();
          // var input3 = $("#input-3").val().trim();
          // var input4 = $("#input-4").val().trim();

          database.ref('users/' + userId + '/userData').push({
          input1: input1,
          input2: input2,
          // input3: input3,
          // input4: input4  
        });
      });
  }

  initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        var phoneNumber = user.phoneNumber;
        var providerData = user.providerData;

        database.ref('users/' + uid + '/userData').on("value", function(snapshot){
                  console.log(snapshot.val());
              });

        //query user data
              var query = database.ref('users/' + uid + '/userData');
              query.once("value")
              .then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            // key of each child being iterated over
            var key = childSnapshot.key;
            // childData will be the actual contents of the child
            var childData = childSnapshot.val();

            console.log("key is " + key);
            console.log("child data is " +childData);
            console.log("input1 value is " + childData.input1);

                });
              });

        //check if user exists, otherwise write in new user data
        database.ref('users/' + uid).once("value", function(snapshot){
                  console.log(snapshot.val());
                  if (snapshot.val()){
                      console.log("data for user exists, do not write over user data")
                  }
                  else {
                      //write user data to database if new user
              writeUserData(uid, displayName, email, photoURL, phoneNumber);
              console.log("no user data, adding new user");
                  }
              });
        
        //add click event to button when user is logged in
        setupClickEvent(uid);

        user.getIdToken().then(function(accessToken) {
          document.getElementById('sign-in-status').textContent = 'Signed in';
          document.getElementById('sign-in').textContent = 'Sign out';
          document.getElementById('account-details').textContent = JSON.stringify({
            displayName: displayName,
            email: email,
            emailVerified: emailVerified,
            phoneNumber: phoneNumber,
            photoURL: photoURL,
            uid: uid,
            accessToken: accessToken,
            providerData: providerData
          }, null, '  ');
        });
        //add sign out function

        $('#sign-in').on("click", function(){
          event.preventDefault();
          console.log("testing sign out button");
          
          firebase.auth().signOut().then(function() {
            // Sign-out successful.
          }).catch(function(error) {
            // An error happened.
          });
        });
      } else {
        // User is signed out.
        document.getElementById('sign-in-status').textContent = 'Signed out';
        document.getElementById('sign-in').textContent = 'Sign in';
        document.getElementById('account-details').textContent = 'null';
      }
    }, function(error) {
      console.log(error);
    });
  };

  window.addEventListener('load', function() {
    initApp()
  });

})();