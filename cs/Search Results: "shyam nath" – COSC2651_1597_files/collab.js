var collab_util;

(function()
{
  var isGroupGradeOverride = false;

  function setFirstNodeValue(id, value) {
    var el = $(id);
    var child = el && el.childNodes[0];
    if (child)
    {
      child.nodeValue = value;
    }
    else if (el)
    {
      el.appendChild(document.createTextNode(value));
    }
  }

  function setFirstNodeInnerHtml(id, value) {
    $(id).update(value);
  }

  function showViewCommentsButtonIfNeeded(feed, notes, delay)
  {
    var tryAgainLater = false;
    if (feed)
    {
      if (feed.scrollWidth > feed.clientWidth)
      {
        $('showFeedbackLink').show();
      }
      else
      {
        tryAgainLater = true;
        $('showFeedbackLink').hide();
      }
    }
    if (notes)
    {
      if (notes.scrollWidth > notes.clientWidth)
      {
        $('showNotesLink').show();
      }
      else
      {
        tryAgainLater = true;
        $('showNotesLink').hide();
      }
    }
    if (tryAgainLater && Prototype.Browser.IE )
    {
      // IE doesn't seem to honor the img.complete flag, so if we don't have the show notes link, just keep trying
      // but try  'slower'
      startShowComments(delay+1);
    }
  }

  function startShowComments(delay)
  {
    var retries = 0;
    var feed = $('graderComments');
    var notes = $('gradingNotes');
    var feedimgs;
    var notesimgs;
    if (!delay)
    {
      delay = 0.2;
    }
    if (feed)
    {
      feedimgs = feed.getElementsByTagName( 'img' );
    }
    if (notes)
    {
      notesimgs = notes.getElementsByTagName( 'img' );
    }
    if (delay > 0.2)
    {
      // We're coming in here for a failsafe for IE.  Only keep checking if we actually have images.
      if (delay > 10 || ((!feedimgs || feedimgs.length === 0) && (!notesimgs || notesimgs.length === 0)))
      {
        return;
      }
    }
    new PeriodicalExecuter(
     function(pe)
     {
       retries++;
       var allDone = page.util.allImagesLoaded( feedimgs );
       if (allDone)
       {
         allDone = page.util.allImagesLoaded( notesimgs );
       }
       if (allDone || retries > 100)
       {
         showViewCommentsButtonIfNeeded(feed,notes, delay);
         pe.stop();
       }
     }.bind(this), delay
    );
  }

  function showGradeInfo() {
    Effect.Fade('gradeDetailsForm', { duration: 0.3 });
    $$(".collabGradeInfo").invoke("show");
    if (!isGroupGradeOverride) {
      $('groupGradeOverrideData').hide();
    }
    startShowComments();
  }

  function onGradeInfoSaved( blogGradeInfoRes )
  {
    var blogGradeInfo;
    try
    {
      if (typeof(JSON) === 'object' && typeof(JSON.parse) === 'function')
      {
        blogGradeInfo = JSON.parse( blogGradeInfoRes.responseText );
      }
      else
      {
        blogGradeInfo = eval('(' + blogGradeInfoRes.responseText + ')');
      }
    }
    catch (e)
    {
      document.write( blogGradeInfo.responseText );
      return;
    }

    //in case of errors generated from the backend, generate an alert message.
    if ( blogGradeInfo.error )
    {
      $('blogGradingForm').elements['blackboard.platform.security.NonceUtil.nonce'].value = blogGradeInfo.nonce;
      alert( blogGradeInfo.message );
      return;
    }

    var emptyBlogVal = page.bundle.getString("collab.gradePanel.empty.value");
    setFirstNodeValue('blogGradeValue', blogGradeInfo.gradePoints || emptyBlogVal);
    var feedback = emptyBlogVal;
    var textFeedback = feedback;
    if (blogGradeInfo.feedbackComment)
    {
      feedback = blogGradeInfo.displayFeedbackComment;
      textFeedback = blogGradeInfo.feedbackComment.formattedText;
    }
    if (feedback == '')
    {
      feedback = emptyBlogVal;
    }
    setFirstNodeInnerHtml('graderComments', feedback);
    var notes = emptyBlogVal;
    var textNotes = notes;
    if (blogGradeInfo.gradingNotes)
    {
      notes = blogGradeInfo.displayGradingNotes;
      textNotes = blogGradeInfo.gradingNotes.formattedText;
    }
    if (notes == '')
    {
      notes = emptyBlogVal;
    }
    setFirstNodeInnerHtml('gradingNotes', notes);
    setFirstNodeValue('graderDate', blogGradeInfo.gradingDate);
    $('blogGradingForm').elements['blackboard.platform.security.NonceUtil.nonce'].value = blogGradeInfo.nonce;

    $("collabGradeField").value = blogGradeInfo.gradePoints;
    $('old_collabGradeField').value = blogGradeInfo.gradePoints;
    $("gradeCommentField").value = textFeedback;
    $('old_gradeCommentField').value = textFeedback;
    $('gradeNotes').value = textNotes;
    $('old_gradeNotes').value = textNotes;

    if ( !blogGradeInfo.gradeOverridden && $('overrideIcon') )
    {
      $('overrideIcon').remove();
      $('overrideWarningEdit').remove();
      $('overrideWarning').remove();
    }

    setFirstNodeValue('groupGradeValue', blogGradeInfo.groupGrade );
    setFirstNodeValue('groupGrade', blogGradeInfo.groupGrade );

    isGroupGradeOverride = blogGradeInfo.groupGradeOverride;
    if ( blogGradeInfo.changedGrades )
    {
      var grades = blogGradeInfo.changedGrades.grades;
      if ( grades )
      {
        for ( var i=0, len=grades.length; i < len; ++i )
        {
          var span = $('gs'+grades[i].cu_id);
          if ( span )
          {
            if ( grades[i].nullGrade )
            {
              span.innerHTML = window.needsGradingHTML;
            }
            else
            {
              span.innerHTML = "";
            }
          }
        }
      }
      window.gradeVersion = blogGradeInfo.changedGrades.version;
    }
    if (blogGradeInfo.rubricJson)
    {
      var rubricEvaluation = $('_rubricEvaluation');
      if (rubricEvaluation)
      {
        rubricEvaluation.value = Object.toJSON(blogGradeInfo.rubricJson);
        var originalRubricEvaluation = $('_originalRubricEvaluation');
        if (originalRubricEvaluation)
        {
          originalRubricEvaluation.value = rubricEvaluation.value;
        }
        var readOnlyRubricEvaluation = $('ro_rubricEvaluation');
        if (readOnlyRubricEvaluation)
        {
          readOnlyRubricEvaluation.value = rubricEvaluation.value;
        }
      }
    }
    showGradeInfo();

    var gradeHistoryLink = $('gradeHistoryLink');
    if ( gradeHistoryLink && blogGradeInfo && blogGradeInfo.numGradeHistory > 1 )
    {
      gradeHistoryLink.show();
      if ( gradeHistoryLink.href.endsWith('&gradeDetailId=') ) // need to append gradeDetailId to grade history href
      {
        gradeHistoryLink.href += blogGradeInfo.gradeDetailId;
      }
    }

    try
    {
      var gsMsg = $('gradeSavedMsg');
      gsMsg.removeClassName('hideoff');
      gsMsg.focus();
      gsMsg.addClassName('hideoff');
    }
    catch (ignore)
    {
      // TODO - this looks like it is trying to focus on a hidden span "for accessibility" -
      // that doesn't work in IE so we should try something different...
    }
    if ( typeof theAttemptNavController != 'undefined' )
    {
      theAttemptNavController.enableNavigation();
    }
  }

  function showGradeEdit()
  {
    $('gradeDetailsForm').show();
    // NOTE: We have to update the width here, based on the css-styled form's width, because
    // the browser is sizing the list based on the contents of the list, not the container - and
    // we need the container to set our width for us.
    var calculatedWidth = $('gradeDetailsForm').getWidth() * 0.9 + "px";
    $('gradeDetailsFormList').style.width = calculatedWidth;
    var egactionList = $('editGradeActionList');
    egactionList.style.width = calculatedWidth;
    $A(egactionList.getElementsByTagName('input')).each(function(i) {
      $(i).style.maxWidth=calculatedWidth;
    });

    if ( typeof theAttemptNavController != 'undefined' )
    {
      theAttemptNavController.disableNavigation(collab_util.gradeSubmitIfChanged);
    }

    var gradeCommentsFieldValue = $("gradeCommentField").value;
    if (gradeCommentsFieldValue.indexOf('<') != -1)
    {
      $('readOnlyFeedbackComment').update($('graderComments').innerHTML);
      $('readOnlyStudentComments').show();
      $('studentCommentsTextDiv').hide();
    }
    else
    {
      $('readOnlyStudentComments').hide();
      $('studentCommentsTextDiv').show();
    }

    var instructorNotesFieldValue = $("gradeNotes").value;
    if (instructorNotesFieldValue.indexOf('<') != -1)
    {
      $('readOnlyGradingNotes').update($('gradingNotes').innerHTML);
      $('readOnlyInstructorComments').show();
      $('instructorCommentsTextDiv').hide();
    }
    else
    {
      $('readOnlyInstructorComments').hide();
      $('instructorCommentsTextDiv').show();
    }

    Element[isGroupGradeOverride ? 'show' : 'hide']($("groupGradeField"));
    $$(".collabGradeInfo").invoke("hide");

    $('collabGradeField').focus();
    $('collabGradeField').select();
  }

  FastInit.addOnLoad(
      function()
      {
        var overrideData = $('groupGradeOverrideData');
        if (overrideData) {
          isGroupGradeOverride = overrideData.visible();
        }

        if( $("collabGradeField") )
        {
          Event.observe( "collabGradeField", "keydown",
              function( event )
              {
                if( event.keyCode == Event.KEY_RETURN )
                {
                  Event.stop( event );
                  collab_util.gradeSubmit();
                }
              });
        }
        var oldGrade = $('old_gradeCommentField');
        if (oldGrade)
        {
          oldGrade.value = $('gradeCommentField').value;
        }
        var oldNotes = $('old_gradeNotes');
        if (oldNotes)
        {
          oldNotes.value = $('gradeNotes').value;
        }
        startShowComments();

        var container = $('containerdiv');
        if (container)
        {
          // Create space on page so the OK button will display
          Element.addClassName(container, "collabContainer");
        }
      });

  collab_util = {
    showData: function(item){
      var ul = $(item);
      var a = $(item+'Link');
      var itemTitle = a.innerHTML.stripTags();
      var img = a.getElementsByTagName('img')[0];

      function applyTitle(key, title) {
        a.title = page.bundle.getString(key, title );
        img.alt = page.bundle.getString(key, '' );
      }

      if(ul.style.display=="none"){
        ul.style.display="block";
        a.className="itemHead itemHeadOpen";
        applyTitle('expandCollapse.collapse.section.nocolon' );
      }
      else if(ul.style.display=="block" || ul.style.display==""){
        ul.style.display="none";
        a.className="itemHead";
        applyTitle('expandCollapse.expand.section.nocolon' );
      }

      return false;
    },

    hideDesc: function(msg){
      var msgspan=$(msg);
      var msgimg=$(msg+"img");

      function applyState(display, src, title) {
        msgspan.style.display=display;
        msgimg.src=src;
        msgimg.title=title;
        msgimg.alt=title;
      }

      if(msgspan.style.display=="" || msgspan.style.display=="inline"){
        applyState("none", getCdnURL( "/images/ci/ng/more_options.gif" ), page.bundle.getString('collab.expand.instructions'));

        UserDataDWRFacade.setStringPermScope( "collab.instructionsExpanded", false );
      }else{
        applyState("inline", getCdnURL( "/images/ci/ng/less_options_dark.gif" ), page.bundle.getString('collab.collapse.instructions'));

        UserDataDWRFacade.setStringPermScope( "collab.instructionsExpanded", true );
      }
    },

    toggleGrade: function()
    {
      if (!$('gradeDetailsForm').visible())
      {
        showGradeEdit();
      }
      else
      {
        showGradeInfo();
      }
    },

    gradeSubmitIfChanged: function(saving)
    {
      var grade = $('collabGradeField').value;
      var feedbackComment = $('gradeCommentField').value;
      var newGradingNotes = $('gradeNotes').value;
      var old_grade = $('old_collabGradeField').value;
      var old_feedbackComment = $('old_gradeCommentField').value;
      var old_gradingNotes = $('old_gradeNotes').value;

      if ( old_grade != grade || old_feedbackComment != feedbackComment || old_gradingNotes != newGradingNotes )
      {
        if (saving)
        {
          return collab_util.gradeSubmit();
        }
        else
        {
          return false;
        }
      }
      // No changes - ok to continue.
      if ( typeof theAttemptNavController != 'undefined' )
      {
        theAttemptNavController.enableNavigation();
      }
      return true;
    },

    gradeSubmit: function()
    {
      var gradeElement = $('collabGradeField');
      if (!collab_util.validGradeEntry(gradeElement))
      {
        return false;
      }
      else
      {
        if ( typeof theAttemptNavController != 'undefined' )
        {
          theAttemptNavController.enableNavigation();
          // We save via ajax and then let the nav controller go to the next page - this will pass the receipt message through to the next page.
          theAttemptNavController.receiptMsgArgs = "&inline_receipt_bundle=ng_tags&inline_receipt_key=collab.changes.saved";
        }
        if ( window.gradeVersion )
        {
          $('grade_version').value = window.gradeVersion;
        }
        $('grade_action').value = "grade";
        $('blogGradingForm').request( { onComplete: onGradeInfoSaved } );

        var inlineMsg = page.bundle.getString( 'collab.changes.saved' );
        new page.NestedInlineConfirmation( "success", inlineMsg, false, $s('gradeBlogLink_id'), false, undefined, undefined, undefined, true );

        return true;
      }
    },

    validGradeEntry : function(gradeElement)
    {
      var grade = gradeElement.value;

      if(grade.trim()=="")
      {
        alert(page.bundle.getString("collab.grade.grade.cannot.be.empty"));
        safeFocus( gradeElement );
        return false;
      }
      else if ( !isNumeric( grade ) && grade != "-" )
      {
        alert(page.bundle.getString("collab.grade.grade.invalid.value"));
        safeFocus(gradeElement);
        return false;
      }
      else if ( grade < 0 )
      {
        alert(page.bundle.getString("collab.grade.grade.too.less.value"));
        safeFocus(gradeElement);
        return false;
      }
      return true;
    },

    /**
     * Update the lightbox comments/notes/grade value if they were modified on the collab panel.
     *
     * If the notes/comments contained HTML  they would be in read only mode on the collab panel.  So we only need to
     * check if they have changed if they were plain text.
     */
    updateWithCollabPanelCommentsAndGradeIfNeeded: function()
    {
      // update student comments from the collab panel if needed
      var collabPanelGradeComments = $("gradeCommentField");
      if ( collabPanelGradeComments.value.indexOf('<') == -1 && ( collabPanelGradeComments.value != collabPanelGradeComments.defaultValue ) )
      {
        var vtbeGradeComments = editors.feedBackToUserOverridetext;
        if ( vtbeGradeComments )
        {
          // vtbe is enabled
          vtbeGradeComments.setHTML( collabPanelGradeComments.value );
        }
        else
        {
          // update textarea
          $('feedBackToUserOverridetext').value = collabPanelGradeComments.value;
        }
      }

      // update instructor notes from the collab panel if needed
      var collabPanelGradeNotes = $("gradeNotes");
      if ( collabPanelGradeNotes.value.indexOf('<') == -1 && ( collabPanelGradeNotes.value != collabPanelGradeNotes.defaultValue ) )
      {
        var vtbeGradeNotes = editors.instructorNotesOverridetext;
        if ( vtbeGradeNotes )
        {
          // vtbe is enabled
          vtbeGradeNotes.setHTML( collabPanelGradeNotes.value );
        }
        else
        {
          // update textarea
          $('instructorNotesOverridetext').value = collabPanelGradeNotes.value;
        }
      }

      // update grade value from the collab panel if needed
      var collabPanelOldGradeValue = $('old_collabGradeField').value;
      var collabPanelGradeValue = $('collabGradeField').value;
      if ( collabPanelGradeValue != collabPanelOldGradeValue )
      {
        // user changed the grade value, need to update the lightbox with the current value from the collab panel
        $('collabGradePoints').value = collabPanelGradeValue;
      }

    },
    lbCancelComments: function()
    {
      if ( typeof theAttemptNavController != 'undefined' )
      {
        theAttemptNavController.enableNavigation();
      }
      lightbox.closeCurrentLightbox();
    },

    cancelGrade: function()
    {
      var grade = $('collabGradeField').value;
      var feedbackComment = $('gradeCommentField').value;
      var gradingNotes = $('gradeNotes').value;
      var rubricEvaluationEl = $('_rubricEvaluation');
      var rubricEvaluation = '';
      if (rubricEvaluationEl)
      {
        rubricEvaluation = rubricEvaluationEl.value;
      }
      var old_rubricEvaluationEl = $('_originalRubricEvaluation');
      var old_rubricEvaluation = '';
      if (old_rubricEvaluationEl)
      {
        old_rubricEvaluation = old_rubricEvaluationEl.value;
      }
      var old_grade = $('old_collabGradeField').value;
      var old_feedbackComment = $('old_gradeCommentField').value;
      var old_gradingNotes = $('old_gradeNotes').value;

      if ( old_grade != grade ||
           old_feedbackComment != feedbackComment ||
           old_gradingNotes != gradingNotes ||
           old_rubricEvaluation != rubricEvaluation)
      {
        if ( confirm ( page.bundle.getString( "collab.grade.grade.blog.cancel.confirmation" ) ) )
        {
          $('collabGradeField').value = old_grade;
          $('gradeCommentField').value = old_feedbackComment;
          $('gradeNotes').value = old_gradingNotes;
          $('_rubricEvaluation').value = old_rubricEvaluation;

          if ( typeof theAttemptNavController != 'undefined' )
          {
            theAttemptNavController.enableNavigation();
          }

          showGradeInfo();
        }
      }
      else
      {
        if ( typeof theAttemptNavController != 'undefined' )
        {
          theAttemptNavController.enableNavigation();
        }

        showGradeInfo();
      }
    },

    revertGrade: function( emptyBlogVal )
    {
      $('grade_action').value = "revertGrade";
      $('blogGradingForm').request( { onComplete: onGradeInfoSaved } );
    },

    showNotesLightbox: function (event)
    {
      collab_util.showLightbox(event, {id:'gradingNotes', move:false}, '');
    },

    showFeedbackLightbox: function (event)
    {
      collab_util.showLightbox(event, {id:'graderComments', move:false}, '');
    },

    showLightbox: function(event, content, title)
    {
        var e = event || window.event; // IE does not capture the event
        if( e && e.type === 'click')
        {
          Event.stop(e);
        }

        var fullLightbox = new lightbox.Lightbox({
            contents: content,
            title: title,
            defaultDimensions: { w: 500, h : 375 },
            useDefaultDimensionsAsMinimumSize: true,
            verticalBorder: 125,
            horizontalBorder: 125
        });

        fullLightbox.open();
    }
  };
}());   // End collab.js private module

