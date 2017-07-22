/*
Function library for all message detail page javascript operations
includes AJAX loads for thread div and message div
includes all UI switches and js functions in links
on the page, and includes settings for stickiness of UI switches.
 */

var Message =
{};

Message.collapsedMessageClass = 'collapsedMessage';
Message.collapsedMsgWithInlinePostClass = 'collapsedMsgWithInlinePost';

/**
 * Function to update message counts when the tree is reloaded.
 *
 * @param int totalCount the new total count
 * @param int unreadCount the new unread count (if > 0, collection link will be activated )
 */
function updateMessageCounts( totalCount, unreadCount )
{
  if ( totalCount )
  {
    var totalSpan = $( "totalPostsCount" );
    totalSpan.innerHTML = totalCount;
  }

  if ( unreadCount !== undefined )
  {
    var unreadSpan = $( "unreadPostsCount" );
    if ( unreadCount > 0 )
    {
      // collectUnreadUrl is defined in message_detail page
      unreadSpan.innerHTML = '<a href=\"' + window.collectUnreadUrl + "\">" + unreadCount + "</a>";
    }
    else
    {
      unreadSpan.innerHTML = unreadCount;
    }
  }
}

/**
 * Function to update the age of all the messages on the page with its last posted/edited dates
 */
function updateMessageAge()
{
  var allMessageAgeSpanElemInThreadTree = $( 'forumMessagesContainer' ).select( 'span.db_msg_age' );
  var currSpanElement, timesToParse, timesArray, postedTimeInMillis, editedTimeInMillis, postedTimeInBBFormat, editedTimeInBBFormat;
  var timeDataForPost, timeDataForEdit, postTimeBBLocalString, editedTimeBBLocalString;
  var currentTimeInMillis = new Date().getTime();

  // update the age of the message within the span block
  for ( var i = 0; i < allMessageAgeSpanElemInThreadTree.length; i++ )
  {
    currSpanElement = allMessageAgeSpanElemInThreadTree[ i ];
    postedTimeInMillis = currSpanElement.getAttribute( 'postedTimeInMillis' );
    editedTimeInMillis = currSpanElement.getAttribute( 'editedTimeInMillis' );
    postedTimeInBBFormat = currSpanElement.getAttribute( 'postedTimeInBBFormat' );
    editedTimeInBBFormat = currSpanElement.getAttribute( 'editedTimeInBBFormat' );

    if ( !postedTimeInMillis || !editedTimeInMillis || !postedTimeInBBFormat || !editedTimeInBBFormat )
    {
      continue; // no time specified
    }
    else
    {
      timeDataForPost = calendar.util.getTimeSpan( currentTimeInMillis, postedTimeInMillis, "dbui.message.age",
                                                   "dbui.message.age.negative.time", true, true );
      timeDataForEdit = calendar.util.getTimeSpan( currentTimeInMillis, editedTimeInMillis, "dbui.message.age",
                                                   "dbui.message.age.negative.time", true, true );
    }

    if ( timeDataForPost && timeDataForEdit )
    {
      // show 'post date' in 'n days ago' format without preceding 'posted' part
      // 'post time' being the same as 'edit time' implies that this message was never edited since posting
      if ( postedTimeInMillis === editedTimeInMillis )
      {
        currSpanElement.innerHTML = timeDataForPost.timeWords;
        $( currSpanElement.id + '_md' ).innerHTML = postedTimeInBBFormat;
      }
      else
      {
        // show 'post date' in addition to 'edit date' the line below
        // time span since 'post date' and 'edit date' are different on the granularity level ex. years, months, hours,
        // days, minutes
        // right after editing a message timeDataForEdit.timeDelta is usually 0. without testing for 'undefined' JS
        // interprets
        // this as 'false' thus skipping the block inside the if and failing to update this message age
        if ( timeDataForPost.key &&
             timeDataForEdit.key &&
             typeof timeDataForPost.timeDelta !== 'undefined' &&
             typeof timeDataForEdit.timeDelta !== 'undefined' &&
             ( timeDataForPost.key != timeDataForEdit.key || ( timeDataForPost.key === timeDataForEdit.key && timeDataForPost.timeDelta != timeDataForEdit.timeDelta ) ) )
        {
          timeDataForPost = calendar.util.getTimeSpan( currentTimeInMillis, postedTimeInMillis,
                                                       "dbui.message.age.posted", "dbui.message.age.negative.time",
                                                       true, true );
          timeDataForEdit = calendar.util.getTimeSpan( currentTimeInMillis, editedTimeInMillis,
                                                       "dbui.message.age.edited", "dbui.message.age.negative.time",
                                                       true, true );
          currSpanElement.innerHTML = timeDataForPost.timeWords + ' ('+timeDataForEdit.timeWords+')';

          postTimeBBLocalString = page.bundle.getString( "dbui.message.age.posted.title", postedTimeInBBFormat );
          editedTimeBBLocalString = page.bundle.getString( "dbui.message.age.edited.title", editedTimeInBBFormat );
          $( currSpanElement.id + '_md' ).innerHTML = postTimeBBLocalString + '<br>' + editedTimeBBLocalString;
        }
        // show 'edit date' only in 'n days ago' format without preceding 'last edited' part
        // time span since 'post date' and 'edit date' are the same on the granularity level ex. years, months, hours,
        // days, minutes
        else
        {
          currSpanElement.innerHTML = timeDataForEdit.timeWords;
          $( currSpanElement.id + '_md' ).innerHTML = editedTimeInBBFormat;
        }
      }
    }
  }
}

/**
 * Function to decrement the unread count after clicking on an unread message or its read/unread icon
 *
 * @param decrementBy the number to decrement the unread count by; if not provided it will be decremented by 1
 */
function decrementUnreadCount( decrementBy )
{
  var unreadSpan = $( "unreadPostsCount" );

  var anchor = unreadSpan.getElementsByTagName( "a" );
  var currentUnreadCount;
  if ( anchor.length > 0 )
  {
    currentUnreadCount = parseInt( anchor[ 0 ].innerHTML, 10 );
  }
  else
  {
    currentUnreadCount = parseInt( unreadSpan.innerHTML, 10 );
  }

  if ( decrementBy === undefined )
  {
    decrementBy = 1;
  }

  if ( currentUnreadCount > decrementBy - 1 )
  {
    updateMessageCounts( null, currentUnreadCount - decrementBy );
  }
}

/**
 * Function to increment the unread count after clicking on the read/unread icon of a read message
 *
 * @param incrementBy the number to increment the unread count by; if not provided it will be incremented by 1
 */
function incrementUnreadCount( incrementBy )
{
  var unreadSpan = $( "unreadPostsCount" );

  var anchor = unreadSpan.getElementsByTagName( "a" );
  var currentUnreadCount;
  if ( anchor.length > 0 )
  {
    currentUnreadCount = parseInt( anchor[ 0 ].innerHTML, 10 );
  }
  else
  {
    currentUnreadCount = parseInt( unreadSpan.innerHTML, 10 );
  }

  if ( incrementBy === undefined )
  {
    incrementBy = 1;
  }

  if ( currentUnreadCount >= 0 )
  {
    updateMessageCounts( null, currentUnreadCount + incrementBy );
  }
}

/*
 * load the contents of an href into the destination element @param href URL to send through @param destination tree DIV
 * or message DIV @param isPost boolean specifying whether to use POST or GET. Default is GET. @param
 * customResponseHandler custom callback method to be used as a response handler function
 */
function loadDiv( href, destStr, isPost, customResponseHandler )
{
  var requestHref = href + "&req_timestamp=" + new Date().getTime() + '_' + Math.random();
  var method = 'get';
  var baseUrl = requestHref;
  var queryString = "";
  if ( isPost )
  {
    method = 'post';
    var sessionParamAndValue = "session=" + getCookie( 'JSESSIONID' );
    var splitRequestHref = requestHref.split( '?' );

    if ( splitRequestHref && splitRequestHref.length == 2 )
    {
      baseUrl = splitRequestHref[ 0 ];
      queryString = splitRequestHref[ 1 ] + '&' + sessionParamAndValue;
    }
    else
    {
      baseUrl = requestHref;
      queryString = sessionParamAndValue;
    }
  }

  doLoadAjax( baseUrl, method, destStr, customResponseHandler, queryString );
}

/*
 * post the contents of a form to an href, load the results into the element with ID of destStr @param href URL to send
 * through @param passedParams additional parameters to pass through @param customResponseHandler custom callback method
 * to be used as a response handler function
 */
function loadPostDiv( href, myForm, destStr, passedParams, customResponseHandler )
{
  // XSRF protection
  href += '&session=' + getCookie( 'JSESSIONID' );
  var params = '';
  if ( passedParams )
    params = passedParams;

  // TODO: In exactly what cases do we really need everything from the form here?
  var myFormElements = myForm.select( 'input' );
  for ( var i = 0; i < myFormElements.length; i++ )
  {
    if ( myFormElements[ i ].type != "checkbox" ||
         ( !passedParams && ( myFormElements[ i ].type == "checkbox" && myFormElements[ i ].checked ) ) )
    {
      if (!myFormElements[i].disabled) // skip disbled elements
      {
        params += myFormElements[ i ].name + "=" + escape( myFormElements[ i ].value ) + "&";
      }
    }
  }
  var method = 'post';
  doLoadAjax( href, method, destStr, customResponseHandler, params );
}

