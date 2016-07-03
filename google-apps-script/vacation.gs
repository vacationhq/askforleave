var vacationDataParser = function(data, row) {
  var vacation = {
    row:        row,
    timestamp:  data.getRange(row, 1).getValue(),
    user:       data.getRange(row, 2).getValue(),
    type:       data.getRange(row, 3).getValue(),
    beginDate:  data.getRange(row, 4).getValue(),
    days:       data.getRange(row, 5).getValue(),
    dirtyFlag:  data.getRange(row, 6).getValue(),
    endDate:    "",
    Date:       ""
  };
  if (typeof vacation.days !== "number") {
    return None;
  }

  if (vacation.days <= 0) {
    return None;
  }
  var beginWeekday = vacation.beginDate;
  if (beginWeekday == 0 || beginWeekday == 6) {
    Logger.log("The begin date is not permitted")
  }

  if (vacation.days <= 1) {
    vacation.Date = Utilities.formatDate(vacation.beginDate, 'GMT+8', 'yyyy-MM-dd');
  }
  else {
    vacation.Dates = [];
    var tmpDate = vacation.beginDate;
    for (var i = vacation.days; i > 0; i--) {
      if (tmpDate.getDay() == 0 || tmpDate.getDay() == 6) {
        i++;
      } else {
        vacation.endDate = tmpDate
        if (i >= 1) {
          vacation.Dates.push(tmpDate);
        } else {
          // Deal with half day if possible
          vacation.Dates.push(tmpDate);
        }
      }
      tmpDate = new Date(tmpDate.getTime() + (24*3600*1000));
    }
    vacation.Date = Utilities.formatDate(vacation.beginDate, 'GMT+8', 'yyyy-MM-dd') + " - " + Utilities.formatDate(vacation.endDate, 'GMT+8', 'yyyy-MM-dd');
  }
  return vacation;
}

var addEventToCalendar = function(calendarID, vacation) {
  if (calendarID == '') {
    return;
  }
  var calendar = CalendarApp.getCalendarById(calendarID);

  if (vacation.days <= 1) {
    calendar.createAllDayEvent(vacation.user + " " + vacation.type, vacation.beginDate);
  }
  else {
    for (var i=vacation.Dates.length - 1; i>=0; i--){
      calendar.createAllDayEvent(vacation.user + " " + vacation.type, vacation.Dates[i]);
    }
  }
}

var sendEventToSlack = function(slackURL, slackChannel, vacation) {
  if (slackURL == '' || slackChannel == '') {
    return;
  }

  // prepare slack message
  var payload = {
    "channel": slackChannel,
    "username": "請假小幫手",
    "icon_emoji": ":memo:",
    "link_names": 1,
    "attachments":[
       {
          "fallback": "This is an update from a Slackbot integrated into your organization. Your client chose not to show the attachment.",
          "pretext": "我們剛剛收到一封請假通知......",
          "mrkdwn_in": ["pretext"],
          "color": "#A6E061",
          "fields":[
             {
                "title": "員工信箱 Employee Email",
                "value": vacation.user,
                "short": false
             },
             {
                "title": "假別 Vacation Type",
                "value": vacation.type,
                "short": false
             },
             {
                "title": "日期 Vacation Date",
               "value": vacation.Date + " (" + vacation.days + (vacation.days <= 1 ? " day" : " days)"),
                "short": false
             }
          ]
       }
    ]
  };

  var options = {
    'method': 'post',
    'payload': JSON.stringify(payload)
  };

  UrlFetchApp.fetch(slackURL, options);
}

function vacation() {
  /*
   * trigger when someone submits the form
   * 1. add an event to calendar
   * 2. send a message to slack
   */

  // the sheet for form data is called "data"
  var sheetName = 'data';
  var calendarID = '';
  var slackURL = '';
  var slackChannel = '#random';

  var data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  var lastRow = data.getLastRow();

  for (var row = lastRow; row >= 2; row--) {
    var vacation = vacationDataParser(data, row);
    if (vacation && vacation.dirtyFlag != true) {
      addEventToCalendar(calendarID, vacation);
      sendEventToSlack(slackURL, slackChannel, vacation);
      data.getRange(vacation.row, 6).setValue(true);
      Logger.log("Trigger vacation by " + vacation.user + " in row " + vacation.row);
    }
    else {
      Logger.log("Done");
      break;
    }
  }
}