var loadedComments = [];

function hideComments( element, entryId )
{
  element.style.display = "none";
  $('comments' + entryId + '_img').src = getCdnURL( "/images/ci/ng/more_options_dark.gif" );
  $('comments' + entryId + '_img').setAttribute('aria-expanded', false);
  $('comments' + entryId + '_span').innerHTML = page.bundle.getString( 'collab.comments.expand.alt' );
}

function getCommentHTML( courseMembershipId, entryParentId, entryId, comment )
{
  var commentHTML;
  if( comment.canDelete )
  {
    commentHTML = $('commentTemplate').innerHTML;
    commentHTML = commentHTML.replace( '_commentId', comment.id );
    commentHTML = commentHTML.replace( '_entryId', entryId );
    commentHTML = commentHTML.replace( '_entryParentId', entryParentId );
  }
  else
  {
    commentHTML = $('commentTemplateNoDelete').innerHTML;
  }
  var newMarkerText = comment.newComment ? ('<span class="newItems">' + page.bundle.getString( 'collab.entry.new' ) + '</span>') : '';
  commentHTML = commentHTML.replace( '_newMarker', newMarkerText );
  commentHTML = commentHTML.replace( '_user', comment.nametag );
  commentHTML = commentHTML.replace( '_date', comment.creationDate );
  var message = comment.text;
  if ( message !== null )
  {
    message = message.replace( /\n/g, '<br>');
  }
  commentHTML = commentHTML.replace( '_text', message );
  if( comment.creatorId == courseMembershipId )
  {
    commentHTML = commentHTML.replace( '<h5>', '<h5 class="newItems">' );
  }
  return commentHTML;
}

