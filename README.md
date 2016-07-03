# AskForLeave

AskForLeave is a simple vacation tool for small startups. It is done by Google Form + Spreadsheets with lots of formulas. You can add Google Apps Scripts to integrate with Google Calendar, Slack, ...

## What does it do?


## Install

1. Copy the sample spreadsheet: [ask-for-leave template](https://docs.google.com/spreadsheet/ccc?key=1278CFK8m2w6NY4JN9T4GfSPsVxlGi1P4W2Ndo6cQlC8&newcopy=true)
2. Create a form like this: http://goo.gl/forms/PPZLpVOdHP , screenshot: https://www.dropbox.com/s/gbwv3rhumiirzuk/google-form-setting.png?dl=0
3. Link the form to our copied spreadsheet. There will be a newly created sheet in your spreadsheet. You **MUST** set the sheet name into your `vacation.gs`
4. From the menu in the spreadsheet, click **Tools** > **Script Editor...** 
5. In the script editor, patch the **vacation** code using the updated in `vacation.gs` (Include all correct configurations. For more detail, see [below](#configurations).)
6. From the menu in the script editor, choose **Resources** > **Current project's triggers** and add the script **vacation** as a trigger of form submission.

### Configurations

All configurations are stored on the top of `vacation.gs`

* For Google Calendar integration, setting `calendarID`
* For Slack integration, setting both `slackURL` and `slackChannel`

## Can I import my existing data?

(WIP) Yes, you can create a sheet called `imported`, and use the same data format of the `data` sheet.

## Contributing

* Aki Chiu
* Even Wu for the logo of [dayoff bot](https://github.com/vacationhq/hubot-dayoff)
* Liang-Bin Hsueh
* Mosky
* Paris Tsai
* Vikky Huang for the logo of [VacationHQ](https://github.com/vacationhq) organization
* Yuren Ju

## Licensing

MIT License.

