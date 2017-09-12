
// NECESSARY GLOBAL VARIABLES ////////////////////////////////////////////////////////////////
var appState = {
  caloriesBurned: 0,
};

var map;
var service;
var infoWindow;
var placeType;
var milesToRun;
var cityCircle;
var markerArray = [];
var waypts = [];

// /////////////////////////////////////////////////////////////////////////////////////////////

(function generatePlacesOptions(){
  //initially set the dropdown button's value to restaurant. 
  //this html val will determine the place parameter passed into maps api
  var $placesBttn = $("#dropdownMenuButton")
  $placesBttn.val("restaurant")
  //array of places api supported type options
  const placesTypes = ["aquarium","art_gallery","bakery","bar","book_store","bowling_alley","cafe","casino","liquor_store","gym","movie_theater","museum","night_club","restaurant","zoo"];
  //generate a place div for each place type
  placesTypes.forEach(function(place){
    var $placeOption = $("<a>"+ place+"</a>");
    $placeOption.addClass("dropdown-item")
    $placeOption.val(place)
    // when place is clicked, set value and text of dropdown button to place
    $placeOption.on("click",function(){
      $placesBttn.val(place)
      $placesBttn.text(place)

    })
    $("#places-dropdown").append($placeOption).append($("<br>"))

  })
})()

function initMap(start, dest, miles) {

  if (start === undefined) {
    console.log('original initMap function run')
  var uluru = {lat: 0, lng: 0};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 1,
    center: uluru
  });

  }
  
  console.log(start);
  if (start) {
    console.log('recognize start');
    startMap(start, dest, miles);
  };
};

// <<<<<<< HEAD
// =======
//sets a point on the map that takes in a coordinate object 
function setMapPointCoordinate(coordinate){

  map.setCenter(coordinate);
  map.setZoom(11);
  // var map = new google.maps.Map(document.getElementById('map'), {
  //   zoom: 11,
  //   center: coordinate
  // });
  var marker = new google.maps.Marker({
    position: coordinate,
    map: map,
    icon: "assets/img/home_icon.png"

  });
};

//sets map point from address
function setMapPointAddress(address) {
    $.ajax({
      method:"GET",
      url: "https://maps.googleapis.com/maps/api/geocode/json?"
      + "address="+address
      +"&key=AIzaSyDI4WkP2aEnUvW-xJTF5udyKKnTx2Z5cio"
    }).done(function(response){
      var location = response.results[0].geometry.location
      //set input field value to address
      setMapPointCoordinate(location)
    })

  }

$("#start_input").on("focusout",function(){
  var userStartInput = $(this).val().trim()
  //if user entered value, startInput updates to user input address 
  if(userStartInput !== "") {
    startInput = userStartInput;
    setMapPointAddress(startInput)

  };  
});



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
        var inItLocation = {
          lat: latitude,
          lng: longitude
        };
        // initMap(inItLocation);
        //grab the place type that was stored in dom
        placeType = $("#dropdownMenuButton").val().trim()

        // placeAPI(location,placeType);
        
        $.ajax({
           method:"GET",
           url: "https://maps.googleapis.com/maps/api/geocode/json?"
           + "latlng=" + location
           + "&key=AIzaSyDI4WkP2aEnUvW-xJTF5udyKKnTx2Z5cio"
        }).done(function(response){
           var address = response.results[0].formatted_address
           //set input field value to address
           $("#start_input").val(address);
           setMapPointAddress(address);
        });
        //example using places api
    })
}

$("#dropdownMenuButton").change(function() {
  console.log(this.val());
})