function updateStreamScrollBar()
{
  if ( window.stream )
  {
    window.stream.updateScrollRHS();
  }
}

function onCommentLoaded( courseMembershipId, entryParentId, entryId, element, comments, commentToFocusId )
{
  var commentsHTML = "";
  for( var i = 0; i < comments.length; i++ )
  {
    var comment = comments[i];
    var commentHTML = getCommentHTML( courseMembershipId, entryParentId, entryId, comment );
    var commentClass="comment-wrapper";
    if ( commentToFocusId && ( comment.id == commentToFocusId ) )
    {
      commentClass = "comment-wrapper commentInFocus";
    }
    commentsHTML = (commentsHTML + '<li id=\'comment_block' + comment.id + '\' class=\'' + commentClass + '\'>' + commentHTML + '</li>' );
  }
  //TODO use dom.createTextNode instead of innerHTML
  element.innerHTML = commentsHTML;
  loadedComments[entryId] = 'loaded';
  updateStreamScrollBar();
}

function scrollToElement(elem)
{
  if ( window.stream )
  {
    if (window.stream.scrollRHSTo(elem))
    {
      return;
    }
  }
  page.util.ensureVisible( elem );
}

function toggleComments( jsProxy, courseId, courseMembershipId, entryParentId, entryId, lastBlogCommentUpdate,
                         commentToFocusId )
{
  var elementId = 'comments' + entryId;
  var commentsElement = $(elementId);
  if( !commentsElement )
  {
    return false;
  }
  if( commentsElement.style.display == "block" )
  {
    hideComments( commentsElement, entryId );
    updateStreamScrollBar();
    /* Setting the focus to the link again */
    $('comments' + entryId + '_img').parentNode.focus();
    return true;
  }
  var status = loadedComments[entryId];
  if( !status )
  {
    loadedComments[entryId] = 'loading';
    //TODO show a hidden div instead
    commentsElement.innerHTML = '<li><h5>' + page.bundle.getString( 'collab.comments.loading' ) + '</h5></li>';
    jsProxy.getComments( courseId, entryParentId, entryId, lastBlogCommentUpdate,
                         function( comments )
                         {
                           onCommentLoaded( courseMembershipId, entryParentId, entryId, commentsElement, comments, commentToFocusId );
                           if ( commentToFocusId )
                           {
                             var commentBlock = $( 'comment_block' + commentToFocusId );
                             if( commentBlock )
                             {
                               scrollToElement( commentBlock );
                             }
                           }
                         }
                       );
  }
  commentsElement.style.display = "block";
  $('comments' + entryId + '_img').src = getCdnURL( "/images/ci/ng/less_options_dark.gif" );
  $('comments' + entryId + '_img').setAttribute('aria-expanded', true);
  $('comments' + entryId + '_span').innerHTML = page.bundle.getString( 'collab.comments.collapse.alt' );
  if ( !commentToFocusId )
  {
    /* Setting the focus to the link again */
    $('comments' + entryId + '_img').parentNode.focus();
  }
  updateStreamScrollBar();
  return true;
}

