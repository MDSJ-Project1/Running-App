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
};

//sets a point on the map that takes in a coordinate
function setMapPoint(coordinate){

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 1,
    center: location
  });
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
}
//converts address to coordinate, and passes resulting coordinate into callback
function setMapPointFromCoordinate(address,callback) {
    $.ajax({
      method:"GET",
      url: "https://maps.googleapis.com/maps/api/geocode/json?"
      + "address="+address
      +"&key=AIzaSyDI4WkP2aEnUvW-xJTF5udyKKnTx2Z5cio"
    }).done(function(response){
      var location = response.results[0].geometry.location
      //set input field value to address
      callback(location)
    })

  }
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

// 
// Route button function
// Displays route on map
// Calculates total miles in route
// 

// initialize empty startInput variable
var startInput;
// if geolocation api is avaliabe, set startInput to geolocation
if(navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(geoLocation) {
      var latitude = geoLocation.coords.latitude;
      var longitude = geoLocation.coords.longitude
      startInput = latitude + "," + longitude;
    //get human readable address from coordinates using maps api
    setMapPoint({lat:latitude,
                lng:longitude})
    $.ajax({
      method:"GET",
      url: "https://maps.googleapis.com/maps/api/geocode/json?"
      + "latlng="+startInput
      +"&key=AIzaSyDI4WkP2aEnUvW-xJTF5udyKKnTx2Z5cio"
    }).done(function(response){
      var address = response.results[0].formatted_address
      //set input field value to address
      $("#start_input").val(address)
    })
      
  })
}

//when user deselects start_input field
$("#start_input").on("focusout",function(){
  var userStartInput = $(this).val().trim()
  //if user entered value, startInput updates to user input address 
  if(userStartInput !== "") {
    startInput = userStartInput;
    setMapPointFromCoordinate(startInput,setMapPoint)

  }
})



$('#route_button').on('click', function() {

    console.log("startInput",startInput);


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
        var cityCircle = new google.maps.Circle({
          strokeColor: '#1c4e9e',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#3a74d1',
          fillOpacity: 0.15,
          map: map,
          center: start,
          radius: 8046.72
        });

        // click function for within circle ////////////////////////////////////////////////
        google.maps.event.addListener(cityCircle, 'click', function(event) {
          console.log('clicked');
          marker = new google.maps.Marker({position: event.latLng, map: map});
          console.log(event);
          console.log(event.latLng);   // Get latlong info as object.
          console.log( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng()); // Get separate lat long.
        });
    };

    $.ajax({method:"GET", 
        url: url}).done(function(response){
        console.log('first ajax run');
        console.log(response);
        var startLocation = response.results[0].geometry.location;
        
        initMap(startLocation, 10);
        $('#address_html').html('Start Address:' + '<p>' + response.results[0].formatted_address);
       
        //
        // 
        // 
        // 
        // 
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
                console.log(waypts);
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
    signInSuccessUrl: 'https://mdsj-project1.github.io/Running-App/',
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