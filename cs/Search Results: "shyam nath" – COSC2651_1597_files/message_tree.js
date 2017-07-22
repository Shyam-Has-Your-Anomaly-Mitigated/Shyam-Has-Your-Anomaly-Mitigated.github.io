if ( !window.MessageTree )
{
  /*
   * Sorry for the naming confusion, but this is the message-detail view's message tree, not the forum tree view.
   */
  var MessageTree =
  {};

  MessageTree.currentMsgId = null;
  MessageTree.keepInView = null;
  MessageTree.isFromStream = null; // used for auto mark read
  MessageTree.offsets = null; // used for auto mark read

  // actually put the retrieved HTML in the destination DIV
  // called after marking msgs read/unread and flagging messages
  MessageTree.populateTreeDivWOMsg = function( respText )
  {
    // do any preprocess parsing needed
    var treeDiv = $( 'tree' );
    treeDiv.innerHTML = respText;
    evalMessageTreeScripts.defer( respText );
    MessageTree.initBranchVisibilityControls();
    MessageTree.registerEventForCheckboxSelectUnselect();
    MessageTree.registerEventToShowHideButtons();
    autoMarkRead.registerEventForAutoMarkReadMsgs();
    var firstMsg = treeDiv.down( 'div.reply-lvl-0' );
    var currentMsg = $( currentMessageId );
    if ( currentMsg.id != firstMsg.id )
    {
      displayMessage( null, currentMsg.id ); // Actually load the currentMessage directly - and then scroll to it.
      currentMsg.scrollTo();
      ( function()
      {
        page.util.ensureVisible( currentMsg );
      }.defer() ); // make sure current message is in view
      // TODO: Test ensureVisible with different message sizes - maybe keep scrolling until either the end of the
      // current
      // message is in-view or the top of the currentmessage is at the top of the viewport
      MessageTree.currentMsgId = currentMsg.id;
      MessageTree.keepInView = currentMsg;
      MessageTree.isFromStream = true;
    }

    // Kick off an initial load of visible messages
    MessageTree.loadAndExpandNextVisibleMessage.defer();

    // Schedule messages to load on any resize or scroll event to make sure anything visible is loaded.
    Event.observe( window, "resize", MessageTree.loadAndExpandNextVisibleMessage );
    Event.observe( window, "scroll", MessageTree.loadAndExpandNextVisibleMessageUponScroll );
  };

  // actually put the retrieved HTML in the destination DIV
  MessageTree.populateMessageDiv = function( messageDiv, respText )
  {
    // do any preprocess parsing needed
    messageDiv.innerHTML = respText.stripScripts();

    messageDiv.avgRatingDiv = messageDiv.down( 'div.avgRating' );
    messageDiv.usrRatingDiv = messageDiv.down( 'div.userRating' );
    if ( messageDiv.avgRatingDiv !== undefined && messageDiv.usrRatingDiv !== undefined )
    {
      // initially show just the average rating
      MessageTree.showAverageRating.bind( messageDiv )();
      // show user rating when hovering over average rating, otherwise show average rating
      var ratingsContainer = messageDiv.down( 'div.ratingsContainer' );
      ratingsContainer.observe( 'mouseover', MessageTree.showUserRating.bind( messageDiv ) );
      ratingsContainer.observe( 'mouseout', MessageTree.showAverageRating.bind( messageDiv ) );
      ratingsContainer.observe( 'keydown', MessageTree.userRatingKeyPress.bindAsEventListener( this ) );
      ratingsContainer.down( 'div.userRating' ).down( 'li.one' ).down( 'a' ).observe( 'keydown', MessageTree.userRatingKeyPress.bindAsEventListener( this ) );
      ratingsContainer.down( 'div.userRating' ).down( 'li.two' ).down( 'a' ).observe( 'keydown', MessageTree.userRatingKeyPress.bindAsEventListener( this ) );
      ratingsContainer.down( 'div.userRating' ).down( 'li.three' ).down( 'a' ).observe( 'keydown', MessageTree.userRatingKeyPress.bindAsEventListener( this ) );
      ratingsContainer.down( 'div.userRating' ).down( 'li.four' ).down( 'a' ).observe( 'keydown', MessageTree.userRatingKeyPress.bindAsEventListener( this ) );
      ratingsContainer.down( 'div.userRating' ).down( 'li.five' ).down( 'a' ).observe( 'keydown', MessageTree.userRatingKeyPress.bindAsEventListener( this ) );
      var collapseControlDiv = messageDiv.up( 'div.msg-nexus' ).down( 'div.db-collapse-control' );
      collapseControlDiv.down( 'a' ).observe( 'keydown', MessageTree.userRatingKeyPress.bindAsEventListener( this ) );
      var threadBodyDiv = messageDiv.down( 'div.dbThreadBody' );
      threadBodyDiv.observe( 'keydown', MessageTree.userRatingKeyPress.bindAsEventListener( this ) );
    }

    // evauate any JavaScript in the response
    page.globalEvalScripts( respText, false );
    // wire any lightboxes in the message div
    new page.LightboxInitializer( 'lb', messageDiv );
    
    MessageTree.loadAndExpandNextVisibleMessage.defer(); // kick off another load-n-expand
  };

  MessageTree.lastLoadOnScrollTimerId = null;
  MessageTree.loadAndExpandNextVisibleMessageUponScroll = function( event )
  {
    // The scroll event is fired multiple times during the operation, which may delays or even stops action.
    // We will fire the loadAndExpandNextVisibleMessage() with a little timeout to give the user a chance
    // to finish their scrolling. Also, if a former timer for the function invocation still remains unfired,
    // we will remove it and replace it with a newer one (set up for this current scrolling event).
    if ( MessageTree.lastLoadOnScrollTimerId ) 
    {
      window.clearTimeout( MessageTree.lastLoadOnScrollTimerId );
    }
    MessageTree.lastLoadOnScrollTimerId = window.setTimeout( MessageTree.loadAndExpandNextVisibleMessage, 200 );
  };

  MessageTree.loadAndExpandNextVisibleMessage = function()
  {
    var msg = MessageTree.getNextUnLoadedMessageInViewPort();
    if ( msg !== null )
    {
      displayMessage( null, msg.id ); // load & expand next visible message
      if ( MessageTree.keepInView )
      {
        page.util.ensureVisible( MessageTree.keepInView );
      }
    }
    else
    {
      // Once we've finished loading all visible messages then we no longer have to keep anything in view or keep track
      // of the currentMsgId.
      MessageTree.keepInView = null;
      MessageTree.currentMsgId = null;
      
      document.fire( 'messageTree:messagesLoadedAndExpanded' );
    }
  };

  MessageTree.getNextUnLoadedMessageInViewPort = function()
  {
    var viewportHeight = document.viewport.getDimensions().height;
    var msgs = $$( 'div.autoExpandable' );
    var msg;
    var offsets = [];
    var offsetCounter = 0;
    var done = false;
    var i;
    /*
     * When loading a message tree,the currently selected message is not always the FIRST message on the page -
     * sometimes it is the last, the middle, etc. (i.e. one use case is to click on a message from the stream - that
     * loads the thread detail page and scrolls to the message you clicked). If we always start preloading at the top of
     * the page then we'll push the desired message off the bottom of the page and force the user to scroll to find it.
     * This logic, combined with constantly re-focusing MessageTree.keepInView until we're done, will change the order
     * in which we pick the 'next unloaded message'. Instead of starting at the top and going down, this will start at
     * the currentMessage and move up the page first, followed by moving down the page after it is done. This way the
     * desired message will be both auto-loaded, highlighted, and scrolled into view for the user instead of being
     * pushed off the bottom of the page.
     */
    for ( i = 0; !done && ( i < msgs.length ); i++ )
    {
      msg = msgs[ i ];
      if ( msg.id == MessageTree.currentMsgId )
      {
        done = true;
        offsets[ offsetCounter++ ] = i;
        var iStart = i;
        while ( i > 0 )
        {
          i--;
          offsets[ offsetCounter++ ] = i;
        }
        // OK to reuse i - we're breaking out of the outer loop as soon as we're finished here.
        for ( i = iStart + 1; i < msgs.length; i++ )
        {
          offsets[ offsetCounter++ ] = i;
        }
      }
    }
    if ( !done )
    {
      // Somehow we never found our current messageid.
      for ( i = 0; i < msgs.length; i++ )
      {
        offsets[ i ] = i;
      }
    }
    MessageTree.offsets = offsets;
    for ( i = 0; i < msgs.length; i++ )
    {
      msg = msgs[ offsets[ i ] ];
      if ( msg.loaded )
      {
        continue;
      }
      var t = msg.viewportOffset().top;
      var b = t + msg.getHeight();
      if ( t >= viewportHeight )
      {
        return null; // current msg and rest of messages are below viewport, no need to look further.
      }
      else if ( b > 1 )
      {
        return msg; // current message is in viewport and not loaded yet, so return it
      }
    }
    return null; // all messages are loaded
  };

  MessageTree.initBranchVisibilityControls = function( isUpdateCountOnly )
  {
    var msgs = $$( 'div.db-message-wrapper' );
    for ( var i = 0; i < msgs.length; i++ )
    {
      var msg = msgs[ i ];
      msg.childMsgs = getChildren( msgs, i ); // ( 'db-reply-block' ) was added to children's list as well for each (
      // 'reply-lvl-1' ) present, therefore we don't count # of ( 'db-reply-block'
      // ) in getChildrenCountWithUnreadCount method
      var childMsgCount = getChildrenCountWithUnreadCount( msg.childMsgs );
      msg.childMsgCountAll = childMsgCount.countAll;
      msg.childMsgCountUnread = childMsgCount.countUnread;
      msg.expandCollapse = msg.down( 'a.exp-col' );
      if ( msg.childMsgs.length > 0 && i > 0 ) // no expand/collapse for root message
      {
        msg.expandCollapse.show();
        // bind onExpandCollapse() only if we are reloading the tree or
        // if this is the first time this message has a child.
        // binding multiple times cause problems.
        if ( !isUpdateCountOnly || ( msg.childMsgs.length == 1 && msg.expandCollapse.innerHTML.trim() === '' ) )
        {
          msg.expandCollapse.addClassName( 'reply-expanded' );
          msg.expandCollapse.observe( 'click', onExpandCollapse.bindAsEventListener( this, msg ) );
          msg.expandCollapse.observe( 'keydown', onExpandCollapse.bindAsEventListener( this, msg ) );
        }
        if ( msg.childMsgCountUnread > 0 )
        {
          msg.expandCollapse.update( page.bundle.getString( 'message.collapse.n.replies.n.unread' +
                                                            ( ( msg.childMsgCountAll === 1 ) ? '.one' : '' ),
                                                            msg.childMsgCountAll, msg.childMsgCountUnread ) );
        }
        else
        {
          msg.expandCollapse.update( page.bundle.getString( 'message.collapse.n.replies' +
                                                            ( ( msg.childMsgCountAll === 1 ) ? '.one' : '' ),
                                                            msg.childMsgCountAll ) );
        }
      }
      else
      {
        msg.expandCollapse.hide();
      }

    }
  };

  MessageTree.registerEventForCheckboxSelectUnselect = function()
  {
    $$( 'input.message_selection_checkboxes' ).each( function( element )
    {
      element.observe( 'change', onSelectUnSelect.bindAsEventListener( element ) );
    } );
  };

  MessageTree.registerEventToShowHideButtons = function()
  {
    var elem = $( 'contentPanel' );

    if ( navigator.userAgent.indexOf("Trident/5") > -1 )
    { // IE9 .. Note : focus/blur events don't get triggered in IE9 if its Document Mode is not set to IE9 standards
      elem.onfocusin = MessageTree.showHideButtons.bindAsEventListener( this, 'show' );
      elem.onfocusout = MessageTree.showHideButtons.bindAsEventListener( this, 'hide' );
    }
    else if ( elem.addEventListener )
    { // Chrome, FF, Safari
      elem.addEventListener( 'focus', MessageTree.showHideButtons.bindAsEventListener( this, 'show' ), true );
      elem.addEventListener( 'blur', MessageTree.showHideButtons.bindAsEventListener( this, 'hide' ), true );
    }
    else if ( elem.attachEvent )
    { // IE8
      elem.attachEvent( 'onfocus', MessageTree.showHideButtons.bindAsEventListener( this, 'show' ) );
      elem.attachEvent( 'onblur', MessageTree.showHideButtons.bindAsEventListener( this, 'hide' ) );
    }
  };
  
  MessageTree.showHideButtons = function( event, showOrHide )
  {
    function showHideElem( elemToShowOrHide, showOrHide )
    {
      if( showOrHide === 'show' )
      {
        showMessageElement( elemToShowOrHide );
      }
      else if( showOrHide === 'hide' )
      {
        hideMessageElement( elemToShowOrHide );
      }
    }
    
    if( showOrHide !== 'show' && showOrHide !== 'hide' )
    {
      return;
    }
    var theTarget = event.target ? event.target : event.srcElement;
    if ( theTarget )
    {
      var msgWrapperDiv = theTarget.up( 'div.db-message-wrapper' );
      if( undefined !== msgWrapperDiv && null !== msgWrapperDiv )
      {
        var threadButtonsDiv = msgWrapperDiv.down( 'div.threadButtons' );
        
        if( msgWrapperDiv.hasClassName( 'reply-lvl-0' ) )
        {
          var allChildrenInThreadButtonsDiv = threadButtonsDiv.children;
          for ( var i = 0; i < allChildrenInThreadButtonsDiv.length; i++ )
          {
            if( allChildrenInThreadButtonsDiv[i].nodeName === "A" && allChildrenInThreadButtonsDiv[i].hasClassName( 'browse' ) )
            {
              showHideElem( allChildrenInThreadButtonsDiv[i], showOrHide );
            }
          }
        }
        else
        {
          showHideElem( threadButtonsDiv, showOrHide );
        }
      }
      
      var contentPaneDiv = theTarget.up( 'div.contentPane' );
      if( contentPaneDiv )
      {
        var actionBarDiv = contentPaneDiv.down( 'div.actionBar' );
        if( actionBarDiv )
        {
          showHideElem( actionBarDiv, showOrHide );
        }
      }
    }
  };
  
  MessageTree.showAverageRating = function()
  {
    // We are using hideoff class here instead of doing show/hide on the divs so that both divs will be available at all
    // times to be read to AX users.
    var ratingsContainerDiv = this.down( 'div.ratingsContainer' );
    ratingsContainerDiv.down( 'div.avgRating' ).removeClassName( 'hideoff' );
    ratingsContainerDiv.down( 'div.userRating' ).addClassName( 'hideoff' );
  };

  MessageTree.showUserRating = function()
  {
    // add a user rating instruction to the rating container div
    var ratingsContainerDiv = this.down( 'div.ratingsContainer' );
    var avgRatingDiv = ratingsContainerDiv.down( 'div.avgRating' );
    var usrRatingDiv = ratingsContainerDiv.down( 'div.userRating' );
    var key = "dbui.rating.average.rating.announcement.with.user.rating.instruction";
    var avgRating = avgRatingDiv.getAttribute( 'currentAvgRating' );
    var usrRating = usrRatingDiv.getAttribute( 'currentUsrRating' ); 
    ratingsContainerDiv.title = page.bundle.getString( key, avgRating, usrRating );
      
    // We are using hideoff class here instead of doing show/hide on the divs so that both divs will be available at all
    // times to be read to AX users.
    usrRatingDiv.removeClassName( 'hideoff' );
    avgRatingDiv.addClassName( 'hideoff' );
  };
  
  MessageTree.userRatingKeyPress = function( event )
  {
    function focusRatingStar( ratingsContainerDiv, currentRating ) 
    {
      var rating = null;
      if( currentRating === 0 )
      {
        ratingsContainerDiv.focus();
        return;
      }
      else if( currentRating === 1 )
      {
        rating = 'one';
      }
      else if( currentRating === 2 )
      {
        rating = 'two';
      }
      else if( currentRating === 3 )
      {
        rating = 'three';  
      }
      else if( currentRating === 4 ) 
      {
        rating = 'four';
      }
      else if( currentRating === 5 )
      {
        rating = 'five';
      }
      if( rating )
      {
        ratingsContainerDiv.down( 'div.userRating' ).down( 'li.' + rating ).down( 'a' ).focus();
      }
    }

    var keyCode = event.keyCode;
    if( keyCode === 16 )
    {
      return; // quick return for a Shift key press  
    }
    var isRTL = page.util.isRTL();
    var theTarget = event.target ? event.target : event.srcElement;
    var stopEvent = false;
    if( theTarget )
    {
      var msgNexus = theTarget.up( 'div.msg-nexus' );
      var collapseControlDiv = msgNexus.down( 'div.db-collapse-control' );
      var threadMessageDiv = msgNexus.down( 'div.dbThreadMessage' );
      var ratingsContainerDiv = threadMessageDiv.down( 'div.ratingsContainer' );
      var threadBodyDiv = threadMessageDiv.down( 'div.dbThreadBody' );
      if( theTarget.up( 'div.db-collapse-control' ) || theTarget.up( 'div.dbThreadBody' ) || theTarget.hasClassName( 'dbThreadBody' ) )
      { // user key press from outside the ratingsContainer div
        if( keyCode === Event.KEY_TAB && 
            ( ( theTarget.up( 'div.db-collapse-control' ) && !event.shiftKey ) || ( theTarget.hasClassName( 'dbThreadBody' ) && !theTarget.up( 'div.dbThreadBody' ) && event.shiftKey ) ) )
        { // user tabbing into the ratingsContainer div
          MessageTree.showUserRating.bind( threadMessageDiv )(); //making sure that we show the user rating before we focus any element in it
          stopEvent = true;
          var currentUserRating = parseInt( ratingsContainerDiv.down( 'div.userRating' ).getAttribute( 'currentUsrRating' ), 10 );
          focusRatingStar( ratingsContainerDiv, currentUserRating );
        }
        else
        {
          return; // quick return if the key code is not what we care about
        }
      }
      else
      { // user key press within the ratingsContainer div
        if( keyCode === Event.KEY_TAB || keyCode === Event.KEY_LEFT || keyCode === Event.KEY_RIGHT || keyCode === Event.KEY_UP || keyCode === Event.KEY_DOWN ||
            keyCode === 49 || keyCode === 50 || keyCode === 51 || keyCode === 52|| keyCode === 53 )
        { // we want these key presses dedicated to message rating change
          stopEvent = true;
        }
        else
        {
          return; // quick return if the key code is not what we care about
        }
        if( keyCode === Event.KEY_TAB )
        { // user tabbing out of the ratingsContainer div
          if( event.shiftKey )
          {
            collapseControlDiv.down( 'a' ).focus();
          }
          else
          {
            threadBodyDiv.focus();
          }
          MessageTree.showAverageRating.bind( threadMessageDiv )(); //making sure that we show the average rating before we focus out of the rating div
        }
        else
        {
          var elemToJumpTo = null;
          if( theTarget.hasClassName( 'ratingsContainer' ) )
          { // user key press on the ratingsContainer div
            if( keyCode === Event.KEY_UP || ( isRTL ? keyCode === Event.KEY_LEFT : keyCode === Event.KEY_RIGHT ) )
            { // we only care about going from no rating to one star
              elemToJumpTo = ratingsContainerDiv.down( 'div.userRating' ).down( 'li.one' );
            }
          }
          else
          { // user key press within the user rating div
            var pNode = theTarget.parentNode;
            if( pNode && pNode.nodeName === "LI" )
            {
              if( ( keyCode === Event.KEY_UP || ( isRTL ? keyCode === Event.KEY_LEFT : keyCode === Event.KEY_RIGHT ) ) && !pNode.hasClassName( 'five' ) )
              {
                elemToJumpTo = pNode.nextElementSibling ? pNode.nextElementSibling : pNode.nextSibling;    //ie only knows nextSibling
              }
              else if( ( keyCode === Event.KEY_DOWN || ( isRTL ? keyCode === Event.KEY_RIGHT : keyCode === Event.KEY_LEFT ) ) && !pNode.hasClassName( 'one' ) )
              {
                elemToJumpTo = pNode.previousElementSibling ? pNode.previousElementSibling : pNode.previousSibling;                
              }
              else if( keyCode === 49 )
              {
                elemToJumpTo = pNode.parentNode.down( 'li.one' );
              }
              else if( keyCode === 50 )
              {
                elemToJumpTo = pNode.parentNode.down( 'li.two' );
              }
              else if( keyCode === 51 )
              {
                elemToJumpTo = pNode.parentNode.down( 'li.three' );
              }
              else if( keyCode === 52 )
              {
                elemToJumpTo = pNode.parentNode.down( 'li.four' );
              }
              else if( keyCode === 53 )
              {
                elemToJumpTo = pNode.parentNode.down( 'li.five' );
              }
            }
          }
          if( null !== elemToJumpTo && elemToJumpTo.nodeName === "LI" )
          {
            var link = elemToJumpTo.down( 'a' );
            if( link && link.onclick )
            {
              link.focus();
              link.onclick();
            }
          }
        }
      }
    }
    if( stopEvent )
    {
      Event.stop( event );
    }
  };
}
