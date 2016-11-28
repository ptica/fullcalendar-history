# fullcalendar-history

Persistent uris for fullcalendar views using history api.
The solution sort of works as a proof of concept, but a rewrite is needed though.
(ugly detection of today-button-click, no uri configuration, todos, no i18n, ...)

```
// hook history.pushState onto view rendering
$('#calendar').fullCalendar({
  viewRender: FullCalendarHistory.viewRender,
});

// bind clearing fcion upon today button click
$('.fc-today-button').click(function () {
  FullCalendarHistory.clearRemembered();
})

```
