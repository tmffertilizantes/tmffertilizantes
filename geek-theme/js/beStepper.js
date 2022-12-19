//
// Be stepper js
//


'use strict';


	if ($('#courseForm').length) {
		var courseForm
		document.addEventListener('DOMContentLoaded', function () {
			courseForm = new Stepper(document.querySelector('#courseForm'), {
				linear: false,
				animation: true
			});
		});

	}
