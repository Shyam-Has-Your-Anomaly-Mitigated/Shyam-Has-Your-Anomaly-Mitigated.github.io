
// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (MessageTaggingService == null) var MessageTaggingService = {};
MessageTaggingService._path = '/webapps/discussionboard/dwr';
MessageTaggingService.removeTagFromMessage = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(MessageTaggingService._path, 'MessageTaggingService', 'removeTagFromMessage', p0, p1, p2, p3, callback);
}
MessageTaggingService.addTagToMessages = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(MessageTaggingService._path, 'MessageTaggingService', 'addTagToMessages', p0, p1, p2, p3, callback);
}
MessageTaggingService.addTagToMessage = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(MessageTaggingService._path, 'MessageTaggingService', 'addTagToMessage', p0, p1, p2, p3, callback);
}
