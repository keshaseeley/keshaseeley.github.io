// Firebase
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAJQzlRpARl4uiEGouxTl0aeGe_t7pmheg",
  authDomain: "wave-finder-aab5f.firebaseapp.com",
  databaseURL: "https://wave-finder-aab5f.firebaseio.com",
  projectId: "wave-finder-aab5f",
  storageBucket: "wave-finder-aab5f.appspot.com",
  messagingSenderId: "135387526168"
};
firebase.initializeApp(config);

// create reference to data base
// use jquery to listen to form input
// event = submit button, prevent default
// get the contents of the box
// refence section of database w/ alias (creates section first time)
// create new record in that section of the database

// https://firebase.google.com/docs/reference/js/firebase.database
var messageAppReference = firebase.database();

$(document).ready(function() {
  // on click in nav, toggle class="hidden"
  $('#navLocations').click(function(event){
      event.preventDefault();
      $('#map').removeClass('hidden');
      $('#forecast').addClass('hidden');
      $('#postings').addClass('hidden');
  })
  $('#navForecast').click(function(event){
      event.preventDefault();
      $('#forecast').removeClass('hidden');
      $('#postings').addClass('hidden');
      $('#map').addClass('hidden');
  })
  $('#navPostings').click(function(event){
      event.preventDefault();
      $('#postings').removeClass('hidden');
      $('#forecast').addClass('hidden');
      $('#map').addClass('hidden');
  })

  // location search by latitude/longitude
  $('#submitBtn').on('click', latLngSearch);

  // submit postings to firebase
  $('#message-form').submit(function (event) {
        // by default a form submit reloads the DOM which will subsequently reload all our JS
        // to avoid this we preventDefault()
        event.preventDefault()

        // grab user message input
        var message = $('#message').val()

        // clear message input (for UX purposes)
        $('#message').val('')

        // create a section for messages data in your db
        var messagesReference = messageAppReference.ref('messages');

        // use the push method to save data to the messages
        // https://firebase.google.com/docs/reference/js/firebase.database.Reference#push
        messagesReference.push({
            message: message,
            votes: 0
        });
        console.log(messagesReference);
    });
    getPosts();
});

function latLngSearch(event) {
  event.preventDefault()
  var $lat = $('#lat').val();
  var $lng = $('#lng').val();
  var newSource = 'https://embed.windy.com/embed2.html?lat=' + $lat + '&lon=' + $lng + '&zoom=3&level=surface&overlay=wind&menu=&message=&marker=&forecast=12&calendar=now&location=coordinates&type=map&actualGrid=&metricWind=kt&metricTemp=%C2%B0C';
  $('#weatherMap').attr('src', newSource);
  // console.log(newSource);
}

function getPosts() {
  // retrieve messages data when .on() initially executes
  // and when its data updates
  // https://firebase.google.com/docs/reference/js/firebase.database.Reference
  // https://firebase.google.com/docs/database/web/read-and-write#listen_for_value_events
  messageAppReference.ref('messages').on('value', function (results) {
    var $messageBoard = $('.message-board');
    var messages = [];

    var allMsgs = results.val();
    // iterate through results coming from database call; messages
    for (var msg in allMsgs) {
      var message = allMsgs[msg].message;
      var votes = allMsgs[msg].votes;

      // create message element
      var $messageListElement = $('<li>');

      // create delete element
      var $deleteElement = $('<i class="fa fa-trash pull-right delete"></i>');
      $deleteElement.on('click', function(event){
        var id = $(event.target.parentNode).data('id');
        deleteMessage(id);
      })
      // create up vote element
      var $upVoteElement = $('<i class="fa fa-thumbs-up pull-right"></i>');
      $upVoteElement.on('click', function(event){
        var id = $(event.target.parentNode).data('id');
        updateMessage(id, ++allMsgs[id].votes);
      })
      // create down vote element
      var $downVoteElement = $('<i class="fa fa-thumbs-down pull-right"></i>');
      $downVoteElement.on('click', function(event){
        var id = $(event.target.parentNode).data('id');
        updateMessage(id, --allMsgs[id].votes);
      })
      // add id as data attribute so we can refer to later for updating
      $messageListElement.attr('data-id', msg);

      // add message to li
      $messageListElement.html(message);

      // add delete element
      $messageListElement.append($deleteElement);

      // add voting elements
      $messageListElement.append($upVoteElement);
      $messageListElement.append($downVoteElement);

      // show votes
      $messageListElement.append('<div class="pull-right">' + votes + '</div>');

      // push element to array of messages -- this is pushing to an array, not HTTP push
      messages.push($messageListElement);
    }

    // remove lis to avoid dupes
    // .empty() is a jQuery method to remove all child nodes
    $messageBoard.empty();
    for (var i in messages) {
      $messageBoard.append(messages[i]);
    }
  });
}

function updateMessage(id, votes) {
    var messageReference = messageAppReference.ref('messages').child(id);
    messageReference.update({
      votes: votes
    })
  }

function deleteMessage(id){
    var messageReference = messageAppReference.ref('messages').child(id);
    messageReference.remove();

  }

// Google Map: Markers
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: {lat: -28.024, lng: 140.887},
      mapTypeId: 'satellite'
    });

  // Create an array of alphabetical characters used to label the markers.
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
  var markers = locations.map(function(location, i) {
      return new google.maps.Marker({
        position: location,
        label: labels[i % labels.length]
      });
    });

  // Add a marker clusterer to manage the markers.
  var markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}
var locations = [
  {lat: -28.001744, lng: 153.42844}, // gold coast, australia
  {lat: 21.631201, lng: -158.069305}, // oahu, hawaii
  {lat: 3.945651, lng: 108.142868}, // mentawai, indonesia
  {lat: 9.8708300, lng: 126.0511100}, // siargao island, philippines
  {lat: -14.270284, lng: -170.704681}, // samoa
  {lat: -37.8, lng: 174.883333}, // manu bay, raglan, new zealand
  {lat: 18.24306, lng: 109.505}, // riyuewan, sanya, hainan, china
  {lat: -17.8667, lng: 177.2000}, // tavarua island, fiji
  {lat: 26.301667, lng: 127.909167} // white beach, okinawa, japan
  // {lat: 54.479142, lng: -8.277934} // bundoran beach, ireland
  // {lat: ‎-34.033333, lng: 24.916668}, // j's bay, south africa
  // {lat: ‎-12.046374, lng: -77.042793}, // lima, peru
  // {lat: 28.358744, lng: -14.053676}, // fuerteventura, canary islands, spain
  // {lat: 32.802353, lng: ‎-117.241676}, // blacks beach, san diego, california
  // {lat: 43.676891, lng: -1.424724}, // hossegor, france
  // {lat: 13.48833, lng: -89.32222}, // la libertad, el salvador
  // {lat: ‎9.665231, lng: ‎-82.782066}, // playa naranjo, costa rica
  // {lat: -27.646620, lng: -48.670361}, // santa catarina, brazil
  // {lat: 1.924992, lng: ‎73.399658}, // north male, maldives
  // {lat: -1.241667, lng: -78.619720}, // montanita, ecuador
  // {lat: 23.614328, lng: 58.545284}, // oman
  // {lat: ‎50.503632, lng: -4.652498}, // watergate bay, cornwall, england
  // {lat: 18.340216, lng: -67.250015}, // rincon, puerto rico
  // {lat: 43.47664, lng: -1.51346}, // anglet, france
  // {lat: 49.152434, lng: -125.902493} // tofino, vancouver island, canada
]