function doLoadAjax( href, method, destStr, customResponseHandler, params )
{
  var handler;
  var callback;
  if ( customResponseHandler )
  {
    callback = customResponseHandler;
    if ( params !== '' )
    {
      params += '&';
    }
    params += 'isAjax=true'; // let the server customize the response to avoid sending the tree back when we don't want
    // it
  }
  else
  {
    if ( destStr == "tree" )
      handler = MessageTree.populateTreeDivWOMsg;
    else
      handler = MessageTree.populateMessageDiv;
  }

  new Ajax.Request( href,
  {
      method : method,
      parameters : params,
      onSuccess : function( response )
      {
        if ( handler )
          handler( response.responseText );
        if ( typeof callback == 'function' )
          callback( response.responseText );
      },
      onFailure : function( response )
      {
        loadMessageFailure( response );
      }
  } );
}

function loadTreeAndScrollToMessage( messageId )
{
  loadTree();

  if ( messageId !== null )
  {
    document.observe( "messageTree:messagesLoadedAndExpanded", function( event )
    { 
      if ( $s("msg_" + messageId + 'Id') )
      {  
        // Document has loaded and the message tree has finished loading. Now ensure the specified message is visible
        window.location.hash = "#msg_" + messageId + 'Id';
        // Clean up the messageId. every time the function is called, the view port jumps to that message if the messageId is set, 
        // which is the 1st one in most cases
        messageId = null;
        // Stop observing since this is strictly for page load.
        document.stopObserving( "messageTree:messagesLoadedAndExpanded" );
      }
    } );
  }
}

// wrapper for loadDiv for the thread tree
function loadTree()
{
  $( 'content' ).addClassName( 'thread-detail-page' );
  loadDiv( window.treeUrl, 'tree', false );
}

function previousMessage( thread_id, current_message_id )
{
  var previousMsgId = getPreviousMessageId( current_message_id );
  if ( previousMsgId !== null )
  {
    var prevMessageDivElem = $( "message_" + previousMsgId );
    displayMessage( thread_id, previousMsgId, false, true );
    prevMessageDivElem.parentNode.scrollIntoView();
  }
}

function nextMessage( thread_id, current_message_id )
{
  var nextMsgId = getNextMessageId( current_message_id );
  if ( nextMsgId !== null )
  {
    var nextMessageDivElem = $( "message_" + nextMsgId );
    displayMessage( thread_id, nextMsgId, false, true );
    nextMessageDivElem.parentNode.scrollIntoView();
  }
}

function getPreviousMessageId( current_message_id )
{
  var currentMessageDiv = $( 'message_' + current_message_id );
  var prevMessageWrapperDiv = null;
  var prevMessageWrapperDivCandidateParent = null;

  // get the previous message in the same reply block
  var prevMessageWrapperDivCandidate = currentMessageDiv.parentNode.previousElementSibling;
  if ( prevMessageWrapperDivCandidate && prevMessageWrapperDivCandidate.hasClassName( 'db-message-wrapper' ) )
  {
    prevMessageWrapperDiv = prevMessageWrapperDivCandidate;
  }

  // current message could be the first reply message within reply block. get the last message in the previous reply
  // block
  if ( !prevMessageWrapperDiv )
  {
    if ( currentMessageDiv.parentNode.parentNode )
    {
      prevMessageWrapperDivCandidateParent = currentMessageDiv.parentNode.parentNode.previousElementSibling;
    }
    if ( prevMessageWrapperDivCandidateParent && prevMessageWrapperDivCandidateParent.hasClassName( 'db-reply-block' ) )
    {
      prevMessageWrapperDiv = prevMessageWrapperDivCandidateParent.children[ prevMessageWrapperDivCandidateParent.childElementCount - 1 ];
    }
  }

  // current message must be the first reply message within the very first reply block. get the top/parent message as
  // the previous message
  if ( !prevMessageWrapperDiv )
  {
    if ( currentMessageDiv.parentNode.parentNode )
    {
      prevMessageWrapperDivCandidateParent = currentMessageDiv.parentNode.parentNode.parentNode;
    }
    if ( prevMessageWrapperDivCandidateParent &&
         prevMessageWrapperDivCandidateParent.hasClassName( 'dbThreadDetailTree' ) )
    {
      prevMessageWrapperDiv = prevMessageWrapperDivCandidateParent.children[ 0 ];
    }
  }

  // current message must be the top/parent message. return the very last message of the very last reply block as the
  // previous message
  if ( !prevMessageWrapperDiv )
  {
    var prevMessageWrapperDivCandidateGrandParent = currentMessageDiv.parentNode.parentNode;
    if ( prevMessageWrapperDivCandidateGrandParent &&
         prevMessageWrapperDivCandidateGrandParent.hasClassName( 'dbThreadDetailTree' ) )
    {
      for ( var i = 0; i < prevMessageWrapperDivCandidateGrandParent.childElementCount; i++ )
      {
        prevMessageWrapperDivCandidateParent = prevMessageWrapperDivCandidateGrandParent.children[ prevMessageWrapperDivCandidateGrandParent.childElementCount -
                                                                                                   i - 1 ];
        if ( prevMessageWrapperDivCandidateParent &&
             prevMessageWrapperDivCandidateParent.hasClassName( 'db-reply-block' ) )
        {
          prevMessageWrapperDiv = prevMessageWrapperDivCandidateParent.children[ prevMessageWrapperDivCandidateParent.childElementCount - 1 ];
          break;
        }
      }
    }
  }

  if ( prevMessageWrapperDiv && prevMessageWrapperDiv.hasClassName( 'db-message-wrapper' ) )
  {
    return prevMessageWrapperDiv.id;
  }
  return null;
}

function getNextMessageId( current_message_id )
{

  var currentMessageDiv = $( 'message_' + current_message_id );
  var nextMessageWrapperDiv = null;
  var nextMessageWrapperDivCandidateParent = null;

  // get the next message in the same reply block
  var nextMessageWrapperDivCandidate = currentMessageDiv.parentNode.nextElementSibling;
  if ( nextMessageWrapperDivCandidate && nextMessageWrapperDivCandidate.hasClassName( 'db-message-wrapper' ) )
  {
    nextMessageWrapperDiv = nextMessageWrapperDivCandidate;
  }

  // current message is the top/parent message. get the first message in the next reply block
  if ( !nextMessageWrapperDiv )
  {
    nextMessageWrapperDivCandidateParent = currentMessageDiv.parentNode.nextElementSibling;
    if ( nextMessageWrapperDivCandidateParent && nextMessageWrapperDivCandidateParent.hasClassName( 'db-reply-block' ) )
    {
      nextMessageWrapperDiv = nextMessageWrapperDivCandidateParent.children[ 0 ];
    }

    if ( !nextMessageWrapperDiv )
    {
      // just getting the immediate parent node is not enough so we need to traverse up enough in order to get the
      // parent we want
      // get the next immediate reply of top/parent message
      var parentMsgDiv = page.util.upToClass( currentMessageDiv, 'db-message-wrapper' );

      if ( !nextMessageWrapperDiv && parentMsgDiv.next( '.db-reply-block' ) )
      {
        nextMessageWrapperDiv = parentMsgDiv.next( '.db-reply-block' ).down( '.db-message-wrapper' ); // go all the way
        // up and get the
        // first reply
        // block
      }
      if ( !nextMessageWrapperDiv )
      {
        nextMessageWrapperDiv = parentMsgDiv.next( '.db-message-wrapper' ); // go up within this reply block and get the
        // first db-message-wrapper
      }
    }
  }

  // current message could be the very last message within a reply block. get the first message in the next reply block
  // if there is
  if ( !nextMessageWrapperDiv )
  {
    if ( currentMessageDiv.parentNode.parentNode )
    {
      nextMessageWrapperDivCandidateParent = currentMessageDiv.parentNode.parentNode.nextElementSibling;
    }
    if ( nextMessageWrapperDivCandidateParent && nextMessageWrapperDivCandidateParent.hasClassName( 'db-reply-block' ) )
    {
      nextMessageWrapperDiv = nextMessageWrapperDivCandidateParent.children[ 0 ];
    }
  }

  // current message must be the very last reply message within the very last reply block. return the top/parent message
  // as the next message
  if ( !nextMessageWrapperDiv )
  {
    if ( currentMessageDiv.parentNode.parentNode )
    {
      nextMessageWrapperDivCandidateParent = currentMessageDiv.parentNode.parentNode.parentNode;
    }
    if ( nextMessageWrapperDivCandidateParent &&
         nextMessageWrapperDivCandidateParent.hasClassName( 'dbThreadDetailTree' ) )
    {
      nextMessageWrapperDiv = nextMessageWrapperDivCandidateParent.children[ 0 ];
    }
  }

  if ( nextMessageWrapperDiv && nextMessageWrapperDiv.hasClassName( 'db-message-wrapper' ) )
  {
    return nextMessageWrapperDiv.id;
  }
  return null;
}

