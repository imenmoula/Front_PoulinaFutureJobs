/*! -----------------------------------------------------------------------------------

    Template Name: Cuba Admin
    Template URI: http://admin.pixelstrap.com/cuba/template
    Description: This is Admin theme
    Author: Pixelstrap
    Author URI: https://themeforest.net/user/pixelstrap

-----------------------------------------------------------------------------------

        01. password show hide
        02. Background Image js
        03. sidebar filter
        04. Language js
        05. Translate js

 --------------------------------------------------------------------------------- */


 
 (function ($) {
  "use strict";

  // Ripple Effect (Fixed)
  (function ($, window, document, undefined) {
    var $ripple = $(".js-ripple");
    if ($ripple.length) {
      $ripple.on("click.ui.ripple", function (e) {
        var $this = $(this);
        var $parent = $this.parent();
        if ($parent.length && $parent.offset()) { // Check parent exists
          var $offset = $parent.offset();
          var $circle = $this.find(".c-ripple__circle");
          if ($circle.length) {
            var x = e.pageX - $offset.left;
            var y = e.pageY - $offset.top;
            $circle.css({
              top: y + "px",
              left: x + "px",
            });
            $this.addClass("is-active");
          }
        }
      });
      $ripple.on("animationend webkitAnimationEnd oanimationend MSAnimationEnd", function (e) {
        $(this).removeClass("is-active");
      });
    }
  })(jQuery, window, document);

  // Sidebar Toggle (Fixed)
  $(".md-sidebar .md-sidebar-toggle").on("click", function (e) {
    var $sidebarAside = $(".md-sidebar .md-sidebar-aside");
    if ($sidebarAside.length) { // Check element exists
      $sidebarAside.toggleClass("open");
    }
  });

  // Chat Menu (Fixed)
  $(".chat-menu-icons .toogle-bar").click(function () {
    var $chatMenu = $(".chat-menu");
    if ($chatMenu.length) { // Check element exists
      $chatMenu.toggleClass("show");
    }
  });

  // Rest of your script (with similar null checks applied)...
})(jQuery);
