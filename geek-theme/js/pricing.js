//
// Pricing js
//

'use strict';

(function () {

	var toggleSwitch = $("#pricing-switch input");
	$(toggleSwitch).on("change", function () {
		// Change prices for plans
		togglePriceContent();

		function togglePriceContent() {
			if ($(toggleSwitch).is(":checked") === true) {
				// if toggle is yearly
				$(".toggle-price-content").each(function () {
					$(this).html($(this).data("price-yearly"));
				});
			} else {
				// if toggle is monthly
				$(".toggle-price-content").each(function () {
					$(this).html($(this).data("price-monthly"));
				});
			}
		}

	});




})();


(function () {

var toggleSwitch = $("#pricing-switch-second input");
$(toggleSwitch).on("change", function () {
	// Change prices for plans
	togglePriceContent();

	function togglePriceContent() {
		if ($(toggleSwitch).is(":checked") === true) {
			// if toggle is yearly
			$(".toggle-price-content-second").each(function () {
				$(this).html($(this).data("price-yearly"));
			});
		} else {
			// if toggle is monthly
			$(".toggle-price-content-second").each(function () {
				$(this).html($(this).data("price-monthly"));
			});
		}
	}

});

})();