// validation function to make sure at least one checkbox is checked
// and submit the result to the collectUrl (defined in the jsp)
function validateCollect( forumMessagesContainer )
{
  var isValidate = false;
  forumMessagesContainer.select( 'input[type=checkbox]' ).each( function( it )
  {
    if ( it.checked )
    {
      isValidate = true;
    }
  } );

  if ( !isValidate )
  {
    alert( window.strSelect );
    focusOnBulkActionMenu();
    return;
  }

  // clean embedded forms
  forumMessagesContainer.hide(); // The next line makes the screen look really bad as all the message contents
  // disappear. Hiding the whole thing first so it looks 'nicer'
  forumMessagesContainer.select( 'form' ).each( function( it )
  {
    it.remove();
  } );

  var collectForm = new Element( 'form',
  {
    method : 'post'
  } );
  forumMessagesContainer.insert(
  {
    after : collectForm
  } );
  $( collectForm ).insert( forumMessagesContainer );
  $( 'top_list_action_bar' ).hide();
  $( 'bottom_list_action_bar' ).hide();
  $( 'collectLoadingMsg' ).show();
  // XSRF protection
  var url = window.collectUrl + '&session=' + getCookie( 'JSESSIONID' );
  collectForm.action = url;
  collectForm.submit();
}

/**
 * Mark read all the messages for which checkboxes are selected check if at least one checkbox was selected; show an
 * alert message if not
 */
function bulkMarkRead()
{
  bulkOperation( window.markReadUrl, updateMsgReadStatusIconAndReadCountRead );
}

/**
 * Mark unread all the messages for which checkboxes are selected check if at least one checkbox was selected; show an
 * alert message if not
 */
function bulkMarkUnread()
{
  bulkOperation( window.markUnreadUrl, updateMsgReadStatusIconAndReadCountUnread );
}

/**
 * Update the read icons/other read status signals(ex. bold font face)
 *
 * @param {Object} an array of msgIds to update the read status for
 */
function updateMsgReadStatusIconAndReadCountRead( arrayMsgIds, autoRead )
{
  var numberOfMsgReadStatusUpdates = 0;
  var updatedMsgIds = [];
  for ( var i = 0; i < arrayMsgIds.length; i++ )
  {
    if ( updateLinkClass( $( arrayMsgIds[ i ] + '_readTogIconLink' ), 'unreadmsg', 'readmsg',
                          "dbui.action.markasunread" ) )
    {
      numberOfMsgReadStatusUpdates++;
      updatedMsgIds.push( arrayMsgIds[ i ] );
    }
    $( arrayMsgIds[ i ] ).removeClassName( 'unreadmsg' );
    $( arrayMsgIds[ i ] ).addClassName( 'readmsg' );
    Message.setReadStatusDiv(arrayMsgIds[i], true);
    if ( autoRead )
    {
      $( arrayMsgIds[ i ] ).autoMarkedRead = true;
    }
    else
    {
      $( arrayMsgIds[ i ] ).userMarkedReadUnread = true;
    }
  }
  updateUnreadCountOnExpandCollapseLinks( updatedMsgIds );
  decrementUnreadCount( numberOfMsgReadStatusUpdates );
}

/**
 * Update the read icons/other read status signals(ex. bold font face)
 *
 * @param {Object} an array of msgIds to update the read status for
 */
function updateMsgReadStatusIconAndReadCountUnread( arrayMsgIds )
{
  var numberOfMsgReadStatusUpdates = 0;
  var updatedMsgIds = [];
  for ( var i = 0; i < arrayMsgIds.length; i++ )
  {
    if ( updateLinkClass( $( arrayMsgIds[ i ] + '_readTogIconLink' ), 'readmsg', 'unreadmsg', "dbui.action.markasread" ) )
    {
      numberOfMsgReadStatusUpdates++;
      updatedMsgIds.push( arrayMsgIds[ i ] );
    }
    $( arrayMsgIds[ i ] ).removeClassName( 'readmsg' );
    $( arrayMsgIds[ i ] ).addClassName( 'unreadmsg' );
    Message.setReadStatusDiv(arrayMsgIds[i], false);

    $( arrayMsgIds[ i ] ).userMarkedReadUnread = true;
  }
  updateUnreadCountOnExpandCollapseLinks( updatedMsgIds );
  incrementUnreadCount( numberOfMsgReadStatusUpdates );
}

Message.setReadStatusDiv = function(msgId, read)
{
  var container = $( msgId + '_readTogIconLink' ).up();
  if( container.down('div.hideoff')) container.down('div.hideoff').remove();
  if( read === true)
  {
    container.insert({top: new Element('div', {'class': 'hideoff', 'role':'alert'}).update(page.bundle.getString('message.status.read')) });
  }
  else
  {
    container.insert({top: new Element('div', {'class': 'hideoff', 'role':'alert'}).update(page.bundle.getString('message.status.unread')) } );
  }
};

Message.setFlagStatusDiv = function(msgId, flag)
{
  var container = $( msgId + '_flagTogIconLink' ).up();
  if( container.down('div.hideoff')) container.down('div.hideoff').remove();
  if( flag === true)
  {
    container.insert({top: new Element('div', {'class': 'hideoff', 'role':'alert'}).update(page.bundle.getString('message.status.flagOn')) });
  }
  else
  {
    container.insert({top: new Element('div', {'class': 'hideoff', 'role':'alert'}).update(page.bundle.getString('message.status.flagOff')) } );
  }
};

/**
 * Update the unread children messages counts on all the expand/collapse links that the read status change of the
 * current message affects. Use this function to avoid unnecessary updates if it is within our hands. Note : Due to
 * having only 11 reply levels, all reply levels deeper than 11 are being considered to be reply level 11, thus this
 * function might do a little bit of unnecessary updates too for replies with reply levels deeper than 11.
 *
 * @param udpatedMsgIds : IDs of all the message that the read status have been changed
 * @param includeSelf : whether to update the link on the updated message itself as well or not
 */
function updateUnreadCountOnExpandCollapseLinks( updatedMsgIds, includeSelf )
{
  function getReplyLevel( msg )
  {
    for ( var i = 0; i < 12; i++ )
    {
      if ( msg.hasClassName( 'reply-lvl-' + i ) )
      {
        return i;
      }
    }
  }

  // we don't want to do same update more than once, so create a set(no duplicate items) of all the messages to update
  // expand/collapse links for
  var msgIdsToUpdate = [];
  var i;
  for ( i = 0; i < updatedMsgIds.length; i++ )
  {
    // we don't display expand/collapse link for the parent message
    // Note : if we decide to display expand/collapse for parent messages as well, then we just need to add logic to
    // update the link in the parent message
    if ( $( updatedMsgIds[ i ] ).hasClassName( 'reply-lvl-0' ) )
    {
      continue;
    }

    var allMsgsWithinTheReplyBlock = $( updatedMsgIds[ i ] ).up( 'div.db-reply-block' ).children;
    var startIndex;
    var startReplyLevelIndex;
    var j;
    for ( j = 0; j < allMsgsWithinTheReplyBlock.length; j++ )
    {
      if ( allMsgsWithinTheReplyBlock[ j ].id === updatedMsgIds[ i ].toString() )
      {
        startIndex = j;
        startReplyLevelIndex = getReplyLevel( allMsgsWithinTheReplyBlock[ j ] );
      }
    }

    if ( !includeSelf )
    {
      startIndex = startIndex - 1;
    }
    for ( j = startIndex; j >= 0; j-- )
    {
      if ( !allMsgsWithinTheReplyBlock[ j ].hasClassName( 'db-message-wrapper' ) )
      {
        // we are only interested in message wrapper divs
        continue;
      }
      var replyLevel = getReplyLevel( allMsgsWithinTheReplyBlock[ j ] );
      if ( replyLevel < startReplyLevelIndex )
      {
        // we want to update only the messages that need update (parent nodes)
        startReplyLevelIndex = replyLevel;

        // we want to update the messages only once
        if ( msgIdsToUpdate.indexOf( allMsgsWithinTheReplyBlock[ j ].id ) === -1 )
        {
          msgIdsToUpdate.push( allMsgsWithinTheReplyBlock[ j ].id );
        }
      }
    }
  }
  for ( i = msgIdsToUpdate.length - 1; i >= 0; i-- )
  {
    updateExpandCollapseLinks.call( $( msgIdsToUpdate[ i ] ), true );
  }
}

/**
 * Flag the message and call updateMsgFlagStatusAndIconSetFlag(...) to update message flag status and the flag icon
 *
 * @param {Object} msgId Id of the message to flag
 */
function setFlag( msgId )
{
  var queryString = "&message_id=" + msgId + "&formCBs=" + msgId;
  var usePostMethod = true;
  loadDiv( window.addFlagUrl + queryString, 'forumMessagesContainer', usePostMethod, function()
  {
    updateMsgFlagStatusAndIconSetFlag( [ this ] );
  }.bind( msgId ) );
}

/**
 * Clear the flag on the message and call updateMsgFlagStatusAndIconClearFlag(...) to update message flag status and the
 * flag icon
 *
 * @param {Object} msgId Id of the message to clear flag for
 */
function clearFlag( msgId )
{
  var queryString = "&message_id=" + msgId + "&formCBs=" + msgId;
  var usePostMethod = true;
  loadDiv( window.clearFlagUrl + queryString, 'forumMessagesContainer', usePostMethod, function()
  {
    updateMsgFlagStatusAndIconClearFlag( [ this ] );
  }.bind( msgId ) );
}

/**
 * Update the flag icons to flagged icons
 *
 * @param {Object} an array of msgIds to update the flag icons for
 */
