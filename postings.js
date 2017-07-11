// Initialize Firebase
var config = {
  apiKey: "AIzaSyAhm1OQwsMgRRPGo_A2OGmian32stxU6aE",
  authDomain: "crud-demo-1f9f4.firebaseapp.com",
  databaseURL: "https://crud-demo-1f9f4.firebaseio.com",
  projectId: "crud-demo-1f9f4",
  storageBucket: "",
  messagingSenderId: "929125552564"
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
