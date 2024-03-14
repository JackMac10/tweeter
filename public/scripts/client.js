/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  // Add event listener for form submission
  $('form').submit(function(event) {
    // Prevent default form submission behavior
    event.preventDefault();
    
    // Get tweet content from the form
    const tweetContent = $('#tweet-text').val().trim();
    
    // Validate tweet content
    if (!tweetContent) {
      // Notify the user that tweet content is not present
      alert('Tweet content cannot be empty.');
      return; // Exit the function
    }
    
    if (tweetContent.length > 140) {
      // Notify the user that tweet content is too long
      alert('Tweet content exceeds the maximum allowed length of 140 characters.');
      return; // Exit the function
    }

    // Serialize form data to a query string
    const formData = $(this).serialize();
    
    // Send a POST request with the serialized data to the server
    $.post('/tweets/', formData)
      .then(function(response) {
        // Handle the response from the server if needed
        console.log('Tweet submitted successfully:', response);
        // Reload tweets to reflect the new tweet
        loadTweets();
      })
      .catch(function(error) {
        // Handle any errors that occur during the request
        console.error('Error submitting tweet:', error);
        // Display user-friendly error message
        alert('Failed to submit tweet. Please try again later.');
      });
  });

  // Call loadTweets function to fetch tweets on page load
  loadTweets();
});

// Define loadTweets function
const loadTweets = function() {
  // Make a GET request to fetch tweets
  $.get('/tweets')
    .then(function(tweets) {
      // Log the fetched tweets to the console
      console.log('Fetched tweets:', tweets);
      // Render the fetched tweets
      renderTweets(tweets);
    })
    .catch(function(error) {
      // Handle any errors that occur during the request
      console.error('Error fetching tweets:', error);
      
      // Display user-friendly error message
      alert('Failed to fetch tweets. Please try again later.');
    });
};

// Define renderTweets function
const renderTweets = function(tweets) {
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('#tweets-container').prepend($tweet);
  }
};

// Define createTweetElement function
const createTweetElement = function(tweet) {
  const timeAgoFormatted = timeago.format(tweet.created_at);
  const $tweet = $(`
    <article class="tweet">
      <header>
        <div class="buds">
        <img src="${tweet.user.avatars}" alt="Profile Picture">
        <h3>${tweet.user.name}</h3>
        </div>
        <span class="username">${tweet.user.handle}</span>
      </header>
      <p>${$('<div>').text(tweet.content.text).html()}</p> <!-- Escaping tweet content -->
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


  return $tweet;
};