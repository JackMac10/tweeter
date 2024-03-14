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
    
    // Serialize form data to a query string
    const formData = $(this).serialize();
    
    // Send a POST request with the serialized data to the server
    $.post('/tweets/', formData)
      .then(function(response) {
        // Handle the response from the server if needed
        console.log('Tweet submitted successfully:', response);
        console.log(formData);
      })
      .catch(function(error) {
        // Handle any errors that occur during the request
        console.error('Error submitting tweet:', error);
      });
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
          // Initialize timeago for tweet timestamps
          $('.timeago').timeago();
        })
        .catch(function(error) {
            // Handle any errors that occur during the request
            console.error('Error fetching tweets:', error);
        });
};

  // Call loadTweets function to fetch tweets on page load
  loadTweets();
});

// Define renderTweets and createTweetElement functions
const renderTweets = function(tweets) {
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('#tweets-container').prepend($tweet);
  }
};

const createTweetElement = function(tweet) {
  const $tweet = $(`
    <article class="tweet">
      <header>
        <div class="buds">
        <img src="${tweet.user.avatars}" alt="Profile Picture">
        <h3>${tweet.user.name}</h3>
        </div>
        <span class="username">${tweet.user.handle}</span>
      </header>
      <p>${tweet.content.text}</p>
      <hr>
      <footer>
      <span class="timeago">${timeago.format(tweet.created_at)}</span>
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