function updateMsgFlagStatusAndIconSetFlag( arrayMsgIds )
{
  for ( var i = 0; i < arrayMsgIds.length; i++ )
  {
    updateLinkClass( $( arrayMsgIds[ i ] + '_flagTogIconLink' ), 'unflaggedmsg', 'flaggedmsg', "dbui.action.clearflag" );
    $( arrayMsgIds[ i ] ).removeClassName( 'unflaggedmsg' );
    $( arrayMsgIds[ i ] ).addClassName( 'flaggedmsg' );
    Message.setFlagStatusDiv( arrayMsgIds[ i ] , true );
  }
}

/**
 * Update the flag icons to unflagged icons
 *
 * @param {Object} an array of msgIds to update the flag icons for
 */
function updateMsgFlagStatusAndIconClearFlag( arrayMsgIds )
{
  for ( var i = 0; i < arrayMsgIds.length; i++ )
  {
    updateLinkClass( $( arrayMsgIds[ i ] + '_flagTogIconLink' ), 'flaggedmsg', 'unflaggedmsg', "dbui.action.setflag" );
    $( arrayMsgIds[ i ] ).removeClassName( 'flaggedmsg' );
    $( arrayMsgIds[ i ] ).addClassName( 'unflaggedmsg' );
    Message.setFlagStatusDiv( arrayMsgIds[i], false );
  }
}

/**
 * Update the icon image and the text of a link element by updating its class
 *
 * @param iconLinkElement html a tag element to replace image and the inner html text of
 * @param classToRemove class to remove; just adding a class if null
 * @param classToAdd class to add; just removing a class if null
 * @return true if updated; false if not updated(update was not necessary)
 */
function updateLinkClass( iconLinkElement, classToRemove, classToAdd, textToUpdateWithBundleKey )
{
  var txt = page.bundle.getString( textToUpdateWithBundleKey );
  var changeText = false;
  if ( classToRemove && classToAdd )
  {
    if ( iconLinkElement.hasClassName( classToRemove ) )
    {
      iconLinkElement.removeClassName( classToRemove );
      iconLinkElement.addClassName( classToAdd );
      changeText = true;
    }
  }
  else if ( classToRemove )
  {
    if ( iconLinkElement.hasClassName( classToRemove ) )
    {
      iconLinkElement.removeClassName( classToRemove );
      changeText = true;
    }
  }
  else if ( classToAdd )
  {
    iconLinkElement.addClassName( classToAdd );
    changeText = true;
  }
  if ( changeText )
  {
    iconLinkElement.innerHTML = '<span class="hideoff">' + txt + '</span>';
    iconLinkElement.title = txt;
  }
  return changeText;
}

/**
 * Flag all the messages for which checkboxes are selected check if at least one checkbox was selected; show an alert
 * message if not
 */
function bulkSetFlag()
{
  bulkOperation( window.addFlagUrl, updateMsgFlagStatusAndIconSetFlag );
}

/**
 * Flag all the messages for which checkboxes are selected check if at least one checkbox was selected; show an alert
 * message if not
 */
function bulkClearFlag()
{
  bulkOperation( window.clearFlagUrl, updateMsgFlagStatusAndIconClearFlag );
}

/**
 * Bulk operation on all the messages for which checkboxes are selected check if at least one checkbox was selected;
 * show an alert message if not
 *
 * @param href URL to send through to the server for the bulk operation
 * @param ajaxCallbackFunc a function that updates the result of the successful ajax call on the client side
 */
function bulkOperation( href, ajaxCallbackFunc )
{
  var forumMessagesContainer = $( 'forumMessagesContainer' );
  var isAnyCheckboxSelected = false;
  var forumMessagesContainerElements = forumMessagesContainer.select( 'input' );
  var arrayMsgId = [];
  for ( var i = 0; i < forumMessagesContainerElements.length; i++ )
  {
    if ( forumMessagesContainerElements[ i ].type == "checkbox" )
    {
      if ( forumMessagesContainerElements[ i ].checked )
      {
        isAnyCheckboxSelected = true;
        arrayMsgId.push( forumMessagesContainerElements[ i ].value );
      }
    }
  }

  if ( isAnyCheckboxSelected )
  {
    loadPostDiv( href, forumMessagesContainer, 'tree', null, function()
    {
      ajaxCallbackFunc( this );
    }.bind( arrayMsgId ) );
    message_collection.theSelectAllCheckbox.onSelectAllClick( null, false );
  }
  else
  {
    alert( window.strSelect );
  }
  focusOnBulkActionMenu();
}

function focusOnBulkActionMenu()
{
  var menu = $('messageDetailActionMenu');
  if (menu)
  {
    menu.focus();
  }
}

/**
 * Toggles the flag status on the current message.
 *
 * @param {Object} msgId Id of the message to toggle the flag status
 */
function toggleFlagByIcon( msgId )
{
  if ( isMessageFlagged( msgId ) )
  {
    clearFlag( msgId );
  }
  else
  {
    setFlag( msgId );
  }
}

/**
 * Toggles the read status on the current message.
 *
 * @param {Object} msgId Id of the message to toggle the read status
 */
function toggleReadByIcon( msgId )
{
  if ( isMessageRead( msgId ) )
  {
    markUnread( msgId );
  }
  else
  {
    markRead( msgId );
  }
}

/**
 * Mark read a message and call updateMsgReadStatusIconAndReadCountRead(...) to update message read status on UI
 *
 * @param {Object} msgId Id of the message to mark read
 */
function markRead( msgId, autoRead )
{
  var msgWrapperDiv = $( msgId );
  if ( msgWrapperDiv.markReadSent )
  {
    // Do not resend the mark-read request if we're already waiting for a reply to an earlier mark-read request
    return;
  }
  Message.setReadStatusDiv( msgId, true );
  msgWrapperDiv.markReadSent = true;
  var paramsToPass = "formCBs=" + msgId + "&";
  loadPostDiv( window.markReadUrl, $( 'forumMessagesContainer' ), 'tree', paramsToPass, function( autoRead )
  {
    $( this ).markReadSent = false;
    updateMsgReadStatusIconAndReadCountRead( [ this ], autoRead );
  }.bind( msgId, autoRead ) );

}

/**
 * Mark unread a message and call updateMsgReadStatusIconAndReadCountUnread(...) to update message read status on UI
 *
 * @param {Object} msgId Id of the message to mark unread
 */
function markUnread( msgId )
{
  var paramsToPass = "formCBs=" + msgId + "&";
  loadPostDiv( window.markUnreadUrl, $( 'forumMessagesContainer' ), 'tree', paramsToPass, function()
  {
    updateMsgReadStatusIconAndReadCountUnread( [ this ] );
  }.bind( msgId ) );
  Message.setReadStatusDiv( msgId, false );
}

/**
 * Returns the read status on the current message based on the css class on the message wrapper div element
 *
 * @param {Object} msg_id id of the message to find out the read status of
 */
function isMessageRead( msg_id )
{
  if ( $( msg_id ).hasClassName( 'readmsg' ) )
  {
    return true;
  }
  return false;
}

/**
 * Returns the flag status on the current message based on the css class on the message wrapper div element
 *
 * @param {Object} msg_id id of the message to find out the flag status of
 */
function isMessageFlagged( msg_id )
{
  if ( $( msg_id ).hasClassName( 'flaggedmsg' ) )
  {
    return true;
  }
  return false;
}

// pass the search box form to the searchUrl (defined in the JSP)
function executeSearch()
{
  if ( validateForm( document.dateAvailabilityForm ) && calendar.DateTimePicker.validatePickers() )
  {
    document.dateAvailabilityForm.action = window.searchUrl;
    document.dateAvailabilityForm.submit();
  }
}

// synonym function for the refresh button
Message.refreshTree = function()
{
  if( Message.isReplyOpen)
    Message.showConfirmDialog( null, false, false, loadTree );
  else
    loadTree();
};

// catcher function for pressing return in the keyword search box
function checkSearch( evt )
{
  var name = navigator.appName;
  evt = evt ? evt : ( window.event ? window.event : null );
  if ( name == "Microsoft Internet Explorer" )
  {
    if ( evt.keyCode == 13 )
    {
      evt.keyCode = 9;
      executeSearch();
    }
  }
  else
  {
    if ( evt.which == 13 )
    {
      executeSearch();
    }
  }
}

function isMessageCollapsed( msgParentDiv )
{
  return page.util.hasClassName( msgParentDiv, Message.collapsedMessageClass );
}

function toggleMessageDisplay( event, threadId, currentMessageId, skipLinkCheck )
{
  if ( !skipLinkCheck )
  {
    if ( !event )
    {
      event = window.event;
    }
    // Do not toggle display if we're actually pointing at an anchor tag or any element that is a direct child of an
    // anchor tag.
    if ( event )
    {
      var tgt = event.target ? event.target : event.srcElement;
      while ( tgt && !tgt.hasClassName( 'db-message' ) )
      {
        if ( tgt.nodeName == 'A' )
        {
          return;
        }
        tgt = tgt.parentNode;
      }
    }
  }
  displayMessage(threadId,currentMessageId, null, false, true);
}

// show an element by changing the opacity setting on the element
function showMessageElementById( elemId )
{
  showMessageElement( $(elemId) );
}

// hide an element by changing the opacity setting on the element
function hideMessageElementById( elemId )
{
  hideMessageElement( $(elemId) );
}

// show an element by changing the opacity setting on the element
function showMessageElement( elem )
{
  if (elem)
  {
    elem.style.filter = "alpha(opacity=100)";
    elem.style.opacity = "1";
  }
}

