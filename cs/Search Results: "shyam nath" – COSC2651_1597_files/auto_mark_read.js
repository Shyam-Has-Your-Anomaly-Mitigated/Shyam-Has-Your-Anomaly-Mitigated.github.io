if ( !window.autoMarkRead )
{
  var autoMarkRead =
  {};
  autoMarkRead.goodToSetTimers = true;
  autoMarkRead.fireInmillisec = 1000;
  autoMarkRead.markReadTimerRelToMsgLength = false;
  autoMarkRead.markReadTimerRelToMsgOffset = false;
  autoMarkRead.msgMarkPosOffAdditionalTime = 1000;
  autoMarkRead.msgMarkReadPerc = 100;
  autoMarkRead.viewOffsetTopCoord = 0.5;
  autoMarkRead.viewOffsetBtmCoord = -0.5;
  autoMarkRead.msgMoveDirUnknown = 'unknown';
  autoMarkRead.msgMoveDirUp = 'up';
  autoMarkRead.msgMoveDirDown = 'down';
  autoMarkRead.msgMoveDirNone = 'none';
  autoMarkRead.msgLocOutOfView = 0;
  autoMarkRead.msgLocWithinView = 1;
  autoMarkRead.msgLocSpanBeyondView = 2;
  autoMarkRead.msgLocOnTopBorder = 3;
  autoMarkRead.msgLocOnBottomBorder = 4;
  autoMarkRead.msgsMovingDirectionSave = autoMarkRead.msgMoveDirUnknown;

  autoMarkRead.getSettings = function()
  {
    var settingsObj =
    {};
    settingsObj.isOn = autoMarkRead.goodToSetTimers;
    settingsObj.readTime = autoMarkRead.fireInmillisec;
    settingsObj.isMsgLenAddTime = autoMarkRead.markReadTimerRelToMsgLength;
    settingsObj.isOffsetAddTime = autoMarkRead.markReadTimerRelToMsgOffset;
    settingsObj.offsetAddTime = autoMarkRead.msgMarkPosOffAdditionalTime;
    settingsObj.readPerc = autoMarkRead.msgMarkReadPerc;
    return settingsObj;
  };

  autoMarkRead.enableSettingReadTimers = function( readTime )
  {
    autoMarkRead.goodToSetTimers = true;
    if ( readTime !== undefined && readTime > 0 )
    {
      autoMarkRead.fireInmillisec = readTime;
    }
    else
    {
      autoMarkRead.fireInmillisec = 1000;
    }
  };

  autoMarkRead.disableSettingReadTimers = function()
  {
    autoMarkRead.goodToSetTimers = false;
  };

  /**
   * @param set : true/false
   */
  autoMarkRead.configureMarkReadTimerRelToMsgLength = function( set )
  {
    if ( set )
    {
      autoMarkRead.markReadTimerRelToMsgLength = true;
    }
    else
    {
      autoMarkRead.markReadTimerRelToMsgLength = false;
    }
  };

  /**
   * @param set : true/false
   * @param addtime : time to add to the read time for each offset distance from the first message to be read by the
   *          user; default is 1 second
   */
  autoMarkRead.configureMarkReadTimerRelToMsgOffset = function( set, addTime )
  {
    if ( set )
    {
      autoMarkRead.markReadTimerRelToMsgOffset = true;
      if ( addTime !== undefined && addTime > 0 )
      {
        autoMarkRead.msgMarkPosOffAdditionalTime = addTime;
      }
      else
      {
        autoMarkRead.msgMarkPosOffAdditionalTime = 1000;
      }
    }
    else
    {
      autoMarkRead.markReadTimerRelToMsgOffset = false;
    }
  };

  /**
   * @param perc : percentage we expect the user to read of the message to mark the message as read; default is 100%
   */
  autoMarkRead.configureMarkReadPercentage = function( perc )
  {
    if ( perc !== undefined && perc > 0 && perc < 100 )
    {
      autoMarkRead.msgMarkReadPerc = perc;
    }
    else
    {
      autoMarkRead.msgMarkReadPerc = 100;
    }
  };

  /*
   * Set the timer to mark them as read for all the auto loaded messages in the view unless they were already auto
   * marked read or the user marked them as read before auto mark read kicked in
   */
  autoMarkRead.setAutoMarkReadTimerOnAutoLoadedMsgs = function()
  {
    function setTimer( msg, setTimerCounter )
    {
      if ( !autoMarkRead.isMsgEligibleForAutoMarkRead( msg ) )
      {
        return setTimerCounter;
      }

      var coords = autoMarkRead.msgInViewVertCoords( msg );
      if ( msg.autoReadTimer && !coords.isInView )
      {
        // stop/delete the timer if the message is not in the view anymore
        window.clearTimeout( msg.autoReadTimer );
        msg.autoReadTimer = null;
      }

      if ( coords.isInView )
      {
        autoMarkRead.setAutoMarkReadTimerOnMsg( msg, coords, setTimerCounter++ );
      }

      return setTimerCounter;
    }

    function setTimerLoop( msgs, startIndex, isFromStreamInit, setTimerCounter, upOnly, downOnly )
    {
      /*
       * setTimerCounter is used to keep track of how many timers we are setting on this round for the messages that are
       * currently in the view. it is used when autoMarkRead.markReadTimerRelToMsgOffset evaluates to true to add more
       * time to the timeout for n - 1 messages in the view (excluding the first message that we set the timer on); the
       * later the timer is set on this round of call to setTimerLoop, the more time will be added to the read timer
       * timeout
       */
      if ( setTimerCounter === undefined )
      {
        setTimerCounter = 0;
      }
      /*
       * Here, we are setting the auto mark read timer for the first time after user jumped to the discussion board by
       * clicking on a message from stream. Once the message that the user clicked on from stream is in focus, we don't
       * know which direction(up/down) the user will scroll to, so approximately the distance from the message in focus
       * will determine how much more time will be added to the read timeout. For example, the fifth message down from
       * the message in focus will have more time added to its timer than the third message up from the message in
       * focus.
       */
      var i;
      if ( isFromStreamInit )
      {
        isFromStreamInit = false;
        i = startIndex;
        var jmpCount = 0;
        var jmpDir = 0; // 0:up, 1:down
        while ( i >= 0 || i < msgs.length )
        {
          setTimerCounter = setTimer( msgs[ i ], setTimerCounter );
          jmpCount++;
          if ( jmpDir === 0 )
          {
            i = i + jmpCount;
            jmpDir = 1;
            if ( i >= msgs.length )
            {
              setTimerLoop( msgs, i - jmpCount - 1, false, setTimerCounter, true, false );
              return;
            }

          }
          else if ( jmpDir === 1 )
          {
            i = i - jmpCount;
            jmpDir = 0;
            if ( i < 0 )
            {
              setTimerLoop( msgs, i + jmpCount + 1, false, setTimerCounter, false, true );
              return;
            }
          }
        }
      }
      else
      {
        if ( !downOnly )
        {
          for ( i = startIndex; i >= 0; i-- )
          {
            setTimerCounter = setTimer( msgs[ i ], setTimerCounter );
          }
        }
        if ( !upOnly )
        {
          for ( i = startIndex + 1; i < msgs.length; i++ )
          {
            setTimerCounter = setTimer( msgs[ i ], setTimerCounter );
          }
        }
      }
    }

    if ( !autoMarkRead.goodToSetTimers )
    {
      return;
    }
    var msgs = $$( 'div.db-message-wrapper' );

    var offsets = MessageTree.offsets;
    if ( MessageTree.isFromStream )
    {
      if ( offsets && offsets[ 0 ] )
      {
        setTimerLoop( msgs, offsets[ 0 ], true );
        MessageTree.isFromStream = null;
      }
    }
    else
    {
      var msgsMovingDirection = autoMarkRead.msgMoveDirUnknown;
      var msgsMovingDirectionSave = autoMarkRead.msgsMovingDirectionSave;
      var done = false;
      for ( var i = 0; !done && i < msgs.length; i++ )
      {
        var msg = msgs[ i ];
        var coordsPrev = msg.coords;
        if ( coordsPrev )
        {
          var coordsNow = autoMarkRead.msgInViewVertCoords( msg );
          msgsMovingDirection = autoMarkRead.getMessageMoveDirection( coordsPrev, coordsNow );
          if ( msgsMovingDirection === autoMarkRead.msgMoveDirNone ||
               msgsMovingDirection === autoMarkRead.msgMoveDirUnknown )
          {
            msgsMovingDirection = autoMarkRead.msgsMovingDirectionSave; // try to get a more meaningful info from a last
            // saved messages moving direction
          }
          else
          {
            autoMarkRead.msgsMovingDirectionSave = msgsMovingDirection;
          }
          done = true;
        }
      }
      if ( msgsMovingDirection === autoMarkRead.msgMoveDirDown || msgsMovingDirection === autoMarkRead.msgMoveDirNone ||
           msgsMovingDirection === autoMarkRead.msgMoveDirUnknown )
      {
        setTimerLoop( msgs, 0 );
      }
      else if ( msgsMovingDirection === autoMarkRead.msgMoveDirUp )
      {
        setTimerLoop( msgs, msgs.length - 1 );
      }
    }
  };

  /**
   * Clear all the existing read timers
   */
  autoMarkRead.clearAutoMarkReadTimerOnAllMsgs = function()
  {
    var msgs = $$( 'div.db-message-wrapper' );
    for ( var i = 0; i < msgs.length; i++ )
    {
      var msg = msgs[ i ];
      if ( msg.autoReadTimer )
      {
        window.clearTimeout( msg.autoReadTimer );
        msg.autoReadTimer = null;
      }
    }
  };

  /**
   * Set a read timer on a message in view unless there already is a timer set If
   * autoMarkRead.markReadTimerRelToMsgLength evaluates to true, then we vary the read time according to the length of
   * the message
   * 
   * @param offset : offset from the first message in view (initial implementation : first loaded) to give additional
   *          time to read messages loaded thereafter we currently don't consider the length of the message loaded
   *          previous to loading this message
   */
  autoMarkRead.setAutoMarkReadTimerOnMsg = function( msg, coords, offset )
  {
    if ( !coords )
    {
      coords = autoMarkRead.msgInViewVertCoords( msg );
    }

    if ( offset === undefined )
    {
      offset = 0;
    }

    if ( !msg.autoReadTimer )
    {
      var msgHeightRelToviewHeight = coords.topCoord - coords.btmCoord;
      var msgId = msg.id;
      var readTime = autoMarkRead.fireInmillisec;
      if ( autoMarkRead.markReadTimerRelToMsgLength )
      {
        readTime = readTime * msgHeightRelToviewHeight;
      }
      if ( autoMarkRead.markReadTimerRelToMsgOffset )
      {
        readTime = readTime + ( offset * autoMarkRead.msgMarkPosOffAdditionalTime );
      }
      if ( autoMarkRead.markReadTimerRelToMsgLength && msg.viewHeightRelToMsgHeight > 1 )
      {
        // give more time for messages that doesn't entirely fit in the view in proportion to the size of the messages
        // in
        // comparison to that of the view
        msg.autoReadTimer = window.setTimeout( autoMarkRead.markReadIfRead.bind( msg ), readTime );
      }
      else
      {
        msg.autoReadTimer = window.setTimeout( autoMarkRead.markReadIfRead.bind( msg ), readTime );
      }
    }
  };

  /**
   * Determines if the message still needs to be considered for auto mark read There is no need to auto mark read if the
   * message has not yet been loaded, is not visible(message body collapsed), has already been auto marked read once,
   * ,has directly been marked as read/unread by the user, or is already in a read status
   */
  autoMarkRead.isMsgEligibleForAutoMarkRead = function( msg )
  {
    if ( msg &&
         ( msg.loaded && msg.visible() && !msg.autoMarkedRead &&
                                              !msg.userMarkedReadUnread && !isMessageRead( msg.id ) && !isMessageCollapsed( msg ) ) ) 
    {
      return true;
    }
    return false;
  };

  /*
   * Mark the message as read if the message can be considered as read
   */
  autoMarkRead.markReadIfRead = function()
  {
    this.autoReadTimer = null; // delete the timer so that we can create/assign a new one to the message if necessary
    var coords = autoMarkRead.msgInViewVertCoords( this );

    // Auto mark the message as read, if the message is still in the view, eligible to be considered for auto mark read,
    // and satisfies the messageReadPerc setting.
    // we should factor into consideration the size of the message relative to the size of the view
    if ( coords.isInView && ( this.maxPercInView && ( this.maxPercInView >= autoMarkRead.msgMarkReadPerc ) ) )
    {
      autoMarkRead.proceedAutoMarkRead( this );
    }
  };

  /**
   * Call this function if you want to auto mark read a message right away; It will mark the message as read if the
   * message is eligible to be auto marked read
   */
  autoMarkRead.proceedAutoMarkRead = function( msg )
  {
    // at times such as when user explicitly clicked on an unread message, we want to auto mark read whether the message
    // was ever auto marked read or marked as read by the user
    markRead( msg.id, true );
  };

  /**
   * Updates on messages in the view their maximum exposures to the view in percentage
   */
  autoMarkRead.updateInViewPercForAllMsgsInView = function()
  {
    var msgs = $$( 'div.db-message-wrapper' );
    for ( var i = 0; i < msgs.length; i++ )
    {
      var msg = msgs[ i ];
      if ( !autoMarkRead.isMsgEligibleForAutoMarkRead( msg ) )
      {
        // update only for messages that needs to be considered for auto mark read
        continue;
      }

      var coords = autoMarkRead.msgInViewVertCoords( msg );
      msg.coords = coords;
      if ( !coords.isInView || ( msg.maxPercInView && msg.maxPercInView === 100 ) )
      {
        // update only for messages in the view or the messages that may need update
        continue;
      }

      if ( !msg.maxPercInView )
      {
        msg.maxPercInView = 0;
      }
      var msgInViewMax = msg.maxPercInView;
      var msgInViewMaxUpdated = autoMarkRead.getMsgInViewMaxUpdated( msg, coords );
      if ( msgInViewMaxUpdated != -1 && msgInViewMax != msgInViewMaxUpdated )
      {
        msg.maxPercInView = msgInViewMaxUpdated;
      }
    }
  };

  /**
   * Returns the coordinates of the message in relation to the view ( this is an area of the page we can view without
   * scrolling into )
   * 
   * @return an object that contains info on whether the message is in the view or not, the top and the bottom
   *         coordinates of the message assuming that the view extends from (x*, autoMarkRead.viewOffsetTopCoord) to
   *         (x*, autoMarkRead.viewOffsetBtmCoord) Properties of the return object => isInView : true/false topCoord :
   *         +-0 btmCoord : +-0
   */
  autoMarkRead.msgInViewVertCoords = function( msg )
  {
    var vp = $('globalNavPageContentArea');
    var viewportHeight = vp.getHeight();
    var messageHeight = msg.getHeight();
    var viewOffsetTop = vp.cumulativeScrollOffset().top;
    var viewOffsetBtm = viewOffsetTop + viewportHeight;
    var msgOffsetTop = msg.cumulativeOffset().top;
    var msgOffsetBtm = msgOffsetTop + messageHeight;
    var msgOffsetTopCoord = ( viewOffsetTop - msgOffsetTop ) / viewportHeight + autoMarkRead.viewOffsetTopCoord;
    var msgOffsetBtmCoord = ( viewOffsetBtm - msgOffsetBtm ) / viewportHeight + autoMarkRead.viewOffsetBtmCoord;
    var isInView;
    if ( ( msgOffsetTopCoord > autoMarkRead.viewOffsetTopCoord ) &&
         ( msgOffsetBtmCoord < autoMarkRead.viewOffsetBtmCoord ) )
    {
      isInView = false;
    }
    else
    {
      isInView = true;
    }
    var retVal =
    {
        isInView : isInView,
        topCoord : msgOffsetTopCoord,
        btmCoord : msgOffsetBtmCoord
    };
    return retVal;
  };

  /**
   * Returns the maximum percentage of the message that has been exposed to the view; Pass only the messages that may
   * need update(neither was already read nor have been fully in view)
   * 
   * @return returns updated max percentage in view(read) of the message; -1 if not updated
   */
  autoMarkRead.getMsgInViewMaxUpdated = function( msg, coords )
  {
    var msgLocRelToView = autoMarkRead.getMessageLocationRelToView( coords );
    var msgRangeInViewTop;
    var msgRangeInViewBtm;
    if ( msgLocRelToView === autoMarkRead.msgLocOutOfView )
    {
      return -1;
    }
    else if ( msgLocRelToView === autoMarkRead.msgLocWithinView )
    {
      msgRangeInViewTop = 100;
      msgRangeInViewBtm = 0;
    }
    else if ( msgLocRelToView === autoMarkRead.msgLocSpanBeyondView )
    {
      msgRangeInViewTop = Math.ceil( ( autoMarkRead.viewOffsetTopCoord - coords.btmCoord ) /
                                     ( coords.topCoord - coords.btmCoord ) * 100 );
      msgRangeInViewBtm = Math.floor( ( autoMarkRead.viewOffsetBtmCoord - coords.btmCoord ) /
                                      ( coords.topCoord - coords.btmCoord ) * 100 );
    }
    else if ( msgLocRelToView === autoMarkRead.msgLocOnTopBorder )
    {
      msgRangeInViewTop = Math.ceil( ( autoMarkRead.viewOffsetTopCoord - coords.btmCoord ) /
                                     ( coords.topCoord - coords.btmCoord ) * 100 );
      msgRangeInViewBtm = 0;
    }
    else if ( msgLocRelToView === autoMarkRead.msgLocOnBottomBorder )
    {
      msgRangeInViewTop = 100;
      msgRangeInViewBtm = Math.floor( ( autoMarkRead.viewOffsetBtmCoord - coords.btmCoord ) /
                                      ( coords.topCoord - coords.btmCoord ) * 100 );
    }

    var newRange =
    {
        top : msgRangeInViewTop,
        btm : msgRangeInViewBtm
    };
    if ( !msg.msgInViewRangesSoFar )
    {
      msg.msgInViewRangesSoFar = [ newRange ];
    }
    else
    {
      var rangesToDelete = [];
      var addNewRange = false;
      var msgInViewRangesSoFar = msg.msgInViewRangesSoFar;
      var i;
      for ( i = 0; i < msgInViewRangesSoFar.length; i++ )
      {
        var range = msgInViewRangesSoFar[ i ];
        if ( range.top >= newRange.top && newRange.btm >= range.btm )
        {
          // array not in need for an update; the newRange is already included
          addNewRange = false;
          break;
        }
        else if ( newRange.top >= range.top && range.btm >= newRange.btm )
        {
          // newRange will include the range; replace the range with newRange
          rangesToDelete.push( i );
          addNewRange = true;
        }
        else if ( newRange.top >= range.top && newRange.btm >= range.btm )
        {
          // newRange overlaps the range; update the range with newRange
          rangesToDelete.push( i );
          addNewRange = true;
          newRange =
          {
              top : msgRangeInViewTop,
              btm : range.btm
          };
        }
        else if ( range.top >= newRange.top && range.btm >= newRange.btm )
        {
          // newRange overlaps the range; ; update the range with newRange
          rangesToDelete.push( i );
          addNewRange = true;
          newRange =
          {
              top : range.top,
              btm : msgRangeInViewBtm
          };
        }
        else if ( newRange.btm > range.top || range.btm > newRange.top )
        {
          // newRange does not overlap with the range; mark it for 'add'
          addNewRange = true;
        }
      }

      for ( i = 0; i < rangesToDelete.length; i++ )
      {
        msgInViewRangesSoFar.splice( rangesToDelete[ i ] - i );
      }

      if ( addNewRange )
      {
        msgInViewRangesSoFar.push( newRange );
      }

      msg.msgInViewRangesSoFar = msgInViewRangesSoFar;
    }

    return autoMarkRead.getMsgPercInViewMaxFromRanges( msg.msgInViewRangesSoFar );
  };

  autoMarkRead.getMsgPercInViewMaxFromRanges = function( msgInViewRanges )
  {
    var returnVal = 0;
    for ( var i = 0; i < msgInViewRanges.length; i++ )
    {
      var range = msgInViewRanges[ i ];
      var diff = range.top - range.btm;
      returnVal = returnVal + diff;
    }
    return returnVal;
  };

  /**
   * Given the vertical coordinates of the message before and now, it returns in which direction the message moved
   * 
   * @return autoMarkRead.msgMoveDirUnknown/autoMarkRead.msgMoveDirUp/autoMarkRead.msgMoveDirDown/autoMarkRead.msgMoveDirNone
   */
  autoMarkRead.getMessageMoveDirection = function( oldCoords, newCoords )
  {
    if ( !oldCoords )
    {
      return autoMarkRead.msgMoveDirUnknown;
    }
    else
    {
      var oldCoordsTop = oldCoords.topCoord;
      var oldCoordsBtm = oldCoords.btmCoord;
      var newCoordsTop = newCoords.topCoord;
      var newCoordsBtm = newCoords.btmCoord;
      var shiftCoordTop = newCoordsTop - oldCoordsTop;
      var shiftCoordBtm = newCoordsBtm - oldCoordsBtm;
      if ( shiftCoordTop === 0 )
      {
        // message has not been moved
        msgMoveDir = autoMarkRead.msgMoveDirNone;
      }
      else if ( shiftCoordTop > 0 )
      {
        // message has been moved upward
        msgMoveDir = autoMarkRead.msgMoveDirUp;
      }
      else
      {
        // message has been moved downward
        msgMoveDir = autoMarkRead.msgMoveDirDown;
      }
    }
    return msgMoveDir;
  };

  /**
   * Given the vertical coordinates of the message, returns where the message is located relative to the view
   * 
   * @return autoMarkRead.msgLocOutOfView/autoMarkRead.msgLocWithinView/autoMarkRead.msgLocSpanBeyondView
   *         /autoMarkRead.msgLocOnTopBorder/autoMarkRead.msgLocOnBottomBorder
   */
  autoMarkRead.getMessageLocationRelToView = function( coords )
  {
    var coordsTop = coords.topCoord;
    var coordsBtm = coords.btmCoord;
    if ( !coords.isInView )
    {
      // message is not in the view
      msgLocRelToView = autoMarkRead.msgLocOutOfView;
    }
    else
    {
      if ( ( coordsTop <= autoMarkRead.viewOffsetTopCoord ) && ( coordsBtm >= autoMarkRead.viewOffsetBtmCoord ) )
      {
        // message body fits in the view
        msgLocRelToView = autoMarkRead.msgLocWithinView;
      }
      else if ( ( coordsTop > autoMarkRead.viewOffsetTopCoord ) && ( coordsBtm < autoMarkRead.viewOffsetBtmCoord ) )
      {
        // message body is fully spanning across the view and extending beyond the top and the bottom of the view
        msgLocRelToView = autoMarkRead.msgLocSpanBeyondView;
      }
      else if ( ( coordsTop > autoMarkRead.viewOffsetTopCoord ) && ( coordsBtm >= autoMarkRead.viewOffsetBtmCoord ) )
      {
        // message body is extending beyond the top of the view
        msgLocRelToView = autoMarkRead.msgLocOnTopBorder;
      }
      else if ( ( coordsTop <= autoMarkRead.viewOffsetTopCoord ) && ( coordsBtm < autoMarkRead.viewOffsetBtmCoord ) )
      {
        // message body is extending beyond the bottom of the view
        msgLocRelToView = autoMarkRead.msgLocOnBottomBorder;
      }
    }
    return msgLocRelToView;
  };

  autoMarkRead.markAutoReadTimer =
  {};
  autoMarkRead.markAutoReadTimer.minEventRunInterval = 100; // minimum interval for us to want to run mark auto function
  // event
  autoMarkRead.registerEventForAutoMarkReadMsgs = function()
  {
    var markAutoReadFunc = function()
    {
      var now = new Date().getTime();
      if ( !autoMarkRead.markAutoReadTimer.lastFired ||
           ( ( now - autoMarkRead.markAutoReadTimer.lastFired ) > autoMarkRead.markAutoReadTimer.minEventRunInterval ) )
      {
        autoMarkRead.setAutoMarkReadTimerOnAutoLoadedMsgs();
        autoMarkRead.markAutoReadTimer.lastFired = now;
      }
    };

    if ( window.addEventListener )
    {
      addEventListener( 'scroll', markAutoReadFunc );
    }
    else
    {
      attachEvent( "onscroll", markAutoReadFunc );
    }
    setInterval( markAutoReadFunc, 300 );
    setInterval( autoMarkRead.updateInViewPercForAllMsgsInView, 100 );
  };

}