$("#button_submit").on("click", function(e) {
    e.preventDefault()



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
//                FUNCTIONS
// Google MAP
//                FUNCTIONS
// Google MAP
//                FUNCTIONS
// Google MAP
// //////////////////////////////////////////////////////////////

// place API runs with startinput parameter, finds places within radius, 
// 
function createCircle(location, rad) {
    console.log('circle stuff activated');

  radMeters = rad * 1609.34;
  if (cityCircle) {
    console.log('if runs')
    cityCircle.setRadius(radMeters)
  } else {
    console.log('else runs')
    cityCircle = new google.maps.Circle({
      strokeColor: '#1c4e9e',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#3a74d1',
      fillOpacity: 0.15,
      map: map,
      center: location,
      radius: radMeters
    });
  };
};

function placeAPI(location, type) {

  var type = $("#dropdownMenuButton").val();
  var API_KEY = "AIzaSyCQPkqDoLqZjqpqhqnnRyE79yUe0omijso";
  //https://stackoverflow.com/questions/45185061/google-places-api-cors
  var PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

  var lat = location.lat; //
  var lng = location.lng; // These three convert original start location object to coord stirng pair.
  var locString = lat + "," + lng; //

  var url = PROXY_URL +
      "https://maps.googleapis.com/maps/api/place/nearbysearch/" +
      "json?location=" + locString + "&" +
      "radius=8046.72" + "&" + //radius in meters
      "type=" + type + "&" +
      "rankBy=distance" + "&" +
      "key=" + API_KEY;

  $.ajax({
      method: "GET",
      url: url
  }).done(function(data) {

      var places = [];
      var placesIdArray = [];
      var placesLatLngArray = [];
      var placesNameArray = [];
      var placesAddressArray = [];
      console.log(data);
      for (var i = 0; i < data.results.length; i++) {
        var placesData = data.results[i];
        var placesDataId = placesData.place_id;
        var placesLatLng = placesData.geometry.location;
        places.push(placesData); // pushes places details into array, 20 search results
        placesIdArray.push(placesDataId); // pushes place_id into array
        placesLatLngArray.push(placesLatLng); // pushes latlng into array from data
      }

      pullPlaceInfoName(placesLatLngArray, placesIdArray, placesAddressArray);
      }); 
};

      // GETS PLACE DETAILS /////////////////////////////////////////////////////////////////////////
      
      // run ajax for all placesIdArray[i], push into array with title, pass array into function
function pullPlaceInfoName (latlngArr, idArr, addArray) {
    var API_KEY = "AIzaSyCQPkqDoLqZjqpqhqnnRyE79yUe0omijso";
    var PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    var placesNameArray = [];
    console.log(idArr);
  for (var i = 0; i < idArr.length; i++) {
    var placeID = idArr[i]
    var url3 = PROXY_URL + "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeID + "&key=" + API_KEY;
     $.ajax({
      method: "GET",
      url: url3
      }).done(function(detailsResponse){
      // console.log('url3 works')

      var address = detailsResponse.result.formatted_address;
  
      var placeName = detailsResponse.result.name;
      placesNameArray.push(placeName);
      addArray.push(address);
      createMarkersInCircle(latlngArr, placesNameArray, addArray);

    });

  };
};




function toObject (arr) { // <------------- Might not need function in places API
  var objArray = {};

  for (var i = 0; i < arr.length; i++) {
    objArray[i] = arr[i];
  };
  console.log(objArray);
}

// latlang= array of coordinates.
// names = array of placeNames
function createMarkersInCircle(latLng, names, address) {
  removeMarkers();
  var infoWindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);

  for (var i = 0; i < latLng.length; i++) {

    markerArray[i] = new google.maps.Marker({
      position: latLng[i],
      icon: "assets/img/marker_POI.png",
      title: names[i],
      id: address[i]
    });
    markerArray[i].setMap(map);

    google.maps.event.addListener(markerArray[i], 'click', function() {
      
      console.log(this.position)

      var thisPosition = this.getPosition();
      var thisAddress = this.id;
      var stringAddress = JSON.stringify(thisAddress);
      $('#destination_input').val(this.id);
       console.log(thisPosition);
      waypts.push({
        location: thisPosition,
        stopover: true 
      });
      console.log(waypts);
      $('#destination_address_html').append("<input type='text' class='form-control' value=" + stringAddress + ">");


    }); 
  }; // end for loop
}; // end create marker function

function removeMarkers(){
    for (i=0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    };
};



 
function startAjax(blah, callback, miles) {
    console.log(blah);
    var startInput = $('#start_input').val().trim();

    var key = "AIzaSyDI4WkP2aEnUvW-xJTF5udyKKnTx2Z5cio";
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    startInput + "&key=" + key;
    var destInput = $('#destination_input').val().trim();

    var url2 = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        destInput + "&key=" + key;

        $.ajax({method:"GET", 
        url: url}).done(function(response){
        console.log('first ajax run');
        console.log(response);
        var startLocation = response.results[0].geometry.location;
        
        $('#address_html').val('Start Address:' + '<p>' + response.results[0].formatted_address);
        console.log('first ajax end');
        if (destInput) {
          $.get(url2, function(destResponse){

            console.log('dest ajax activated');
            console.log(destResponse);

            $('#destination_address_html').val('Destination Address:' + '<p>' + destResponse.results[0].formatted_address);

            var destLocation = destResponse.results[0].geometry.location;

            callback(startLocation, destLocation, miles);
          });
        } else {
          console.log('destinput undefined');
          callback(startLocation, undefined, miles); // runs initMap function
        }
        });
// });
// };
};

//when user deselects start_input field

function startMap(start, dest, miles) {
        console.log('start map function activated')
        console.log(map);
        map.setCenter(start);
        map.setZoom(11);
        console.log(map);
        // map = new google.maps.Map(document.getElementById('map'), {
        //   center: start,
        //   zoom: 10
        // });

        var homeMarker = new google.maps.Marker({
            position: start,
            map: map,
            title: 'start Location',
            icon: "assets/img/home_icon.png"
        });

        if (dest == undefined) {
          createCircle(start, miles);
          placeAPI(start);
          
        // Ajax Places API
          
        // click function for blahin circle ////////////////////////////////////////////////
        // google.maps.event.addListener(cityCircle, 'click', function(event) {
        //   console.log('clicked');
        //   marker = new google.maps.Marker({position: event.latLng, map: map});
        //   console.log(event);
        //   console.log(event.latLng);   // Get latlong info as object.
        //   console.log( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng()); // Get separate lat long.
        // });
            };
         // end circle stuff /////////////
        if (dest) {
          console.log('destination stuff activated');
          routeWithDestination(start, dest);
        };
};

function routeWithDestination(start, dest) {
  
    map.setCenter(start);
    map.setZoom(11);


    var directionsDisplay = new google.maps.DirectionsRenderer({
      map: map
    });
    

    // pushes waypoints into array between start and destination
    waypts.push({
      location: dest,
      stopover: true, 
    });

    // waypts.push({
    //   location: "335 Highland Ave, Piedmont, CA 94611",
    //   stopover: true,  
    // });

    // Sets start as dest and origin for round trip

    var request = {
      destination: start,
      origin: start,
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
        calcMilesCalories(legsArray);
      };
    });
};


