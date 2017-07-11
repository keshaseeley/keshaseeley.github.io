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
// Navigation
$(document).ready(function() {

  // on click in nav, toggle class="hidden"
  $('#navPostings').click(function(event){
      event.preventDefault();
      $('#postings').removeClass('hidden');
      $('#map').addClass('hidden');
  })

  $('#navMap').click(function(event){
      event.preventDefault();
      $('#map').removeClass('hidden');
      $('#postings').addClass('hidden');
  })
})



// Marker Cluster
// GOOGLE MAP API KEY = AIzaSyAy4fOFhCIidGY3J64D5GOxuei-SZyGm5Y

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
    {lat: -31.563910, lng: 147.154312},
    {lat: -33.718234, lng: 150.363181},
    {lat: -33.727111, lng: 150.371124},
    {lat: -33.848588, lng: 151.209834},
    {lat: -33.851702, lng: 151.216968},
    {lat: -34.671264, lng: 150.863657},
    {lat: -35.304724, lng: 148.662905},
    {lat: -36.817685, lng: 175.699196},
    {lat: -36.828611, lng: 175.790222},
    {lat: -37.750000, lng: 145.116667},
    {lat: -37.759859, lng: 145.128708},
    {lat: -37.765015, lng: 145.133858},
    {lat: -37.770104, lng: 145.143299},
    {lat: -37.773700, lng: 145.145187},
    {lat: -37.774785, lng: 145.137978},
    {lat: -37.819616, lng: 144.968119},
    {lat: -38.330766, lng: 144.695692},
    {lat: -39.927193, lng: 175.053218},
    {lat: -41.330162, lng: 174.865694},
    {lat: -42.734358, lng: 147.439506},
    {lat: -42.734358, lng: 147.501315},
    {lat: -42.735258, lng: 147.438000},
    {lat: -43.999792, lng: 170.463352}
  ]
// End Marker Cluster