function showCommentInput( entryId )
{
  var commentForm = $('addBlogComment'+entryId);
  commentForm.style.display = 'block';
  $('comment' + entryId).focus();
  updateStreamScrollBar();
  scrollToElement(commentForm);
  return false;
}

function hideCommentInput( entryId )
{
  var textElement = $('comment' + entryId);
  var inputBlock = $('addBlogComment' + entryId);
  var anonymousCheckbox = $('anonymous' + entryId);
  if( anonymousCheckbox )
  {
    anonymousCheckbox.checked = false;
  }
  textElement.value = "";
  inputBlock.style.display = "none";
  updateStreamScrollBar();
}

function cancelComment( entryId )
{
  var elementId = 'comments' + entryId;
  var commentsElement = $(elementId);
  var textElement = $('comment' + entryId);
  if( !textElement || !commentsElement )
  {
    return;
  }
  textElement.value = '';
  hideCommentInput( entryId );
}

function onCommentSaved( courseMembershipId, entryParentId, entryId, li, savedComment )
{
  var commentsElement = $('comments' + entryId);
  if( !savedComment || savedComment.errorMessage )
  {
    if (savedComment && savedComment.errorMessage)
    {
      alert( savedComment.text);
    }
    else
    {
      alert( page.bundle.getString( 'collab.comment.saving.error' ) );
    }
    commentsElement.removeChild(li);
    return false;
  }
  li.id = 'comment_block' + savedComment.id;
  li.innerHTML = getCommentHTML( courseMembershipId, entryParentId, entryId, savedComment );
  $('commentsCount' + entryId).innerHTML = Number( $('commentsCount' + entryId).innerHTML ) + 1;
  // In case this was our first comment, make sure we show the header so we can expand the comment list.
  var commentsHeader = $('commentsHeader' + entryId);
  if (commentsHeader)
  {
    commentsHeader.show();
  }
  updateStreamScrollBar();
  return true;
}

