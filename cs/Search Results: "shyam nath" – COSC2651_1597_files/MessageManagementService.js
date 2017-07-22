
// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (MessageManagementService == null) var MessageManagementService = {};
MessageManagementService._path = '/webapps/discussionboard/dwr';
MessageManagementService.setDetailPageSetting = function(p0, p1, callback) {
  dwr.engine._execute(MessageManagementService._path, 'MessageManagementService', 'setDetailPageSetting', p0, p1, callback);
}
MessageManagementService.setMessageReadState = function(p0, p1, p2, callback) {
  dwr.engine._execute(MessageManagementService._path, 'MessageManagementService', 'setMessageReadState', p0, p1, p2, callback);
}
