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
  var slackChannel = '#general';

  var data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var calendar = CalendarApp.getCalendarById(calendarID);

  // get data
  var lastRow = data.getLastRow();
  var user = data.getRange(lastRow, 2).getValue();
  var vacationType = data.getRange(lastRow, 3).getValue();
  var beginDate = data.getRange(lastRow, 4).getValue();
  var days = data.getRange(lastRow, 5).getValue();
  var vacationDate;

  if (typeof days !== "number") {
    return false;
  }

  if (days <= 0) {
    return false;
  }

  if (days <= 1) {
    // send to google calendar
    calendar.createAllDayEvent(user + " " + vacationType, beginDate);
    vacationDate = Utilities.formatDate(beginDate, 'GMT+8', 'yyyy-MM-dd');
  } else {
    // use hack from https://code.google.com/p/google-apps-script-issues/issues/detail?id=952 #13 and #18
    // use calendar api: enable it in developer console first
    var endDate = new Date(new Date(beginDate).getTime() + Math.ceil(days) * (24*3600*1000));
    vacationDate = Utilities.formatDate(beginDate, 'GMT+8', 'yyyy-MM-dd') + " - " + Utilities.formatDate(endDate, 'GMT+8', 'yyyy-MM-dd');
    var event = {
      summary: user + " " + vacationType,
      start: {
        date: Utilities.formatDate(beginDate, 'GMT+8', 'yyyy-MM-dd')
      },
      end: {
        date: Utilities.formatDate(endDate, 'GMT+8', 'yyyy-MM-dd')
      }
    };

    event = Calendar.Events.insert(event, calendarID);
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
                "value": user,
                "short": false
             },
             {
                "title": "假別 Vacation Type",
                "value": vacationType,
                "short": false
             },
             {
                "title": "日期 Vacation Date",
               "value": vacationDate + " (" + days + (days <= 1 ? " day" : " days)"),
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
