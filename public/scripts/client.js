/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  
  $('form').submit(function(event) {// event listener for form submission
    event.preventDefault();
  
    // Get tweet content from the form
    const tweetContent = $('#tweet-text').val().trim();
    
    if (!tweetContent) { // if tweet content is empty
      alert('Tweet content cannot be empty.');// alert the user
      return;
    }
    
    if (tweetContent.length > 140) { // if the tweet is too long
      alert('Tweet content exceeds the maximum allowed length of 140 characters.'); // alert the user
      return;
    }

    // Serialize form data to a query string
    const formData = $(this).serialize();
    
    $.post('/tweets/', formData)// Send a POST request with the serialized data to the server
      .then(function(response) {
        console.log('Tweet submitted successfully:', response); // Handle the response from the server if needed
        loadTweets(); // Reload tweets to reflect the new tweet
      })
      .catch(function(error) {
        console.error('Error submitting tweet:', error); // Handle any errors that occur during the request
        alert('Failed to submit tweet. Please try again later.'); // alert the user 
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