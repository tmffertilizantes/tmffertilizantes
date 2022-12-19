( function(){
    $('.contacts-list .contacts-link').on('click', function () {
        $(".chat-body").addClass("chat-body-visible");
      })
      // Toggle chat
      $('[data-close]').on('click', function (e) {
        e.preventDefault()
        $(".chat-body").removeClass("chat-body-visible");
      })


})();