function calcMilesCalories(legs) {
    var sum = 0
    console.log(legs);
    for (var i = 0; i < legs.length; i++) {
        var legsArray2 = legs[i].distance.value;
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
// ///////////////////////////////////////////////////////////////////////////////
// Google MAP
//                FUNCTIONS
// Google Map                                      ^^^^^^^^^^^^^^^^^^^^
//                FUNCTIONS                        ||||||||||||||||||||
// Google Map                                      ^^^^^^^^^^^^^^^^^^^^
//                FUNCTIONS
// Google MAP
// ////////////////////////////////////////////////////////////////////////////////

$('#route_button').on('click', function() {
     console.log('clicked');
    var startInput = $('#start_input').val().trim();
    var destInput = $('#destination_input').val().trim();

    var caloriesToBurn = parseInt($("#calorie_field").val().trim());
    weight = parseInt($("#weight_field").val().trim())
    // http://www.livestrong.com/article/314404-how-many-calories-do-you-lose-per-mile/
    var caloriesPerMile = weight * .75;
    console.log(caloriesToBurn, weight, caloriesPerMile)


    milesToRun = caloriesToBurn / caloriesPerMile;
    console.log("milesToRUn", milesToRun);

    startAjax(true, initMap, milesToRun);
    // placeAPI(startInput);
    
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
