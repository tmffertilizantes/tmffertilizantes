//
// Main js
//


'use strict';

(function () {


    // slimscroll for course resume page

    if ($('.course-list, .scrollbar').length) {
      $(".course-list, .scrollbar").slimScroll({
        height: "100%",
      });
    }




    //  slimscroll for sidebar nav

    if ($(".nav-scroller").length) {
      $(".nav-scroller").slimScroll({
        height: "97%",
      });
    }




  // Multi level menu dropdown

  if ($(".dropdown-menu a.dropdown-toggle").length) {
    $(".dropdown-menu a.dropdown-toggle").on("click", function (e) {
      if (!$(this)
        .next()
        .hasClass("show")
      ) {
        $(this)
          .parents(".dropdown-menu")
          .first()
          .find(".show")
          .removeClass("show");
      }
      var $subMenu = $(this).next(".dropdown-menu");
      $subMenu.toggleClass("show");

      $(this)
        .parents("li.nav-item.dropdown.show")
        .on("hidden.bs.dropdown", function (e) {
          $(".dropdown-submenu .show").removeClass("show");
        });

      return false;
    });
  }




  // Notification dropdown scroll List

  if ($('.notification-list-scroll').length) {
    $(".notification-list-scroll").slimScroll({
      height: 300,
    });
  }




  // Default Tooltip

  if ($('[data-bs-toggle="tooltip"]').length) {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  }




  // Default Popover

  if ($('[data-bs-toggle="popover"]').length) {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})
  }




  // Radio button - payment method switch

  if ($('#cardRadioone , #cardRadioTwo').length) {
    $('#internetpayment').hide();
    $('#cardRadioone').on("change", function () {
      if (this.checked) {
        $('#cardpayment').show();
        $('#internetpayment').hide();
      }
    });
    $('#cardRadioTwo').on("change", function () {
      if (this.checked) {
        $('#internetpayment').show();
        $('#cardpayment').hide();
      }
    });

  }




  // Magnific popup

  if ($(".popup-youtube").length) {
    $(".popup-youtube").magnificPopup({
      type: 'iframe',
      mainClass: 'mfp-fade',
      removalDelay: 160,
      preloader: false,
      fixedContentPos: true,

    });
  }




  // Flatpickr

  if ($(".flatpickr").length) {
    flatpickr(".flatpickr", {
      disableMobile: true

    });

  }




  // Password field strength

  if ($(".password-field input").length) {
    $('.password-field input').on("keyup", function () {
      var strength = checkPasswordStrength($(this).val());
      var $outputTarget = $(this).parent('.password-field');

      $outputTarget.removeClass(function (index, css) {
        return (css.match(/\level\S+/g) || []).join(' ');
      });
      $outputTarget.addClass('level' + strength);
    });

    function checkPasswordStrength(password) {
      var strength = 0;

      // If password is 6 characters or longer
      if (password.length >= 6) {
        strength += 1;
      }

      // If password contains both lower and uppercase characters, increase strength value.
      if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
        strength += 1;
      }

      // If it has numbers and characters, increase strength value.
      if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
        strength += 1;
      }

      return strength;
    }
  }





  // Input mask

  if ($("input").length) {
    Inputmask().mask(document.querySelectorAll("input"));
  }





  // Quill editor

  if ($("#editor").length) {
    var quill = new Quill('#editor', {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          [{ 'font': [] }],
          ['bold', 'italic', 'underline', 'strike', 'size'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'color': [] }, { 'background': [] }, { 'align': [] }],
          ['link', 'image', 'code-block', 'video'],
        ]
      },
       theme: 'snow'
    });
  }

  // File upload with preview for course cover img

  if ($("#courseCoverImg").length) {
    var firstUpload = new FileUploadWithPreview('courseCoverImg', {
      showDeleteButtonOnImages: true,
      text: {
        chooseFile: ' No File Selected',
        browse: 'Upload File',
      }
    });

  }

  // Menu toggle for admin dashboard

  if ($("#nav-toggle").length) {
    $("#nav-toggle").on("click", function (e) {
      e.preventDefault();
      $("#db-wrapper").toggleClass("toggled");
    });

  }

  // Print for invoice

  if ($("#invoice").length) {
    $("#invoice").find('.print-link').on('click', function () {
      //Print invoice with default options
      $.print("#invoice");
    });
  }

  // Sidenav fixed for docs

  if ($(".sidebar-nav-fixed a").length) {
    $(".sidebar-nav-fixed a")
      // Remove links that don't actually link to anything
      .on("click", function (event) {
        // On-page links
        if (
          location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
          location.hostname == this.hostname
        ) {
          // Figure out element to scroll to
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          // Does a scroll target exist?
          if (target.length) {
            // Only prevent default if animation is actually gonna happen
            event.preventDefault();
            $('html, body').animate({
              scrollTop: target.offset().top - 90
            }, 1000, function () {
              // Callback after animation
              // Must change focus!
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) { // Checking if the target was focused
                return false;
              } else {
                $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                $target.focus(); // Set focus again
              };
            });
          }
        };
        $('.sidebar-nav-fixed a').each(function () {
          $(this).removeClass('active');
        })
        $(this).addClass('active');
      });
  }

  // Check all for  checkbox

  if ($("#checkAll").length) {
    $("#checkAll").on("click", function () {
      $('input:checkbox').not(this).prop('checked', this.checked);
    });
  }

  // Btn icon for active
  if ($("#btn-icon").length) {
    $('.btn-icon').on("click", function () {
      $(this).parent().addClass('active').siblings().removeClass('active')
    })
  }

  //  Stopevent for dropdown

  if ($(".stopevent").length) {
    $(document).on("click.bs.dropdown.data-api", ".stopevent", function (e) {
      e.stopPropagation();
    });
  }

  //  Input tags (Tagify)

  if ($("input[name=tags]").length) {
    var input = document.querySelector('input[name=tags]');
    new Tagify(input)

  }

  //  Typed js

  if ($(".headingTyped").length) {
    var typed = new Typed('.headingTyped', {
      strings: ["Skills", "Products ", "Teams", "Future"],
      typeSpeed: 40,
      backSpeed: 40,
      backDelay: 1000,
      loop: true
    });
  }



  // validation js

  if ($(".needs-validation").length) {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

  }


// toast

  if ($(".toast").length) {
  var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function (toastEl) {
  return new bootstrap.Toast(toastEl)
})

  }


// offcanvas
  if ($(".offcanvas").length) {
  var offcanvasElementList = [].slice.call(document.querySelectorAll('.offcanvas'))
var offcanvasList = offcanvasElementList.map(function (offcanvasEl) {
  return new bootstrap.Offcanvas(offcanvasEl)
})

  }

// dropdown toggle
if ($(".dropdown-toggle").length) {
  var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
  var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
    return new bootstrap.Dropdown(dropdownToggleEl)
  })
}



if ($('#dataTableBasic').length){
  $(document).ready(function() {
    $('#dataTableBasic').DataTable({

      responsive: true


    });
} );
}
if ($('#liveAlertPlaceholder').length){
var alertPlaceholder = document.getElementById('liveAlertPlaceholder')
var alertTrigger = document.getElementById('liveAlertBtn')

function alert(message, type) {
  var wrapper = document.createElement('div')
  wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

  alertPlaceholder.append(wrapper)
}

if (alertTrigger) {
  alertTrigger.addEventListener('click', function () {
    alert('Nice, you triggered this alert message!', 'success')
  })
}
}

})();