function saveComment( jsProxy, entryParentId, entryId, courseMembershipId, maxLen )
{
  var elementId = 'comments' + entryId;
  var commentsElement = $(elementId);
  var textElement = $('comment' + entryId);
  if( !textElement || !commentsElement )
  {
    return false;
  }
  var textMsg = textElement.value;
  if( textMsg.strip() == "" )
  {
    alert( page.bundle.getString( 'collab.comment.required.error' ) );
    textElement.focus();
    return false;
  }
  if( maxLen != -1 && textMsg.length > maxLen )
  {
    alert( page.bundle.getString( 'collab.comment.too_long.error', maxLen ) );
    return false;
  }
  var anonymousCheckbox = $('anonymous' + entryId);
  var anonymousPost = (anonymousCheckbox && anonymousCheckbox.checked) ? true : false;
  var li = document.createElement('li');
  li.className='comment-wrapper';
  li.innerHTML = page.bundle.getString( 'collab.comment.saving' );
  commentsElement.appendChild(li);
  //commentsElement.insertBefore(li, commentsElement.firstChild);
  hideCommentInput( entryId );
  jsProxy.addComment( entryParentId, entryId, anonymousPost, textMsg,
                      function( savedComment )
                      {
                        if (onCommentSaved(courseMembershipId, entryParentId, entryId, li, savedComment))
                        {
                          hideCommentInput( entryId );
                        }
                      }
                    );
  return true;
}

function onCommentDeleted( entryId, commentElement, success )
{
  if( !success )
  {
    alert( page.bundle.getString( 'collab.comment.delete.error' ) );
    commentElement.style.display = 'block';
  }
  else
  {
    if( commentElement.previousSibling )
    {
      commentElement.previousSibling.focus();
    }
    else
    {
      commentElement.parentNode.focus();
    }

    var commentsElement = $('comments' + entryId);
    commentsElement.removeChild( commentElement );
    $('commentsCount' + entryId).innerHTML = commentsElement.childNodes.length;
  }
}

function deleteComment( jsProxy, entryParentId, entryId, commentId )
{
  var commentElement = $('comment_block' + commentId);
  if( !commentElement )
  {
    return;
  }
  if( !confirm( page.bundle.getString( 'collab.comment.delete.confirmation' ) ) )
  {
    return;
  }
  jsProxy.deleteComment( entryParentId, entryId, commentId,
                         function( success )
                         {
                           onCommentDeleted( entryId, commentElement, success );
                         }
                       );
}
