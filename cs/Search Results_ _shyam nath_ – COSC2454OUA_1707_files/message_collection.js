// Module for code specific to the message_collection page
// Node : Some code in this module is used on message_detail page as well such as that of Select All/None check boxes

var message_collection =
{};
( function()
{
  // module objects
  /**
   * represents the tags section at the bottom of a message
   */
  var MessageTags;
  /**
   * The tagging behavior for the message_collection page - Sets up the tag behavior for each message - Sets up the
   * action bar tagging multiple messages action.
   */
  var Tagging;
  /**
   * Represents one of the Mark as Read/Mark as Unread links
   */
  var ReadToggle;
  /**
   * Select all checkbox
   */
  var SelectAllCheckbox;

  var initializeReadToggles;
  var initializeTagging;
  var initializeSelectAllCheckbox;

  SelectAllCheckbox = Class.create();
  SelectAllCheckbox.prototype =
  {
      initialize : function( containerId )
      {
        this.selectAllLinkTop = $( 'selectAll_top' );
        this.selectNoneLinkTop = $( 'selectNone_top' );
        this.selectAllLinkBottom = $( 'selectAll_bottom' );
        this.selectNoneLinkBottom = $( 'selectNone_bottom' );

        var checkboxes = $A( document.getElementsByName( 'formCBs' ) );

        if ( checkboxes.length > 0 )
        {
          if ( this.selectAllLinkTop )
          {
            Element.show( this.selectAllLinkTop );
            Element.show( this.selectNoneLinkTop );
            Element.show( this.selectAllLinkBottom );
            Element.show( this.selectNoneLinkBottom );
          }
          Event.observe( this.selectAllLinkTop, "click", this.onSelectAllClick.bindAsEventListener( this, true ) );
          Event.observe( this.selectNoneLinkTop, "click", this.onSelectAllClick.bindAsEventListener( this, false ) );
          Event.observe( this.selectAllLinkBottom, "click", this.onSelectAllClick.bindAsEventListener( this, true ) );
          Event.observe( this.selectNoneLinkBottom, "click", this.onSelectAllClick.bindAsEventListener( this, false ) );
        }
        else
        {
          if ( this.selectAllCheckbox )
          {
            Element.hide( this.selectAllCheckbox );
          }
          if ( this.selectAllLabel )
          {
            Element.hide( this.selectAllLabel );
          }
        }
      },
      onSelectAllClick : function( event, select )
      {
        // toggle all the checkboxes based on the current state of the checkbox
        if ( this.selectAllLinkTop )
        {
          var checkboxes = $A( document.getElementsByName( 'formCBs' ) );
          if ( select )
          {
            checkboxes.each( function( checkbox )
            {
              checkbox.checked = true;
              onSelectUnSelect.call( checkbox );
            } );
          }
          else
          {
            checkboxes.each( function( checkbox )
            {
              checkbox.checked = false;
              onSelectUnSelect.call( checkbox );
            } );
          }
        }
      }
  };

  Tagging = Class.create();
  Tagging.prototype =
  {
      /**
       * Constructor
       * 
       * @param messageStrings a hash of key to localized message strings used by this object required:
       *          removeConfirmMsg, addTagEmptyMsg, addTagSelectMessageMsg, addTagAlreadyTaggedMsg
       * @param forumId string value of the current forum id
       */
      initialize : function( messageStrings, forumId, courseId )
      {
        // object members
        this.messageStrings = messageStrings;
        this.forumId = forumId;
        this.courseId = courseId;
        this.messageTags = [];
        this.messageIdToMessageTagsHash =
        {};
        this.tagToNumHash =
        {};
        this.tagNameSet = [];

        // the filter select box for filtering on tags
        this.tagFilterSelectBox = document.getElementsByName( "tagFilter" )[ 0 ];

        // construct the object model and wire up tagging behavior
        var checkboxes = $A( document.getElementsByName( 'formCBs' ) );
        checkboxes.each( function( chkbox )
        {
          var msgTag = new MessageTags( this, chkbox.value );
          this.messageTags.push( msgTag );
          this.messageIdToMessageTagsHash[ chkbox.value ] = msgTag;
        }.bind( this ) );

        var tagTextBoxes = document.getElementsByName( 'addTag' );
        for ( var i = 0; i < tagTextBoxes.length; i++ )
        {
          var tagTextBox = $( tagTextBoxes[ i ] );
          var link = tagTextBox.up( 'li' ).down( 'a' );
          Event.observe( link, 'click', this.onAddTagToMessages.bindAsEventListener( this, tagTextBox ) );
        }

        // populate the main list of tags
        this.messageTags.each( function( message )
        {
          message.tagContainer.tags.each( function( tag )
          {
            if ( this.tagToNumHash[ tag.value ] )
            {
              this.tagToNumHash[ tag.value ]++;
            }
            else
            {
              this.tagToNumHash[ tag.value ] = 1;
              this.tagNameSet.push( tag.value );
            }
          }.bind( this ) );
        }.bind( this ) );
      },

      /**
       * Updates the tag filter select box with the current list of tags
       */
      updateTagFilterSelectBox : function()
      {
        this.tagNameSet.sort();

        var options = $A( this.tagFilterSelectBox.options );

        var allOption = options[ 0 ];
        var tagOptions = [];
        var noneOption = options[ options.length - 1 ];
        var i;
        for ( i = 0; i < options.length; i++ )
        {
          // remove the options
          this.tagFilterSelectBox.remove( 0 );
        }

        try
        {
          this.tagFilterSelectBox.add( allOption, null );
        }
        catch ( ex )
        { // IE is not standards compliant
          this.tagFilterSelectBox.add( allOption );
        }
        // add the new options
        for ( i = 0; i < this.tagNameSet.length; i++ )
        {
          var newOption = document.createElement( 'option' );
          newOption.value = this.tagNameSet[ i ];
          newOption.text = newOption.value;
          try
          {
            this.tagFilterSelectBox.add( newOption, null );
          }
          catch ( ex2 )
          { // IE is not standards compliant
            this.tagFilterSelectBox.add( newOption );
          }
        }
        try
        {
          this.tagFilterSelectBox.add( noneOption, null );
        }
        catch ( ex3 )
        { // IE is not standards compliant
          this.tagFilterSelectBox.add( noneOption );
        }

        this.tagFilterSelectBox.selectedIndex = 0;
      },

      /**
       * Event handler attached to the action bar "Add Tag" button/text box
       */
      onAddTagToMessages : function( event, tagTextBox )
      {
        var tagValue = tagTextBox.value;
        if ( !tagValue )
        {
          alert( this.messageStrings.addTagEmptyMsg );
          return false;
        }
        // trim whitespace from the beginning and end of the string
        tagValue = tagValue.replace( /^\s*|\s*$/g, "" );
        if ( tagValue.length === 0 )
        {
          alert( this.messageStrings.addTagEmptyMsg );
          return false;
        }
        else if ( tagValue.length == 256 )
        {
          alert( JS_RESOURCES.getFormattedString( 'validation.maximum_length.no_name.singular', [ '255' ] ) );
          return false;
        }
        else if ( tagValue.length > 255 )
        {
          alert( JS_RESOURCES.getFormattedString( 'validation.maximum_length.no_name.plural', [ '255',
                                                                                               tagValue.length - 255 ] ) );
          return false;
        }

        var messagesToTag = [];
        var checkboxes = $A( document.getElementsByName( 'formCBs' ) );
        checkboxes.each( function( checkbox )
        {
          if ( checkbox.checked )
          {
            messagesToTag.push( this.messageIdToMessageTagsHash[ checkbox.value ] );
          }
        }.bind( this ) );

        if ( messagesToTag.length > 0 )
        {
          tagTextBox.value = '';
          var numToTag = 0;

          // check that we haven't already tagged all of the selected questions with this tag
          messagesToTag.each( function( message )
          {
            if ( !message.hasTag( tagValue ) )
            {
              numToTag++;
            }
          } );

          if ( numToTag > 0 )
          {
            // batch the Ajax calls so that there will be only one server request
            dwr.engine.beginBatch();

            // add the tags to the messages
            messagesToTag.each( function( message )
            {
              message.addTag( tagValue );
            } );

            // actually make the Ajax request.
            dwr.engine.endBatch();
          }
          else
          {
            alert( this.messageStrings.addTagAlreadyTaggedMsg );
          }

          // clear the checkboxes next to the messages
          checkboxes.each( function( checkbox )
          {
            checkbox.checked = false;
          }.bind( this ) );

        }
        else
        {
          alert( this.messageStrings.addTagSelectMessageMsg );
          return false;
        }
      }
  };

  MessageTags = Class.create();
  MessageTags.prototype =
  {
      /**
       * Constructor
       * 
       * @param tagging the Tagging object used on the page
       * @param messageId the Id of the discussion post
       */
      initialize : function( mtagging, messageId )
      {
        this.msgTagging = mtagging;
        this.messageId = messageId;
        // create a list of options for tagging data
        var taggingData = $H();
        taggingData.tagIdString = 'tags_' + this.messageId;
        taggingData.fullTagArray = this.msgTagging.tagNameSet;
        taggingData.normalizeTagValue = false;
        taggingData.showAutoCompleteForTags = true;
        taggingData.showSelectFromExistingLink = true;
        taggingData.addJsCallback = this.onAddTag.bind( this );
        taggingData.removeJsCallback = this.onRemoveTag.bind( this );
        taggingData.messageStrings = this.msgTagging.messageStrings;
        if ( this.messageId )
        {
          this.tagContainer = new tagging.Tags( taggingData );
        }

      },

      /**
       * Returns whether the message is tagged with the specified tag
       */
      hasTag : function( tagValue )
      {
        tagValue = this.tagContainer.formatTag( tagValue );
        var found = this.tagContainer.tags.find( function( tag )
        {
          return tag.value == tagValue;
        } );
        return found ? true : false;
      },

      /**
       * Adds the specified tag to this message
       */
      addTag : function( tagValue )
      {
        tagValue = this.tagContainer.formatTag( tagValue );
        this.tagContainer.addTag( tagValue );
      },

      /**
       * Callback called when the remove tag button is clicked for a tag
       * 
       * @param {Object} tagValue value of the tag to be removed
       * @return whether the remove was successful
       */
      onRemoveTag : function( tagValue )
      {
        if ( !confirm( this.msgTagging.messageStrings.removeConfirmMsg ) )
        {
          return false;
        }

        var numOfThisTag = this.msgTagging.tagToNumHash[ tagValue ];
        if ( numOfThisTag == 1 )
        {
          delete this.msgTagging.tagToNumHash[ tagValue ];
          var indexOfTag = this.msgTagging.tagNameSet.indexOf( tagValue );
          this.msgTagging.tagNameSet.splice( indexOfTag, 1 );
          this.msgTagging.updateTagFilterSelectBox();
        }
        else
        {
          this.msgTagging.tagToNumHash[ tagValue ]--;
        }

        MessageTaggingService.removeTagFromMessage( this.msgTagging.courseId, this.msgTagging.forumId, this.messageId,
                                                    tagValue );
        return true;
      },

      /**
       * Callback called when a tag is added to a single message
       * 
       * @param {Object} tagValue value of the tag to add to the message
       */
      onAddTag : function( tagValue )
      {
        if ( this.msgTagging.tagToNumHash[ tagValue ] )
        {
          this.msgTagging.tagToNumHash[ tagValue ]++;
        }
        else
        {
          this.msgTagging.tagToNumHash[ tagValue ] = 1;
          this.msgTagging.tagNameSet.push( tagValue.escapeHTML() );
          this.msgTagging.updateTagFilterSelectBox();
        }

        MessageTaggingService.addTagToMessage( this.msgTagging.courseId, this.msgTagging.forumId, this.messageId,
                                               tagValue );
      }
  };

  ReadToggle = Class.create();
  ReadToggle.prototype =
  {
      initialize : function( messageStrings, messageId, sessionId )
      {
        this.messageStrings = messageStrings;
        this.messageId = messageId;
        this.sessionId = sessionId;

        this.messageTable = $( 'message_border.' + messageId );
        this.toggleLink = $( 'message_read_state_' + messageId );
        this.replyLink = $( 'message_replyLink_' + messageId );
        this.quoteLink = $( 'message_quoteLink_' + messageId );

        this.isRead = Element.hasClassName( this.messageTable, "collectionViewReadMessageBorder" );

        Event.observe( this.toggleLink, 'click', this.onToggleClick.bindAsEventListener( this ) );
        if ( this.replyLink )
        {
          Event.observe( this.replyLink, 'click', this.onReplyQuoteClick.bindAsEventListener( this ) );
        }
        if ( this.quoteLink )
        {
          Event.observe( this.quoteLink, 'click', this.onReplyQuoteClick.bindAsEventListener( this ) );
        }
      },

      onToggleClick : function( event )
      {
        var messageDiv;
        if ( this.isRead )
        {
          MessageManagementService.setMessageReadState( this.messageId, false, this.sessionId );

          Element.removeClassName( this.messageTable, "collectionViewReadMessageBorder" );
          Element.addClassName( this.messageTable, "collectionViewUnreadMessageBorder" );
          messageDiv = $( 'message_border.' + this.messageId );
          messageDiv.removeClassName( 'collectionViewReadMessageBorder' );
          messageDiv.addClassName( 'collectionViewUnreadMessageBorder' );
          this.toggleLink.innerHTML = this.messageStrings.markAsRead;
          this.isRead = false;
        }
        else
        {
          MessageManagementService.setMessageReadState( this.messageId, true, this.sessionId );

          Element.removeClassName( this.messageTable, "collectionViewUnreadMessageBorder" );
          Element.addClassName( this.messageTable, "collectionViewReadMessageBorder" );
          messageDiv = $( 'message_border.' + this.messageId );
          messageDiv.removeClassName( 'collectionViewUnreadMessageBorder' );
          messageDiv.addClassName( 'collectionViewReadMessageBorder' );
          this.toggleLink.innerHTML = this.messageStrings.markAsUnread;
          this.isRead = true;
        }

        Event.stop( event );
      },

      onReplyQuoteClick : function( event )
      {
        if ( !this.isRead )
        {
          MessageManagementService.setMessageReadState( this.messageId, true, this.sessionId );

          Element.removeClassName( this.messageTable, "collectionViewUnreadMessageBorder" );
          Element.addClassName( this.messageTable, "collectionViewReadMessageBorder" );
          this.toggleLink.innerHTML = this.messageStrings.markAsUnread;
          this.isRead = true;
        }
      }
  };

  initializeReadToggles = function( messageStrings, sessionId )
  {
    // construct the object model and wire up tagging behavior
    var checkboxes = $A( document.getElementsByName( 'formCBs' ) );
    checkboxes.each( function( chkbox )
    {
      new ReadToggle( messageStrings, chkbox.value, sessionId );
    } );
  };

  initializeTagging = function( messageStrings, forumId, courseId )
  {
    new Tagging( messageStrings, forumId, courseId );
  };

  initializeSelectAllCheckbox = function( containerId )
  {
    message_collection.theSelectAllCheckbox = new SelectAllCheckbox( containerId );
  };

  // module external api.
  message_collection.initializeTagging = initializeTagging;
  message_collection.initializeReadToggles = initializeReadToggles;
  message_collection.initializeSelectAllCheckbox = initializeSelectAllCheckbox;

}() );


function dbExtendedHelp( courseId, helpKey )
{
  var url = 'discussionExtendedHelp?course_id=' + courseId + '&help_key=' + helpKey;
  var remote = window.open( url, 'dbHelp', 'menubar=1,resizable=1,scrollbars=1,status=1,width=480,height=600' );
  if ( remote )
  {
    remote.focus();
    if ( !remote.opener )
    {
      remote.opener = self;
    }
  }
}