// hide an element by changing the opacity setting on the element
function hideMessageElement( elem )
{
  if (elem)
  {
    elem.style.filter = "alpha(opacity=0)";
    elem.style.opacity = "0";
  }
}

// catcher function for clicking a new message in the thread tree (jump around)
function displayMessage( thread_id, msg_id, loadOnly, forceExpandMsg, ignoreCollapseState )
{
  var msgParentDiv = $( msg_id );
  var wasCollapsed = isMessageCollapsed( msgParentDiv );
  if ( !ignoreCollapseState && wasCollapsed )
  {
    // Do not load collapsed messages - wait until they are expanded.
    return;
  }
  msgParentDiv.loaded = true;
  var msgDiv = $( 'message_' + msg_id );

  // on initial page load, the msgDiv will have contain a span with class='loadingElipse',
  // the presence of that span lets us know if the message has been loaded vis Ajax yet.
  if ( msgDiv.down( 'span.loadingElipse' ) )
  {
    wasCollapsed = true; // Even if we were not 'collapsed', we weren't expanded either so make sure we end up expanded
    msgDiv.show();
    var getUrl = window.displayUrl + "&message_id=" + msg_id + "&thread_id=" + thread_id;
    new Ajax.Request( getUrl,
    {
        method : 'get',
        onSuccess : function( transport )
        {
          MessageTree.populateMessageDiv( msgDiv, transport.responseText );
        },
        onFailure : loadMessageFailure,
        onException : loadMessageFailure
    } );
  }
  if ( !loadOnly )
  {
    // forceExpandMsg is set when using the AX next/prev links in which case we want to automatically open the message for them.
    if ( forceExpandMsg )
    {
      Message.expandSelf(msgParentDiv, msg_id);
    }
    else
    {
      if (wasCollapsed)
      {
        Message.expandSelf(msgParentDiv, msg_id);
      }
      else
      {
        Message.collapseSelf(msgParentDiv, msg_id);
      }
    }
  }
}

Message.collapseSelf = function(msgDiv, msg_id)
{
  msgDiv.addClassName( Message.collapsedMessageClass );
  if( msgDiv.down( 'div.messageTemplate' ) )
  {
    msgDiv.addClassName( Message.collapsedMsgWithInlinePostClass );
  }
  if (msg_id === null)
  {
    msg_id =  msgDiv.id.replace('message','');
  }
  var collexpLink = $('collExpMsg_' + msg_id);
  if (collexpLink)
  {
    collexpLink.innerHTML = page.bundle.getString('message.self.expand');
  }
  msgDiv.down( 'div.db-message' ).title = page.bundle.getString('message.expand.post');
};

Message.expandSelf = function(msgDiv, msg_id)
{
  msgDiv.removeClassName( Message.collapsedMessageClass );
  msgDiv.removeClassName( Message.collapsedMsgWithInlinePostClass );
  if (msg_id === null)
  {
    msg_id =  msgDiv.id.replace('message','');
  }
  var collexpLink = $('collExpMsg_' + msg_id);
  if (collexpLink)
  {
    collexpLink.innerHTML = page.bundle.getString('message.self.collapse');
  }
  msgDiv.down( 'div.db-message' ).title = page.bundle.getString('message.collapse.post');
};


function loadMessageFailure( ajaxResponse )
{
  alert( page.bundle.getString( 'message.load.error' ) );
}

// MESSAGE FRAME FUNCTIONS

// called by remove button, uses removeUrl and confirm message (set in JSP)
function remove( msg_id )
{
  if ( confirm( window.strConfirmRemove ) )
  {
    var messageFrameForm = $( 'messageFrameForm' );
    messageFrameForm.action = window.removeUrl + msg_id;
    messageFrameForm.submit();
  }
}

function subUnSub()
{
  document.location = window.subscribeUrl;
}

function rateMessage( msg_id, rating )
{
  loadDiv( window.rateUrl + rating + "&message_id=" + msg_id, 'message_' + msg_id, true, function( responseJsonText )
  {
    // update user rating on UI
    var ratingList = $( this.msg_id + '.rating' );
    for ( var i = 0; i < 6; i++ )
    {
      ratingList.removeClassName( 'star' + i );
    }
    ratingList.addClassName( 'star' + this.rating );
    ratingList.up( 'div.userRating' ).setAttribute( 'currentUsrRating', this.rating );

    // update average rating on UI with an updated value received from the server
    var jsonObj = JSON.parse( responseJsonText, function( key, value )
    {
      var type;
      if ( value && typeof value === 'object' )
      {
        type = value.type;
        if ( typeof type === 'string' && typeof window[type] === 'function' )
        {
          return new ( window[ type ] )( value );
        }
      }
      return value;
    } );
    if ( jsonObj.result && typeof jsonObj.result === 'object' )
    {
      var avgRating = jsonObj.result.updatedAvgRate;
      if ( avgRating && avgRating >= 0 && avgRating <= 5 )
      {
        var avgRatingList = $( this.msg_id + '.avgRating' );
        for ( var j = 0; j < 6; j++ )
        {
          avgRatingList.removeClassName( 'star' + j );
        }
        avgRatingList.addClassName( 'star' + avgRating );
        avgRatingList.up( 'div.avgRating' ).setAttribute( 'currentAvgRating', avgRating );
      }
    }
  }.bind(
  {
    msg_id : msg_id,
    rating : rating
  } ) );
}

function goToParentMessage( parent_msg_id )
{
  var parentMsgDiv = $( parent_msg_id );
  if( null !== parentMsgDiv )
  {
    page.util.focusAndScroll( parentMsgDiv ); // page.util.ensureVisible(..) doesn't quite work as it should.(ie. scrolling upward). Tweak is necessary when we put this feature into the product.
  }
  else
  {
    // alert the user that the parent message does not exist
  }
}

function expandAllMessagesInTheTree()
{
  expandCollapseMessages( true );
  // In some cases, if the user is clicking 'collapse' while the page is loading and if they collapse the tree before it has loaded the visible messages
  // and then they hit 'expand' the messages that should be visible are not auto-loaded - so load them with this call.
  MessageTree.loadAndExpandNextVisibleMessage.defer();
}

function collapseAllMessagesInTheTree()
{
  expandCollapseMessages( false );
}

function expandCollapseMessages( expand )
{
  var container = $( 'forumMessagesContainer' );
  if (!container)
  {
    return;
  }
  var allMessages = container.select( 'div.db-message-wrapper' );
  var currElement;
  for ( var i = 0; i < allMessages.length; i++ )
  {
    currElement = allMessages[ i ];
    if ( expand )
    {
      Message.expandSelf(currElement, null);
    }
    else
    {
      Message.collapseSelf(currElement, null);
    }
  }
}

function getChildren( msgs, index )
{
  var msg = msgs[ index ];
  var layer = getMsgLayer( msg );
  var childMsgs = [];
  for ( var i = index + 1; i < msgs.length; i++ )
  {
    if ( getMsgLayer( msgs[ i ] ).startsWith( layer ) )
    {
      childMsgs.push( msgs[ i ] );
      if ( msgs[ i ].hasClassName( 'reply-lvl-1' ) )
      {
        // for lvl 1 msgs, we also need to collapse/expand parent db-reply-block
        childMsgs.push( msgs[ i ].up( 'div.db-reply-block' ) );
      }
    }
    else
    {
      return childMsgs;
    }
  }
  return childMsgs;
}

function getChildrenCountWithUnreadCount( childMsgs )
{
  var count = 0;
  var unreadCount = 0;
  if ( !childMsgs )
  {
    return count;
  }
  for ( var i = 0; i < childMsgs.length; i++ )
  {
    var childMsg = childMsgs[ i ];
    if ( !childMsg.hasClassName( 'db-reply-block' ) )
    {
      count++;
      if ( childMsg.hasClassName( 'unreadmsg' ) )
      {
        unreadCount++;
      }
    }
  }
  var retVal =
  {
      countAll : count,
      countUnread : unreadCount
  };
  return retVal;
}

function getMsgLayer( msg )
{
  if ( !msg.layer )
  {
    msg.layer = msg.down( 'div.db-message' ).id;
  }
  return msg.layer;
}

function onExpandCollapse( event, msg )
{
  if( event.type === "keydown" && event.keyCode !== Event.KEY_RETURN )
  {
    return;
  }
  Event.stop( event );
  var visible = msg.childMsgs[ 0 ].visible();
  msg.childMsgs.each( visible ? Element.hide : Element.show );
  Element[ visible ? 'removeClassName' : 'addClassName' ]( msg.expandCollapse, 'reply-expanded' );
  Element[ visible ? 'addClassName' : 'removeClassName' ]( msg.expandCollapse, 'reply-collapsed' );
  updateExpandCollapseLinks.apply( msg, [ false, !visible ] );
}

/**
 * @param refreshCounts : whether to refresh unread counts or not
 * @param visibility : whether the children messages are visible or not
 */
