$(function() {
	// we get a normal Location object

	/*
	* Note, this is the only difference when using this library,
	* because the object window.location cannot be overriden,
	* so library the returns generated "location" object within
	* an object window.history, so get it out of "history.location".
	* For browsers supporting "history.pushState" get generated
	* object "location" with the usual "window.location".
	*/
	var location = window.history.location || window.location;

	window.FullCalendarHistory = {};
	FullCalendarHistory.viewRender = function (view, element) {
		if (history && FullCalendarHistory.on_navigation) {
			var url;
			if (0 && typeof(event) != 'undefined' && event.target && $(event.target).hasClass('fc-today-button')) {
				// event is not accessible in firefox
				// TODO will need some other means of clearing the remembered date
				// FullCalendarHistory.clearRemembered();
				// clear called in onClick event handler directly on the button
				// TODO but that makes the library usage a bit more complex
				// as the clearRemembered has to be binded once the calendar is instantiated
				// TODO so still try to detect the today button in here after all
			} else {
				var tx = {
					'month': 'month',
					'agendaWeek': 'week',
					'agendaDay': 'day',
					'customYear': 'year'
				};
				var view_name = tx[view.name];
				var start = view.intervalStart.format('YYYY-MM-DD');
				url = location.pathname.replace(/\/(year|month|week|day)\/[-0-9]{10}/, '') + '/' + view_name + '/' + start;
				history.pushState({ viewName : view.name, start:start }, 'Kalendář - ' + start , url);
				$.cookie('fullcalendar-history-view-name', view_name, { expires: 7, path: '/' });
				$.cookie('fullcalendar-history-start', start, { expires: 7, path: '/' });
			}
		}
		FullCalendarHistory.on_navigation = true;
	};
	FullCalendarHistory.clearRemembered = function () {
		// today button = clear remembered date
		// bind in the calendar.ctp
		url = location.pathname.replace(/\/(year|month|week|day)\/[-0-9]{10}/, '');
		history.pushState(null, 'Kalendář - nyní', url);
		$.removeCookie('fullcalendar-history-view-name', { path: '/' });
		$.removeCookie('fullcalendar-history-start', { path: '/' });
	};
});

if ( window.history && window.history.pushState ) {
	$(window).on( "popstate", function (event) {
		event = event.originalEvent;
		if (event.state) {
			FullCalendarHistory.on_navigation = false; //don't re-push state
			$('#calendar').fullCalendar('gotoDate', event.state.start);
			FullCalendarHistory.on_navigation = false; //don't re-push state
			$('#calendar').fullCalendar('changeView', event.state.viewName);
		} else {
			// once we push, the back button will resort to popping
			// and the first backbutton press will not reload the last page
			// so we do it manually here
			// todo: replaceState on initial render is probably preferred
			$.removeCookie('fullcalendar-history-view-name', { path: '/' });
			$.removeCookie('fullcalendar-history-start', { path: '/' });
			location.reload();
		}
	});
}
