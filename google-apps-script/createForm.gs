function createForm(){
  // Create a new form
  var form = FormApp.create('AskforLeaveForm');
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Update the form's response destination.
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());  
  
  // Remove the sheet "data" because a new response sheet will be created while creating a new form.
  var sheet = ss.getSheetByName("data");
  ss.deleteSheet(sheet);
  
  // Modify the response sheet's name
  ss.getSheets()[0].setName("data");
  form.setTitle('請假申請單 Ask for Leave')
      .setDescription('這邊可以填一堆請假的注意事項。例如這樣：\n\n1. 告知部門主管，並獲得同意（如「我這週三下午要請半天假，跟貓咪出去玩」）\n2. 填寫請假申請單\n3. 用信件通知大家')
  
  form.addPageBreakItem().setTitle('選擇假別 Vacation Type');

  form.addTextItem()
      .setTitle('你的 Email')
      .setRequired(true);
  form.addListItem()
      .setTitle('假別 Vacation Type')
      .setChoiceValues(['事假 Personal Leave', '病假 Sick Leave', '婚假 Marriage Leave', '喪假 Funeral Leave', '生理假 Menstruation Leave', '公假 Official Leave', '產假 Maternity Leave', '陪產假 Patermity Leave', '彈性休假 Flexible time off'])
      .setRequired(true);
  form.addDateItem()
      .setTitle('開始日期 Multi-date: Begin Date')
      .setHelpText('e.g. 2016/04/01 10:00')
      .setRequired(true);
  form.addListItem()
      .setTitle('請假天數 How many days')
      .setHelpText('0.5 天可以是上半天、下半天、主管同意的時間')
      .setChoiceValues([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5])
      .setRequired(true);

  Logger.log('Published URL: ' + form.getPublishedUrl());
  Logger.log('Editor URL: ' + form.getEditUrl());
}
