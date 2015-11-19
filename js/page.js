$(document).ready(function() {
  root.mgechev.com.preloader.init();
  root.mgechev.com.form.init();
  $('#homeButton').click(function() {
    $('#gallery').fadeOut(300, function() {
      $('.block').fadeIn(300);
    });
    return false;
  });
  $('#galleryButton').click(function() {
    $('.block').fadeOut(300, function() {
      $('#gallery').fadeIn(300);
    });
    return false;
  });
  $('.sideGallery').click(function() {
    $('.block').fadeOut(300, function() {
      $('#gallery').fadeIn(300);
    });
    return false;
  });

  $('#gallery a').lightBox({ overlayOpacity: 0 });
});
