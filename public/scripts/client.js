/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  // Function to check if a tweet is valid
  const isTweetValid = function(tweetContent) {
    // if tweet content is empty, send error message
    if (!tweetContent) {
      return { valid: false, message: 'Hmm, Nothing to Humming about? Add some Peeps to your Tweet to post!' };
    }
    
    // if tweet exceeds character limit, send error message
    if (tweetContent.length > 140) {
      return { valid: false, message: 'Woah Birdie! Your Tweet is longer than 140 characters! Please shorten to post.' };
    }
    // Return validation result
    return { valid: true };
  };
  // event listener for form submission
  $('form').submit(function(event) { 
    event.preventDefault();

      // Get tweet content from the form
    const tweetContent = $('#tweet-text').val().trim();

      // Validate tweet content
    const validationResult = isTweetValid(tweetContent);
      if (!validationResult.valid) {
        $('#error-message').text(validationResult.message).slideDown(); // Display error message to the user
        return; // Exit the function
      } else {
        $('#error-message').slideUp(); // Hide error message if validation passes
      }
  
    // Serialize form data to a query string
    const formData = $(this).serialize();
    
    // Send a POST request with the serialized data to the server
    $.post('/tweets/', formData)
      .then(function(response) {
        console.log('Tweet submitted successfully:', response); // Handle the response from the server if needed
        $('#tweet-text').val('');
        loadTweets(); // Reload tweets to reflect the new tweet
      })
      .catch(function(error) {
        console.error('Error submitting tweet:', error); // Handle any errors that occur during the request
        $('#error-message').text('Failed to submit tweet. Please try again later.').slideDown();
      });
  });

  // Event listener for new-tweet toggle
  $('.nav-message').click(function() {
    $('.new-tweet').slideToggle();
    $('#tweet-text').focus(); // Enable textarea automatically when form slides down
  });

  // Call loadTweets function to fetch tweets on page load
  loadTweets();
});

// Define loadTweets function
const loadTweets = function() {
  // Make a GET request to fetch tweets
  $.get('/tweets')
    .then(function(tweets) {
      // Log the tweets in the console
      console.log('Fetched tweets:', tweets);
      // Render the tweets
      renderTweets(tweets);
    })
    .catch(function(error) {
      // Handle any errors that occur during the request
      console.error('Error fetching tweets:', error);
      
      // Display error message via alert
      alert('Failed to fetch tweets. Please try again later.');
    });
};

// Define renderTweets function
const renderTweets = function(tweets) {
  // Clear existing tweets from the container
  $('#tweets-container').empty();

  // Render the tweets
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('#tweets-container').prepend($tweet);
  }
};

// createTweetElement function = html for new tweets to follow
const createTweetElement = function(tweet) {
  // Formatted timeago
  const timeAgoFormatted = timeago.format(tweet.created_at);
  //display tweet element
  const $tweet = $(`
    <article class="tweet">
      <header>
        <div class="buds">
        <img class="profile-pic"src="${tweet.user.avatars}" alt="Profile Picture">
        <h3>${$('<div>').text(tweet.user.name).html()}</h3>
        </div>
        <span class="username">${$('<div>').text(tweet.user.handle).html()}</span>
      </header>
      <p>${$('<div>').text(tweet.content.text).html()}</p>
      <hr>
      <footer>
        <span class="timeago">${timeAgoFormatted}</span>
        <script>console.log(timeago.format(${tweet.created_at}))</script>
        <div class="icons">
          <i class="far fa-heart"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-flag"></i>
        </div>
      </footer>
    </article>
  `);
 // animation
 $tweet.slideDown();

  return $tweet;
};