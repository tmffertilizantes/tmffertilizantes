// Calendar js
if ($('#calendar').length) {
    document.addEventListener('DOMContentLoaded', function() {

        var todayDate = moment().startOf('day');
              var YM = todayDate.format('YYYY-MM');
              var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
              var TODAY = todayDate.format('YYYY-MM-DD');
              var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');

              var calendarEl = document.getElementById('calendar');
              var calendar = new FullCalendar.Calendar(calendarEl, {
                  headerToolbar: {
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                  },
                  height: 900,
                  contentHeight: 800,
                  aspectRatio: 3,
                  nowIndicator: true,
                  now: TODAY + 'T09:25:00',
                  initialView: 'dayGridMonth',
                  initialDate: TODAY,
                  editable: true,
                  dayMaxEvents: true,
                  navLinks: true,
                  events: [
                      {
                          title: 'All Day Event',
                          start: YM + '-01',
                          description: 'Toto lorem ipsum dolor sit incid idunt ut'

                      },
                      {
                          title: 'Reporting',
                          start: YM + '-14T13:30:00',
                          description: 'Lorem ipsum dolor incid idunt ut labore',
                          end: YM + '-14',

                      },
                      {
                          title: 'Company Meeting',
                          start: YM + '-05',
                          description: 'Lorem ipsum dolor sit tempor incid',
                          end: YM + '-03',
                      },
                      {
                          title: 'Mexo 2021 - Product Release',
                          start: YM + '-02',
                          description: 'Lorem ipsum dolor sit tempor inci',
                          end: YM + '-04'

                      },
                      {
                          title: 'Dinner',
                          start: YM + '-12',
                          description: 'Lorem ipsum dolor sit amet, conse ctetur',
                          end: YM + '-10'
                      },
                      {
                          id: 999,
                          title: 'Repeating Event',
                          start: YM + '-09T16:00:00',
                          description: 'Lorem ipsum dolor sit ncididunt ut labore'

                      },
                      {
                          id: 1000,
                          title: 'Repeating Event',
                          description: 'Lorem ipsum dolor sit amet, labore',
                          start: YM + '-16T16:00:00'
                      },
                      {
                          title: 'Conference',
                          start: YESTERDAY,
                          end: TOMORROW,
                          description: 'Lorem ipsum dolor eius mod tempor labore'
                      },
                      {
                          title: 'Meeting',
                          start: TODAY + 'T10:30:00',
                          end: TODAY + 'T12:30:00',
                          description: 'Lorem ipsum dolor eiu idunt ut labore'
                      },
                      {
                          title: 'Lunch',
                          start: TODAY + 'T12:00:00',
                          description: 'Lorem ipsum dolor sit amet, ut labore'
                      },
                      {
                          title: 'Meeting',
                          start: TODAY + 'T14:30:00',

                          description: 'Lorem ipsum conse ctetur adipi scing'
                      },
                      {
                          title: 'Happy Hour',
                          start: TODAY + 'T17:30:00',
                          description: 'Lorem ipsum dolor sit amet, conse ctetur'
                      },
                      {
                          title: 'Dinner',
                          start: TOMORROW + 'T05:00:00',
                          description: 'Lorem ipsum dolor sit ctetur adipi scing'
                      },
                      {
                          title: 'Birthday Party',
                          start: TOMORROW + 'T07:00:00',
                          description: 'Lorem ipsum dolor sit amet, scing'
                      },
                      {
                          title: 'Click for Google',
                          url: 'http://google.com/',
                          start: YM + '-28',
                          description: 'Lorem ipsum dolor sit amet, labore'
                      }
                  ]
              });
              calendar.render();
      });
    }