function updateExpandCollapseLinks( refreshCounts, visibility )
{
  var visible;
  if ( visibility === undefined )
  {
    if ( !this.childMsgs )
    {
      var msgs = $$( 'div.db-message-wrapper' );
      var index;
      for ( var i = 0; i < msgs.length; i++ )
      {
        if ( this.id == msgs[ i ].id )
        {
          index = i;
        }
      }
      this.childMsgs = getChildren( msgs, index );
    }
    visible = this.childMsgs[ 0 ].visible();
  }
  else
  {
    visible = visibility;
  }
  var key = visible ? 'message.collapse.n.replies' : 'message.expand.n.replies';

  if ( !this.childMsgCountAll || !this.childMsgCountUnread || refreshCounts )
  {
    var childMsgCount = getChildrenCountWithUnreadCount( this.childMsgs );
    this.childMsgCountAll = childMsgCount.countAll;
    this.childMsgCountUnread = childMsgCount.countUnread;
  }

  if ( this.childMsgCountUnread > 0 )
  {
    key = key + ".n.unread";
  }
  this.expandCollapse.update( page.bundle.getString( key + ( ( this.childMsgCountAll === 1 ) ? '.one' : '' ),
                                                     this.childMsgCountAll, this.childMsgCountUnread ) );
}

function onSelectUnSelect()
{
  Element[ this.checked ? 'addClassName' : 'removeClassName' ]( this.up( 'div.db-message-wrapper' ), 'selected-post' );
}

// use the flag to indicate state, as ajax may have delay to reload tags
Message.isReplyOpen = false;
// lightbox to show three buttons if the user attempts to open a reply with another already active
Message.lbConfirm = null;
// stream lightbox for edit form
Message.lbEditMessage = null;
Message.isStream = function()
{
  return typeof window.stream != 'undefined';
};
Message.collectionPageFlag = false;

Message.isCollectionPage = function()
{
  return Message.collectionPageFlag;
};

Message.editOrReplyMessage = function( msg_id, url, parentElement, isEditing, isQuote )
{
  // display UI below current msg
  if ( Message.isReplyOpen )
  {
    Message.showConfirmDialog( msg_id, isEditing, isQuote, isQuote );
  }
  else
  {
   window.onbeforeunload = function(event){
      if(Message.isReplyOpen)
        return page.bundle.getString("dbui.message.inlineposting.reply.alreadyopen.leavewindow");
    };

    var wrapDivClass = 'messageTemplate';
    if ( Message.isStream() )
    {
      wrapDivClass = wrapDivClass + ' streamReply';
    }
    else
    {
      // auto mark message as read and stop read timers on all other messages
      autoMarkRead.disableSettingReadTimers();
      autoMarkRead.clearAutoMarkReadTimerOnAllMsgs();
      if ( !Message.isCollectionPage()  )
      {
        autoMarkRead.proceedAutoMarkRead( $(parentElement) );
      }
    }

    Message.isReplyOpen = true;
    Message.disabledSubmit = false;
    var wrapperDiv = new Element( 'div',
    {
        'id' : 'inlinePost',
        'class' : wrapDivClass
    } );

    if ( Message.isStream() )
    {
      Message.getStreamDisplayWindow().document.body.down( '#contentPanel' ).appendChild( wrapperDiv );
    }
    else if ( parentElement )
    {
      wrapperDiv.appendChild( Message.createLoadingReplyDiv() );
      $( parentElement ).appendChild( wrapperDiv );
    }
    
    url += "&collection=" + Message.isCollectionPage();

    new Ajax.Request( url,
                      {
                          method : 'get',
                          onSuccess : function( response )
                          {
                            var wrapperDiv = Message.getInlineWrapper( msg_id );
                            var replyContent = Object.toHTML( response.responseText );
                            if ( Message.isStream() )
                            {

                              Message.lbEditMessage = new lightbox.Lightbox(
                              {
                                  lightboxId : 'lbEditMessage',
                                  contents : replyContent.stripScripts(),
                                  showCloseLink : false,
                                  constrainToWindow : false,
                                  closeOnBodyClick : false
                              } );
                              Message.lbEditMessage.open( function()
                              {
                                wrapperDiv.insert(
                                {
                                  'bottom' : Message.lbEditMessage.overlay
                                } );
                                wrapperDiv.insert(
                                {
                                  'bottom' : Message.lbEditMessage.lightboxWrapper
                                } );
                                // stop listening on current window,
                                Event.stopObserving( window, 'resize', Message.lbEditMessage.boundResizeListener );
                                // replace default window listener on resize, as default listener use current window
                                // document object, not displayWindow
                                Message.lbEditMessage.boundResizeListener = function()
                                {
                                  var viewDim = Message.getStreamDisplayWindow().document.viewport.getDimensions();
                                  var lbw = this.lightboxWrapper;
                                  var lbDim =
                                  {
                                      width : viewDim.width,
                                      height : viewDim.height
                                  };
                                  // 80% of the display window width, 90% height
                                  lbDim.width = Math.round( lbDim.width * 0.8 - this._extraWidth( lbw, false ) );
                                  lbDim.height = Math
                                      .round( lbDim.height * 0.9 - this._extraHeight( lbw, false, true ) );
                                  lbw.setStyle(
                                  {
                                      width : ( lbDim.width ) + 'px',
                                      height : ( lbDim.height ) + 'px'
                                  } );
                                  var lf = Math.round( ( viewDim.width - lbDim.width ) / 2.0 );
                                  var t = Math.round( ( viewDim.height - lbDim.height ) / 2.0 );
                                  lbw.setStyle(
                                  {
                                      left : ( lf < 0 ? 0 : lf ) + "px",
                                      top : ( t < 0 ? 0 : t ) + "px"
                                  } );
                                  var lbc = this.lightboxContent;
                                  var h = ( lbDim.height - this._extraHeight( lbw, false, false ) -
                                            this._extraHeight( lbc, true, true ) - lbc.positionedOffset().top );
                                  if ( h >= 0 )
                                  {
                                    lbc.setStyle(
                                    {
                                      height : h + "px"
                                    } );
                                  }
                                }.bind( Message.lbEditMessage );
                                // attach resize event to display window
                                Event.observe( Message.getStreamDisplayWindow(), 'resize',
                                               Message.lbEditMessage.boundResizeListener );

                                // force resize
                                Message.setupSubmissionForm( msg_id );
                                Message.updateAndHideMessageButtons( msg_id );
                                Message.hideDraftMessage( msg_id );
                                Message.getStreamDisplayWindow().page.globalEvalScripts( replyContent, true );
                                Message.lbEditMessage.boundResizeListener();
                              } );
                            }
                            else
                            {
                              wrapperDiv.innerHTML = replyContent.stripScripts();
                              page.globalEvalScripts( replyContent, true );
                              Message.setupSubmissionForm( msg_id );
                              Message.updateAndHideMessageButtons( msg_id );
                              Message.hideDraftMessage( msg_id );
                            }

                            Message.getInlineWrapper(msg_id).insert({
                               top: new Element('div',
                                  {'class':'hideoff', 'role':'alert'}).update(
                                    page.bundle.getString('dbui.message.inlineposting.editor.open') )
                                 });
                          },
                          onFailure : function( response )
                          {
                            alert( page.bundle.getString( "dbui.thread.load.error.message" ) );
                          },
                          onComplete : function()
                          {
                            autoMarkRead.enableSettingReadTimers();
                          }
                      } );
  }
};

Message.setupSubmissionForm = function( messageId )
{
  var form = Message.getInlineForm( messageId );
  form.target = Message.getInlineTargetName( messageId );
  form.onSubmit = '';
  form.appendChild( new Element( 'input',
  {
      'name' : 'isAjax',
      'type' : 'hidden',
      'value' : 'true'
  } ) );
  // remove template events
  form.down( 'input#top_submitBtn' ).onclick = '';
  form.down( 'input#top_submitBtn' ).observe( 'click', Message.submitInlineForm.bindAsEventListener( this, messageId ) );

  form.down( 'input#bottom_submitBtn' ).onclick = '';
  form.down( 'input#bottom_submitBtn' ).observe( 'click',
                                                 Message.submitInlineForm.bindAsEventListener( this, messageId ) );

  var topDraftBtn = form.down( 'input#top_saveDraftBtn' );
  // there is no 'Draft' buttons when editing a previously submitted message
  // so check we actually have 'Draft' btns before trying to attach the event below
  if ( topDraftBtn )
  {
    topDraftBtn.onclick = '';
    topDraftBtn.observe( 'click', Message.submitDraftInlineForm.bindAsEventListener( this, messageId ) );
    form.down( 'input#bottom_saveDraftBtn' ).onclick = '';
    form.down( 'input#bottom_saveDraftBtn' ).observe(
                                                      'click',
                                                      Message.submitDraftInlineForm.bindAsEventListener( this,
                                                                                                         messageId ) );
  }

  form.down( 'input#top_cancelBtn' ).onclick = '';
  form.down( 'input#top_cancelBtn' ).observe( 'click', Message.cancelReply.bindAsEventListener( this, messageId ) );

  form.down( 'input#bottom_cancelBtn' ).onclick = '';
  form.down( 'input#bottom_cancelBtn' ).observe( 'click', Message.cancelReply.bindAsEventListener( this, messageId ) );
};

Message.updateAndHideMessageButtons = function( messageId )
{
  if ( Message.isStream() )
  {
    // don't allow save draft for stream post
    var form = Message.getInlineForm( messageId );
    var topDraftBtn = form.down( 'input#top_saveDraftBtn' );
    if ( topDraftBtn )
    {
      topDraftBtn.hide();
      form.down( 'input#bottom_saveDraftBtn' ).hide();
    }
  }

  Message.getThreadButtonDiv( messageId ).hide();
};

Message.updateAndShowMessageButtons = function( messageId )
{
  Message.getThreadButtonDiv( messageId ).show();
};

