$(document).ready(function() {
  $('.new-tweet textarea').on('input', function() {
    const text = $(this).val();// Get the value of the textarea
    const charactersLeft = 140 - text.length;// number of characters left
    const counter = $(this).closest('.new-tweet').find('.counter'); // Find the counter element relative to the textarea
    counter.text(charactersLeft); // Update count

    if (charactersLeft < 0) {
      counter.addClass('invalid');
    } else {
      counter.removeClass('invalid');
    }
  });
});