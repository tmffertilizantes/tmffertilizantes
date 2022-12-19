// countdown js

// Get the date
(function() {

    'user strict'

    function e() {
        var e = new Date;
        e.setDate(e.getDate() + 99);

        var dd = e.getDate();
        var mm = e.getMonth() + 1;
        var y = e.getFullYear();

        var futureFormattedDate = mm + "/" + dd + "/" + y + ' 12:00:00';

        return futureFormattedDate;
    }

    $('.countdown').downCount({
        date: e(),
        offset: 0
    });

    })();