Message.hideDraftMessage = function( messageId )
{
  var isDraftDiv = Message.getInlineWrapper( messageId ).up().down( '#messageIsDraft' );
  if ( isDraftDiv && isDraftDiv.value == 'true' )
  {
    Message.getMessageBodyDiv( messageId ).hide();
  }
};

Message.showDraftMessage = function( messageId )
{
  var isDraftDiv = Message.getInlineWrapper( messageId ).up().down( '#messageIsDraft' );
  if ( isDraftDiv && isDraftDiv.value == 'true' )
  {
    Message.getMessageBodyDiv( messageId ).show();
  }
};

Message.createLoadingReplyDiv = function()
{
  var loadReplyDiv = new Element( 'div',
  {
    'id' : 'loadReplyMsg'
  } );
  var loadReplyStr = page.bundle.getString( 'dbui.message.editor.load' );
  loadReplyDiv.innerHTML = '<span class="loadingElipse">' + loadReplyStr + '</span>';
  return loadReplyDiv;
};

Message.showConfirmDialog = function(new_msg_id, isEditing, isQuote, callback)
{
  if ( !Message.lbConfirm )
  {
    Message.lbConfirm = new lightbox.Lightbox(
    {
        contents : page.bundle.getString( 'dbui.message.inlineposting.reply.alreadyopen' ),
        dimensions :
        {
            w : 420,
            h : 180
        }
    } );
  }

  if( new_msg_id !== null )
  {
    var parentElement = Message.getReplyContainer( new_msg_id );

    if ( isEditing )
      callback = Message.editOrReplyMessage.bind( this, new_msg_id, modifyUrl + new_msg_id, parentElement, true );
    else if ( isQuote )
      callback = Message.editOrReplyMessage.bind( this, new_msg_id, quoteUrl + new_msg_id,  parentElement, false, true );
    else
      callback = Message.editOrReplyMessage.bind( this, new_msg_id, replyUrl + new_msg_id, parentElement );
  }

  var cancelHandler = Message.closeConfirmDialog;
  var draftHandler = Message.handleOpenReply.bind(this, false, callback );
  var newReplyHandler = Message.handleOpenReply.bind(this, true, callback );

  Message.lbConfirm.cfg.ajax =
  {
      url : "/webapps/discussionboard/message/confirm_dialog.jsp" ,
      loadExternalScripts : true
  };
  Message.lbConfirm.cfg.content = null;
  Message.lbConfirm.open(function()
  {
    //when onClick in bbNG:Button tag is unset or "", a default history.go(-1) is attached. Has to be cleared for correct behavior.
      $("cfmCancelBtn").onclick = '';
      $("cfmCancelBtn").observe('click', cancelHandler );

      $("cfmDraftBtn").onclick='';
      $("cfmDraftBtn").observe('click', draftHandler );

      $("cfmNewReplyBtn").onclick = '';
      $("cfmNewReplyBtn").observe('click', newReplyHandler );
  });
};

Message.closeConfirmDialog = function()
{
  if ( Message.lbConfirm )
  {
    Message.lbConfirm.close();
  }
  Message.lbConfirm = null;
};

Message.validMessage = function( pForm )
{
  if ( pForm.possiblePoints )
  {
    if ( pForm.possiblePoints.value.trim() === "" && pForm.allowThreadGrade.checked )
    {
      alert( page.bundle.getString( "message.grade.error.1" ) );
      pForm.possiblePoints.focus();
      return false;
    }
    if ( pForm.allowThreadGrade.checked && pForm.possiblePoints.value.trim() !== "" &&
         !isNumeric( pForm.possiblePoints.value ) )
    {
      alert( page.bundle.getString( "message.grade.error.2" ) );
      pForm.possiblePoints.focus();
      return false;
    }
    if ( !pForm.allowThreadGrade.checked )
    {
      pForm.possiblePoints.value = "";
    }
  }

  if ( !validateForm( pForm ) )
  {
    return false;
  }
  return true;
};

//cancel current edit box
Message.cancelReply = function( event, messageId )
{
  removeCM( messageId, 'menu_descriptiontext_contextmenu');
  if ( Message.getInlineWrapper(messageId).ownerDocument.getElementById("title") )
  {
    Message.getInlineWrapper(messageId).ownerDocument.getElementById("title").focus();
  }
  if ( event )
  {
    event.preventDefault();
  }

  Message.updateAndShowMessageButtons( messageId );
  Message.showDraftMessage( messageId );
  Message.removeInlineForm( messageId );
  Message.closeConfirmDialog();
  Message.isReplyOpen = false;
  
  Message.destroyCurrentEditor( messageId );
};

/**
 * This forces the current tinyMCE editor to be deleted. It can be used when
 * cancelling a message or as a callback after successful submission of a reply.
 * This ensures that the content inside the editor does not get reloaded next
 * time an editor is opened.
 * 
 * @param messageId
 */
Message.destroyCurrentEditor = function( messageId )
{
  var editor = window.parent.tinyMceWrapper.getEditor( 'description' + messageId + 'text' );
  if ( editor !== null )
    editor.destroyEditor();
};

// TODO: replace with a new method in stream.js in SP12
Message.getStreamDisplayWindow = function()
{
  // The 'stream' iframe (not the mybbcanvas - just the stream itself which is both the left and right sides))
  return window.parent;
};

/**
 * helper function to get inline wrapper div
 *
 * @param messageId
 * @return {*}
 */
Message.getInlineWrapper = function( messageId )
{
  if ( Message.isStream() )
  {
    return Message.getStreamDisplayWindow().document.body.down( '#inlinePost' );
  }
  else if ( Message.isCollectionPage() )
    return $( 'inlinePost' );
  else{
    if( messageId  )
      return $( messageId ).down( 'div#inlinePost' );
    else
      return $('inlinePost' );
  }
};

/**
 * helper function to get inline form
 *
 * @param messageId
 * @return {*}
 */
Message.getInlineForm = function( messageId )
{
  return Message.getInlineWrapper( messageId ).down( '#inlineMessageForm' );
};


Message.getReplyContainer = function( messageId )
{
  var container ;
  if(Message.isStream())
    container = $( 'streamDetail' );
  else if (Message.isCollectionPage())
    container = $("message_border."+messageId);
  else
    container = $(messageId);
  return container;
};

/**
 * helper function to get target, same as above
 *
 * @param messageId
 * @return {*}
 */
Message.getInlineTarget = function( messageId )
{
    var wrapper = Message.getInlineWrapper( messageId );
    var targetName = Message.getInlineTargetName( messageId );
    var target = wrapper.down( '#'+targetName );
    if (!target)
      {
        target = document.createElement("iframe");
        target.setAttribute("id", targetName);
        target.setAttribute("name", targetName);
        target.setAttribute("src", "");
        target.setAttribute("style", "display: none");
        wrapper.appendChild(target);
      }
    return target;
};

Message.getInlineTargetName = function( messageId )
{
	return 'inlineFormTarget_'+messageId;
};

Message.getThreadButtonDiv = function( messageId )
{
  return Message.getReplyContainer( messageId ).down( 'div.threadButtons' );
};

/**
 * helper function to get the body message div currently used only in thread detail page to show/hide the base message
 * when editing a draft,
 */
Message.getMessageBodyDiv = function( messageId )
{
  return Message.getReplyContainer( messageId ).down( 'div.dbThreadBody' );
};

Message.submitDraftInlineForm = function( event, messageId, callback )
{
  if ( event )
  {
    event.preventDefault();
  }
  var form = Message.getInlineForm( messageId );
  form.appendChild( new Element( 'input',
  {
      'name' : 'draft',
      'value' : 'save_draft'
  } ) );
  if (!callback)
  {
    callback = Message.destroyCurrentEditor.bind( this, messageId );
  }
  Message.saveInlineForm( form, messageId, callback );
};

Message.submitInlineForm = function( event, messageId )
{
  if ( event )
  {
    event.preventDefault();
  }
  var callback = Message.destroyCurrentEditor.bind( this, messageId );
  Message.saveInlineForm( Message.getInlineForm( messageId ), messageId, callback );
};

Message.saveInlineForm = function( form, messageId, callback )
{
  if ( Message.disabledSubmit ) 
  {
    return false; //Prevent double submit
  }
  removeCM( messageId, 'menu_descriptiontext_contextmenu');
  if ( Message.getInlineWrapper(messageId).ownerDocument.getElementById("title") )
  {
    Message.getInlineWrapper(messageId).ownerDocument.getElementById("title").focus();
  }
  if ( !Message.validMessage( form ) )
  {
    return;
  }
  Message.isReplyOpen = false;
  var target = Message.getInlineTarget( messageId );
  target.innerHtml = '';
  target.observe( 'load', Message.processResponseMessages.bindAsEventListener( this, messageId, callback ) );
  form.submit();
  Message.disabledSubmit = true;
};

Message.processResponseMessages = function( event, messageId, callback )
{
  var responseMsg = Message.getInlineTarget( messageId ).contentDocument.body.innerHTML;
  if ( responseMsg && responseMsg.length > 0 )
  {
    try
    {
      var jsonResponse = responseMsg.evalJSON( true );
      Message.removeInlineForm( messageId );
      if ( Message.isStream() )
      {
        if ( window.parent.window )
          window.parent.window.postMessage( 'getNewStream', '*' );
        Message.displayAlerts( messageId, jsonResponse.messages );
      }
      else if ( Message.isCollectionPage() ) // do not insert new message if in Collection page, and display inline
      // recept into old message
      {
        Message.displayAlerts( messageId, jsonResponse.messages );
      }
      else
      {
        var alertCallback = Message.displayAlerts.bind( this, jsonResponse.messageId, jsonResponse.messages );
        if ( messageId == jsonResponse.messageId ) // editing
        {
          Message.updateMessage( jsonResponse.threadId, messageId, alertCallback );
        }
        else
        // insert reply message
        {
          Message.insertChildMessage( jsonResponse.threadId, messageId, jsonResponse.messageId, alertCallback );
        }
      }
      Message.updateAndShowMessageButtons( messageId );

      if ( typeof callback == 'function' )
        callback();
    }
    catch ( e )
    {
      alert( page.bundle.getString( 'dbui.thread.save.failure.message' ) );
    }
  }
  else
  {
    alert( page.bundle.getString( 'dbui.thread.save.failure.message' ) );
  }

};

Message.displayAlerts = function( messageId, messages )
{
  if ( !messages )
    return;
  var alertArea;
  if ( Message.isStream() )
    alertArea = $( 'inlineReceipts' );
  else
    alertArea = Message.getReplyContainer( messageId );

  // display as top element inline recept on alert area
  messages.each( function( entry )
  {
    var fade = true;
    var top = true;
    if ( Message.isCollectionPage() )
    {
      fade = false;
      top = false;
    }
    
    new page.NestedInlineConfirmationEx({
      type : entry.type.toLowerCase(),
      message : entry.message.unescapeHTML(),
      previousElement : alertArea,
      showCloseLink : true,
      fadeAway : fade,
      insertTop : top
    });
    
    alertArea.select();
  } );
};

Message.insertChildMessage = function( threadId, parentId, messageId, callback )
{
  var parentMessageDiv = $( parentId );
  var parentLevel = Message.getIndentationLevel( parentMessageDiv );
  var container;
  var rollingMsg = null;
  if ( parentLevel > 0 )
  {
    rollingMsg = parentMessageDiv.next();
    while ( rollingMsg )
    {
      var rollingLevel = Message.getIndentationLevel( rollingMsg );
      if ( rollingLevel <= parentLevel )
      {
        rollingMsg = rollingMsg.previous(); // move back one, as always insert after
        break;
      }
      else if ( rollingLevel > parentLevel && !rollingMsg.next() )
      {
        break;
      }
      else
        rollingMsg = rollingMsg.next();
    }
    if ( !rollingMsg )
      rollingMsg = parentMessageDiv;
  }

  var messageLayerDivId = Message.getMessageLayerTag( parentId, parentLevel );
  var url = singleMessageUrl + messageId + "&parentLevel=" + parentLevel + "&messageLayerDivId=" + messageLayerDivId;
  new Ajax.Request( url,
  {
      method : 'get',
      onSuccess : function( response )
      {
        var newMsg = Object.toHTML( response.responseText );
        if ( rollingMsg )
          rollingMsg.insert(
          {
            'after' : newMsg
          } );
        else
          $( threadId ).up().insert(
          {
            'bottom' : newMsg
          } );
        Message.updateMessageBodyAndAge(threadId,  messageId, callback );
        var newTotal = parseInt( $( 'totalPostsCount' ).innerHTML, 10 ) + 1;
        updateMessageCounts( newTotal );
      },
      onFailure : function( response )
      {
        alert( page.bundle.getString( "dbui.thread.load.error.message" ) );
      }
  } );
};

Message.updateMessage = function( threadId, messageId, callback )
{
  var parentLevel = Message.getIndentationLevel( $( messageId ) ) - 1;
  var messageLayerDivId = getMsgLayer( $( messageId ) );
  var url = singleMessageUrl + messageId + "&parentLevel=" + parentLevel + "&messageLayerDivId=" + messageLayerDivId +
            "&isUpdateMsg=true";
  new Ajax.Request( url,
  {
      method : 'get',
      onSuccess : function( response )
      {
        var receivedMsg = Object.toHTML( response.responseText ).stripScripts();
        $( messageId ).innerHTML = receivedMsg;
        Message.updateMessageBodyAndAge( threadId, messageId, callback );
        if ( Message.getIndentationLevel( $( messageId ) ) === 0 ) // update thread title
        {
          var subject = $( 'subject_' + messageId ).innerHTML;
          $( 'pageTitleText' ).innerHTML = page.bundle.getString( "dbui.collect.thread.colon.strong", subject );
        }
      },
      onFailure : function( response )
      {
        alert( page.bundle.getString( "dbui.thread.load.error.message" ) );
      }
  } );
};

Message.updateMessageBodyAndAge = function( threadId, messageId, callback )
{
  MessageTree.currentMsgId = messageId;
  MessageTree.keepInView = $( messageId );
  displayMessage( threadId, messageId );
  if ( typeof callback == 'function' )
  {
    callback();
  }
  MessageTree.initBranchVisibilityControls( true );
  updateMessageAge();
};

Message.getMessageLayerTag = function( parentId, parentLevel )
{
  var layer = getMsgLayer( $( parentId ) );
  var msgs = $$( 'div.db-message-wrapper' );
  var indexMsg = 0;
  while ( indexMsg < msgs.length )
  {
    if ( msgs[ indexMsg ].id == parentId )
      break;
    indexMsg++;
  }
  var currentLevel = parseInt( parentLevel, 10 ) + 1;
  var childMsgCount = Message.getChildrenCountAtLevel( getChildren( msgs, indexMsg ), currentLevel );
  return ( layer + "_" + childMsgCount );
};

Message.getChildrenCountAtLevel = function( childMsgs, level )
{
  var count = 0;
  if ( !childMsgs )
  {
    return count;
  }
  for ( var i = 0; i < childMsgs.length; i++ )
  {
    var childMsg = childMsgs[ i ];
    if ( childMsg.hasClassName( 'reply-lvl-' + level ) )
    {
      count++;
    }
  }
  return count;
};

Message.getIndentationLevel = function( element )
{
  var level = 0;
  var classes = $w( element.className );
  classes.each( function( c )
  {
    if ( c.startsWith( 'reply-lvl-' ) )
      level = c.sub( 'reply-lvl-', '' );
  } );
  return parseInt( level, 10 );
};

Message.removeInlineForm = function( messageId )
{
  var wrapper = Message.getInlineWrapper( messageId );
  wrapper.up().removeChild( wrapper );
};

Message.handleOpenReply = function( discardOldReply, callback )
{
  // validate old form before processing
  if ( !Message.validMessage( $( 'inlineMessageForm' ) ) )
    return;
  // delay on ajax may cause two inlinePost div cost-exists, while waiting for response on submission.
  Message.closeConfirmDialog();

  var oldMsgId = $( 'inlinePost' ).up().id;
  if(Message.isCollectionPage() )
    oldMsgId = oldMsgId.sub('message_border.', '');

  if ( discardOldReply )
  {
    Message.cancelReply( null, oldMsgId);
    if(typeof callback == 'function')
      callback();
  }
  else
    Message.submitDraftInlineForm( null, oldMsgId, callback );
};

Message.removeAttach = function( messageId, attachId )
{
  var form = Message.getInlineForm( messageId );
  if ( confirm( page.bundle.getString( 'message.attachment.remove' ) ) )
  {
    form.action += "&isRemoveAttach=true&msgAttach_id=" + attachId;
    form.down( '#attachmentsDiv' ).up().removeChild( $( 'attachmentsDiv' ) );
  }
};

function showMsgMetadata( msg_id )
{
  var mdElem = $( 'db_msg_age_' + msg_id + '_md' );
  var msgAgeElem = $( 'db_msg_age_' + msg_id );
  if ( mdElem )
  {
    var mdElemVC = $( 'db_viewcount_' + msg_id + '_md' );
    var mdElemVcInMsg = $( 'db_vc_in_msg_age_' + msg_id + '_md' );
    if ( mdElemVC && !mdElemVcInMsg )
    {
      var totalViewCount = mdElemVC.getAttribute( 'totalViewCount' );
      var yourViewCount = mdElemVC.getAttribute( 'yourViewCount' );

      if ( totalViewCount && yourViewCount )
      {
        mdElem.innerHTML = mdElem.innerHTML + '<br><span id=\"db_vc_in_msg_age_' + msg_id + '_md\">' +
                           page.bundle.getString( "dbui.viewcounts.colon", totalViewCount, yourViewCount ) + '</span>';
      }
    }
    mdElem.style.visibility = "visible";
    msgAgeElem.style.visibility = "hidden";
  }
}

function hideMsgMetadata( msg_id )
{
  var mdElem = $( 'db_msg_age_' + msg_id + '_md' );
  var msgAgeElem = $( 'db_msg_age_' + msg_id );
  if ( mdElem )
  {
    mdElem.style.visibility = "hidden";
  }
  msgAgeElem.style.visibility = "visible";
}
function removeCM( messageId, cId )
{
  if ( Message.getInlineWrapper( messageId ).ownerDocument.getElementById( cId ) !== null )
  {
    Message.getInlineWrapper( messageId ).ownerDocument.getElementById( cId ).remove();
  }
  var subMenus = Message.getInlineWrapper( messageId ).ownerDocument.getElementsByClassName( 'mceDropDown' ), i = 0, menu;
  while ( ( menu = subMenus[ i++ ] ) )
  {
    menu.remove();
  }

}
