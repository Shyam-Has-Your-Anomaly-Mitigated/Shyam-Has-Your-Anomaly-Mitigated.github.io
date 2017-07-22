var _cId;
var _viewUrl;
var _pageId;

var rubricModule = {


    editRubric : function( rubricId )
    {
      $( 'rubricElementId' ).value = rubricId;
      rubricModule.submitEditRubric();
    },

    submitEditRubric : function( )
    {
      document.forms.rubricManagerForm.action = "/webapps/rubric/do/course/manageRubrics?dispatch=edit&context=course&rubricId="
                                                + $( 'rubricElementId' ).value + "&course_id=" + window.courseId;

      document.forms.rubricManagerForm.submit();
    },

  listAssociatedContents : function( id )
  {
    document.forms.rubricManagerForm.action="/webapps/rubric/do/course/manageRubrics?dispatch=listAssociatedContents&context=course&rubricId=" + id + "&course_id=" + window.courseId;
    document.forms.rubricManagerForm.submit();
  },

  copyRubric : function( id )
  {
    document.forms.rubricManagerForm.action="/webapps/rubric/do/course/manageRubrics?dispatch=copy&context=course&rubricId=" + id + "&course_id=" + window.courseId;
    document.forms.rubricManagerForm.submit();
  },

  viewRubric : function( id )
  {
    var windowId = new Date().getTime();
    var viewUrl = "/webapps/rubric/do/course/manageRubrics?dispatch=view&context=course&rubricId=" + id + "&course_id=" + window.courseId;
    var remote = window.open( viewUrl, windowId, 'width=800,height=500,resizable=yes,scrollbars=yes,status=yes,toolbar=no,menubar=no,location=no,directories=no,top=20,left='+ (screen.width - 800) );
    if ( remote )
    {
      remote.focus();
    }
  },

  /**
   * Preview a rubric in a popup window
   */
  previewRubric : function( id, cId, closeLightbox )
  {
    //close the current lightbox
    if ( closeLightbox == 'true')
    {
      lightbox.closeCurrentLightbox();
    }

    var windowId = new Date().getTime();
    var viewUrl = "/webapps/rubric/do/course/manageRubrics?dispatch=view&context=course&rubricId=" + id + "&course_id=" + cId;
    var remote = window.open( viewUrl, windowId, 'width=800,height=500,resizable=yes,scrollbars=yes,status=yes,toolbar=no,menubar=no,location=no,directories=no,top=20,left='+ (screen.width - 800) );
    if ( remote )
    {
      remote.focus();
    }
    return false;
  },

  /**
   * Preview a rubric in a lightbox
   */
  previewRubricInLightBox : function( id, cId )
  {
    var viewUrl = "/webapps/rubric/do/course/manageRubrics?dispatch=view&context=course&rubricId=" + id + "&course_id=" + cId + "&fromLightbox=true";
    _cId = cId;
    _viewUrl = viewUrl;
    rubricModule.showLightBox(window.event, cId, '', '', viewUrl, '');
  },

  /**
   * Preview a rubric in a current window
   */
  previewRubricInCurrentWindow : function( id, cId )
  {
    document.forms.rubricManagerForm.action = "/webapps/rubric/do/course/manageRubrics?dispatch=view&context=course&rubricId=" + id + "&course_id=" + cId;
    document.forms.rubricManagerForm.submit();
  },

  /**
   * Viewing associated rubrics in a lightbox
   */
  viewAssociatedRubrics : function( entityType, entityId, courseId, title )
  {
    var windowId = new Date().getTime();
    var viewUrl = "/webapps/rubric/do/course/rubricManager?cmd=listRubricAssociations&context=course&course_id=" + courseId +
                   "&entityId=" + entityId + "&entityType=" + entityType +
                   "&entityName=" + title;

    rubricModule.showLightBox(window.event, courseId, entityType, entityId, viewUrl, title);

  },

  deleteRubric : function( id )
  {
    if ( !confirm( window.validateMsg ) )
    {
      return;
    }

    document.forms.rubricManagerForm.action="/webapps/rubric/do/course/manageRubrics?dispatch=delete&context=course&rubricId=" + id + "&course_id=" + window.courseId;
    document.forms.rubricManagerForm.submit();
  },

  validateRemove : function (type )
  {
    if ( !type )
    {
      type = 'rubric';
    }
    if ( this.validateCheckBoxSelection() )
    {
        // confirm that the user really wants to perform the delete operation
        if ( !confirm( window.validateMsg ) )
        {
          return;
        }

        if ( !type || type=='rubric' )
        {
          document.forms.rubricManagerForm.action="/webapps/rubric/do/course/manageRubrics?dispatch=delete&context=course&course_id=" + window.courseId;
        }
        else
        {
          document.rubricManagerForm.selectedRubricIds.value = this.collectCheckBoxSelection();
          document.forms.rubricManagerForm.action="/webapps/rubric/do/course/rubricManager?cmd=deleteAssociations&context=course&course_id=" + window.courseId;
        }
        document.forms.rubricManagerForm.submit();
    }
 },

  validateExport : function ( )
  {
    if ( this.validateCheckBoxSelection() )
    {
      document.rubricManagerForm.selectedRubricIds.value = this.collectCheckBoxSelection();
      document.forms.rubricManagerForm.action="/webapps/rubric/do/course/manageRubrics?dispatch=exportSettings&course_id=" + window.courseId;
      document.forms.rubricManagerForm.submit();
    }
  },

  validateCheckBoxSelection : function ()
  {
    var checked = "false";
    var i;
    if ( document.forms.rubricManagerForm.ckbox )
    {
      if ( !document.forms.rubricManagerForm.ckbox.length )
      {
        if ( document.forms.rubricManagerForm.ckbox.checked )
        {
          checked = "true";
        }
      }
      else
      {
        for ( i = 0; i < document.forms.rubricManagerForm.ckbox.length; i++ )
        {
          if ( document.forms.rubricManagerForm.ckbox[i].checked )
          {
            checked = "true";
            break;
          }
        }
      }
      if ( checked == "false" )
      {
        alert( window.oneSelectionChkBox );
        return false;
      }
      else
      {
        return true;
      }
    }
    else
    {
      return false;
    }
  },

  collectCheckBoxSelection : function ()
  {
    var allIds = "";
    var selectedItems = document.forms.rubricManagerForm.ckbox;
    if ( !selectedItems.length)
    {
      allIds += selectedItems.value + ",";
    }
    else
    {
      for (i=0;i<selectedItems.length;i++)
      {
        if (selectedItems[i].checked)
        {
          var rubricId = selectedItems[i].value;
          allIds += rubricId + ",";
        }
      }
    }
    return allIds;
  },

  popupAssociationEdit : function ( url )
  {
    _pageId = new Date().getMilliseconds();
    itemEditor = popup.launch(url+'&singlePopupPage=true&page_id='+_pageId, 'associatedItem', '800', '500');
    if ( itemEditor )
     {
       itemEditor.focus();
     }
  }
};

/**
 * Show a lightbox for the associated rubrics for a given entity
 */
rubricModule.showCourseRubrics = function (entityType, entityId, courseId, title)
{
   var location = "/webapps/rubric/do/course/rubricManager?cmd=listRubricAssociations&context=course&course_id=" +
                    courseId + "&entityId=" + entityId + "&entityType=" + entityType + "&isLightbox=true";

   rubricModule.showLightBox(window.event, courseId, entityType, entityId, location, title);

};

/**
 * Show a popup picker with a drawer
 */
rubricModule.showPopup = function ( location )
{
   var params = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=900,height=675";
   var left = 0;
   var top = 0;
   if ( window.screenLeft )
   {
     left = window.screenLeft;
     top = window.screenTop;
   }
   else if ( window.screenX )
   {
     left = window.screenX;
     top = window.screenY;
   }
   var widthOffset = ( document.viewport.getWidth() - 800 ) / 2;
   var heightOffset = ( document.viewport.getHeight() + 60 /* toolbars */- 600 ) / 2;
   left = left + ( ( widthOffset > 0 ) ? widthOffset : 0 );
   top = top + ( ( heightOffset > 0 ) ? heightOffset : 0 );
   params = params + ", left=" + left + ", top=" + top;

   location = globalNavigation.getNoGlobalNavUrl( location );
   rubricModule.pickerWin = window.open( location, "pick_ar", params );
   rubricModule.pickerWin.focus();
   return false;
};


rubricModule.cancelDrawer = function() {
  var myDrawer = drawer.model.getCurrentInstance();
  myDrawer.discard();
  if ( window.opener )
  {
     document.rubricManagerForm.cmd.value = 'addAssociations';
     document.rubricManagerForm.submit();
  }
  return false;
};

rubricModule.submitDrawer = function () {
  var myDrawer = drawer.model.getCurrentInstance();
  var selectedItems = myDrawer.getItems(true);
  var i;
  var allIds = "";
  for (i=0;i<selectedItems.length;i++) {
    var rubricId = selectedItems[i].itemId;
    allIds += rubricId + ",";
  }

  document.rubricManagerForm.selectedRubricIds.value = allIds;
  myDrawer.discard();

  if ( window.opener ) {
    document.rubricManagerForm.submit();
  }
  return false;
};


//lightbox
rubricModule.previewLightbox = null;

rubricModule.showLightBox = function (event, courseId, contentType, contentId, previewUrl, boxTitle)
{
  var e = event || window.event; // IE does not capture the event
  if( e && e.type == 'click')
  {
   Event.stop(e);
  }

  if ( window.rubricModuleLightboxTitle )
  {
    boxTitle = window.rubricModuleLightboxTitle.replace( '{0}', boxTitle );
  }

  var onLightboxClosed = function()
  {
    _cId = null;
    _viewUrl = null;
    _pageId = null;
  };

  rubricModule.previewLightbox = new lightbox.Lightbox({
    contents: '',
    defaultDimensions: { w: 500 ,h : 375},
    useDefaultDimensionsAsMinimumSize : true,
    verticalBorder: 125,
    horizontalBorder: 125,
    title: boxTitle,
    onClose: onLightboxClosed
  });
  rubricModule.previewLightbox.cfg.ajax={url:previewUrl, loadExternalScripts:true};
  rubricModule.previewLightbox.cfg.content=null;
  rubricModule.previewLightbox.open();

};

rubricModule.associationListRefresh = function (pageId) {
  //Refresh this window only when the popup window was opened by THIS window.
  if (pageId == _pageId)
  {
    //Confirm with the user if current page need be refreshed, and take the chance to let the data updated at server side.
   if (  confirm(JS_RESOURCES.getString('validation.association.refresh.confirm')) )
    {
      if (_cId && _viewUrl )
      {
        //Refresh this lightbox.
        rubricModule.showLightBox(window.event, _cId, '', '', _viewUrl, '');
      }
      else
      {
        //Refresh this window.
        window.location = window.location.href;
      }
    }
  }
};

rubricModule.onPickerCallback = function( panelId, rubrics )
{
  var panel = rubricModule.panels[ panelId ];
  if ( panel )
  {
    panel.onPickerCallback( rubrics );
  }
  else
  {
    alert( "no panel found for " + panelId );
  }
};

rubricModule.refreshPanel = function( panelId, contentType, contentId, courseId, mode, associations, pointsPossibleElement, onPanelUpdatedIn, pickedRubrics )
{
  var typeDiv = $( "LEARN_RUBRIC_" + panelId );
  var onPanelUpdated = onPanelUpdatedIn;
  var refreshPanelUrl = "/webapps/rubric/do/course/rubricManager?cmd=refreshList&course_id=" + courseId +
  "&entityId=" + contentId + "&entityType=" + contentType + "&panelId=" + panelId +
  "&mode=" + mode + "&pointsPossibleElement=" + pointsPossibleElement;
  if ( associations )
  {
    // including the associations in the request is used in onsubmit mode so that
    // the panel can be refreshed from the state on page rather than on DB
    refreshPanelUrl = refreshPanelUrl + "&associations=" + Object.toJSON( associations );
    refreshPanelUrl = refreshPanelUrl + "&pickedRubrics=" + pickedRubrics;
  }

  //viewUrl should include the refresh cmd so that it would recognize it's a refresh
  new Ajax.Request( refreshPanelUrl,
  {
    method: 'post',
    onSuccess : function ( transport )
    {
      rubricModule.showNewPanelWithEffect( transport.responseText, panelId, refreshPanelUrl, onPanelUpdated );
    },
    onFailure : function ()
    {
      alert( "panel cannot be refreshed" );
      typeDiv.update("");
    }
  });
};


rubricModule.showNewPanelWithEffect = function( newTableHtml, panelId, viewUrl, onPanelUpdated )
{
  var typeDiv = $( "LEARN_RUBRIC_" + panelId );
  var currentTable = $( "table_" + panelId );
  var currentAssociatedRubrics = {};
  var i;
  if ( currentTable )
  {
    var rows = currentTable.tBodies[ 0 ].rows;
    for ( i = 0; i < rows.length; ++i )
    {
      if ( 'none' != rows[ i ].style.display )
      {
        currentAssociatedRubrics[ rows[ i ].id ] = true;
      }
    }
  }
  typeDiv.update( newTableHtml );
  var focused = false;
  var newTable = $( "table_" + panelId );
  if ( newTable )
  {
    var newRows = newTable.tBodies[ 0 ].rows;
    for ( i = 0; i < newRows.length; ++i )
    {
      if ( currentAssociatedRubrics[ newRows[ i ].id ] )
      {
        // already there before, just show it
        newRows[ i ].style.display = '';
      }
      else
      {
        // new one, fade it in!
        rubricModule.rowAppear( newRows[ i ] );
        if ( !focused )
        {
          if (newRows[ i ].childNodes[3])
          {
          // standards
            newRows[ i ].childNodes[3].focus();
          }
          else if ( newRows[ i ].childNodes[2])
          {
          // course objectives
          newRows[ i ].childNodes[2].focus();
          }
          focused = true;
        }
      }
    }
  }
  // I like this focus better than the focus above... TODO - which should it be?
  //if (!focused)
  //{
    var links = typeDiv.getElementsByTagName("a");
    if (links && links.length > 0)
    {
      links[0].focus();
    }
  //}
    // Poking at the span for the aria-live attribute setting after the page has loaded and rendered to make sure it gets read.
    // Just putting it in-page doesn't always read...
    (function ( )
    {
      var divs = typeDiv.getElementsByTagName("span");
      if (divs && divs.length > 0)
      {
        $A(divs).each( function(adiv) {
          var aria = adiv.getAttribute("aria-live");
          if (aria)
          {
            adiv.setAttribute("aria-live", "assertive");
            adiv.innerHTML = adiv.innerHTML + ' ';
          }
        });
      }
    }.defer(1));
  if ( onPanelUpdated )
  {
    onPanelUpdated.defer( 1 ); // let the embedded script runs first so that rubric info is properly updated
  }
};

rubricModule.rowAppear = function( row )
{
  if ( Prototype.Browser.IE )
  {
    row.style.display = '';
    var i;
    for ( i = 0; i<row.cells.length; ++i )
    {
      row.cells[ i ].style.zoom = 1;
      Element.setOpacity( row.cells[ i ], 0 );
    }
    for ( i = 0; i < row.cells.length; ++i )
    {
      Effect.Appear( row.cells[ i ] );
    }
  }
  else
  {
    row.style.display = '';
    row.style.opacity = 0;
    Effect.Appear( row );
  }
};

/***** Methods for removing rubric association ****/

rubricModule.removeRow = function( associatedRubricId, panelId, entityType, associatedEntityId, tableId )
{
  var row = $( 'rubric_' + panelId + associatedRubricId );
  if ( !row )
  {
    return;
  }
  var lastRow = true;
  var currentRow = row.next();
  while ( currentRow && lastRow )
  {
    if ( !currentRow.hasClassName( "pendingDelete" ) )
    {
      lastRow = false;
    }
    currentRow = currentRow.next();
  }
  if ( lastRow )
  {
    currentRow = row.previous();
    while ( currentRow && lastRow )
    {
      if ( !currentRow.hasClassName( "pendingDelete" ) )
      {
        lastRow = false;
      }
      currentRow = currentRow.previous();
    }
  }
  if ( lastRow )
  {
    if ( $( tableId ).parentNode.select(".alignHeader") &&
        $( tableId ).parentNode.select(".alignHeader").length > 0   )
    {
      $( tableId ).parentNode.select(".alignHeader")[0].remove(); // Remove the header too
    }
    $( tableId ).remove();
  }
  else
  {
    if ( !Prototype.Browser.IE )
    {
      Effect.Fade( row.id );
    }
    else
    {
      // in IE we need to fade the cells
      for ( var i = 0; i < row.cells.length; ++i )
      {
        Effect.Fade( row.cells.item( i ) );
      }
    }
  }

};

rubricModule.askAndSyncRubricToPointsPossible = function( rubric, pointsPossibleElement )
{
  if ( rubric.gradeRubricFlag &&
       rubric.numericFlag &&
       pointsPossibleElement &&
       confirm( page.bundle.getString( 'rubric.association.apply_to_points_possible.confirm' ) ) )
  {
   $( pointsPossibleElement ).value = rubric.maxPoints;
  }
};

rubricModule.panels = {};

rubricModule.addPanel = function( panelId, courseId, entityType, entityId, mode, pointsPossibleElement )
{
  var newPanel = new rubricModule.panel( panelId, courseId, entityType, entityId, mode, pointsPossibleElement );
  rubricModule.panels[ panelId ] = newPanel;
  return newPanel;
};

rubricModule.panel = function( panelId, courseId, entityType, entityId, mode, pointsPossibleElement )
{
  this.panelId = panelId;
  this.courseId = courseId;
  this.entityType = entityType;
  this.entityId = entityId;
  this.mode = mode;
  this.rubrics = [];
  this.ackDeletes = [];
  this.inputElement = $( 'rubrics_' + this.panelId );
  this.pointsPossibleElement = pointsPossibleElement;
};

rubricModule.panel.prototype =
{

  showRubricPicker: function( )
  {
    var location = "/webapps/rubric/do/course/rubricManager?cmd=rubricPicker&context=course&course_id=" + this.courseId +
                   "&panelId=" + this.panelId +
                   "&entityId=" + this.entityId +
                   "&entityType=" + this.entityType +
                   "&mode=" + this.mode +
                   "&associations=" + Object.toJSON( this.rubrics ) +
                   "&nextCmd=addAssociations";
    rubricModule.showPopup( location );
    return false;
  },

  showRubricPickerForCreate: function( )
  {
    var location = "/webapps/rubric/do/course/rubricManager?cmd=rubricPicker&context=course&course_id=" + this.courseId +
                   "&panelId=" + this.panelId +
                   "&entityId=" + this.entityId +
                   "&entityType=" + this.entityType +
                   "&mode=" + this.mode +
                   "&nextCmd=createFromExisting";
    rubricModule.showPopup( location );
    return false;
  },

  launchNewRubricEditor: function( )
  {
    var location = "/webapps/rubric/do/course/manageRubrics?dispatch=create&popup=true&course_id=" + this.courseId +
                   "&panelId=" + this.panelId +
                   "&entityId=" + this.entityId +
                   "&entityType=" + this.entityType +
                   "&mode=" + this.mode;
    rubricModule.showPopup( location );
    return false;
  },

  launchRubricEditor: function( rubricId )
  {
    var location = "/webapps/rubric/do/course/manageRubrics?dispatch=edit&popup=true&course_id=" + this.courseId +
                   "&panelId=" + this.panelId +
                   "&entityId=" + this.entityId +
                   "&entityType=" + this.entityType +
                   "&rubricId=" + rubricId +
                   "&mode=" + this.mode;
    rubricModule.showPopup( location );
    return false;
  },

  // TODO Claude: why tableId? Was there ever more than one table? If not it should be removed
  removeRubricAssociation: function( rubricId, tableId )
  {
    var row = $( 'rubric_' + this.panelId + rubricId );
    if ( !row )
    {
      return false;
    }
    row.addClassName( "pendingDelete" );
    if ( this.mode == "immediate" )
    {
      var callbackFunction = function()
      {
        rubricModule.removeRow( rubricId, this.panelId, this.entityType, this.entityId, tableId );
      };
      RubricDWRFacade.removeRubricAssociation( rubricId, this.entityType, this.entityId, callbackFunction.bind( this ) );
    }
    else
    {
      if ( this.removeRubric( rubricId ) )
      {
        rubricModule.removeRow( rubricId, this.panelId, this.entityType, this.entityId, tableId );
      }
    }
    return false;
  },

  setAsGradable: function( rubricId )
  {
    // since we keep the evaluations and grades linked to the previous grading rubric, no need to warn on the change
    var pointsPossibleElement = this.pointsPossibleElement;
    var panel = this;
    this.rubrics.each(
        function( rubric)
        {
          if ( rubric.id == rubricId )
          {
            rubric.gradable = true;
            panel.updateTypeUI( rubric.id, true );
            rubricModule.askAndSyncRubricToPointsPossible( rubric, pointsPossibleElement );
          }
          else
          {
            rubric.gradable = false;
            panel.updateTypeUI( rubric.id, false );
          }
        }
    );
    this.refreshInputValue( );
    return false;
  },

  setAsNotGradable: function( rubricId )
  {
    // since we keep the evaluations and grades linked to the previous grading rubric, no need to warn on the change
    this.getRubric( rubricId ).gradable = false;
    this.updateTypeUI( rubricId, false );
    this.refreshInputValue( );
    return false;
  },

  updateTypeUI: function( rubricId, gradable )
  {
    var menuItemToShowId = gradable?'flyover_non_grading':'flyover_grading';
    var menuItemToHideId = gradable?'flyover_grading':'flyover_non_grading';
    menuItemToShowId = menuItemToShowId + this.panelId + rubricId;
    menuItemToHideId = menuItemToHideId + this.panelId + rubricId;
    $( menuItemToShowId ).show( );
    $( menuItemToHideId ).hide( );
    $( 'rubric_' + this.panelId + rubricId ).className = ( gradable?'gradingRubric':'' );
    var label = gradable?'rubric.association.type.grading':'rubric.association.type.non_grading';
    label = page.bundle.getString( label );
    var iconUrl = gradable?'/images/ci/ng/rubric_graded_li.png':'/images/ci/ng/rubric_not_graded_li.png';
    $( 'type_label_' + this.panelId + rubricId ).update( label );
    $( 'type_icon_' + this.panelId + rubricId ).src = iconUrl;
  },

  getAfterGradableRefreshFunction: function( rubricId )
  {
    var panelId = this.panelId;
    var afterRefreshFunction = function( )
    {
      var imgElement = $( 'gradable_icon_' + panelId + rubricId );
      if ( imgElement )
      {
        var rubric = rubricModule.panels[ panelId ].getRubric( rubricId );
        new page.MiniReceipt( page.bundle.getString( rubric.gradable?"inline_receipt.set_as_gradable":"inline_receipt.set_as_not_gradable"), imgElement.up( 'div' ) );
      }
    };
    return afterRefreshFunction;
  },

  addRubric: function( rubricAssociationId, rubricId, gradable, visibility, showEvalFlag, gradeRubricFlag, numericFlag, maxPoints, isWithEvaluations )
  {
    if ( !this.getRubric( rubricId ) )
    {
      var newRubric = { rubricAssociationId: rubricAssociationId, id: rubricId, gradable: gradable, visibility: visibility,
                        showEval: showEvalFlag, gradeRubricFlag: gradeRubricFlag,
                        numericFlag: numericFlag, maxPoints: maxPoints, withEvaluations: isWithEvaluations };
      this.rubrics.push( newRubric );
      this.refreshInputValue( );
    }
  },

  removeRubric: function( rubricId )
  {
    var rubricToRemove = this.getRubric( rubricId );
    if ( rubricToRemove )
    {
      if ( !rubricToRemove.withEvaluations || this.confirmRemoval( rubricToRemove ) )
      {
        this.getRubric( rubricId, true /* remove if found*/ );
        this.refreshInputValue( );
        return true;
      }
    }
    return false;
  },

  confirmRemoval: function( rubricToRemove )
  {
    if ( confirm( page.bundle.getString( 'rubric.association.remove.with_evaluations' ) ) )
    {
      this.ackDeletes.push( rubricToRemove.rubricAssociationId );
      return true;
    }
    return false;
  },

  setVisibility: function( rubricId, value )
  {
    var rubric = this.getRubric( rubricId );
    if ( rubric )
    {
      var previousValue = rubric.visibility;
      rubric.visibility = value;
      // update on page values (image, icon)
      var imgElement = $( 'visibility_icon_' + this.panelId + rubric.id );
      imgElement.src = "/images/ci/ng/rubric_" + rubric.visibility + ".png";
      var altText = page.bundle.getString( "rubric.association.button.visibility." + rubric.visibility );
      imgElement.alt = altText;
      imgElement.title = altText;
      var labelElement = $( 'visibility_label_' + this.panelId + rubric.id );
      labelElement.update( altText );
      // update fly over menu to only show relevant options
      $( 'flyover_' + previousValue + this.panelId + rubric.id  ).show( );
      $( 'flyover_' + value + this.panelId + rubric.id  ).hide( );
      // update JSON data
      this.refreshInputValue( );
    }
    return false;
  },

  refreshInputValue: function( )
  {
    var inputElement = this.inputElement;
    if ( inputElement )
    {
      var inputJSON = { rubrics: this.rubrics, ackDeletes: this.ackDeletes };
      inputElement.value = Object.toJSON( inputJSON );
    }
  },

  getRubric: function( rubricId, remove )
  {
    var rubrics = this.rubrics;
    for ( var i = 0, len = rubrics.length; i < len; ++i )
    {
      if ( rubrics[ i ].id == rubricId )
      {
        var rubric = rubrics[ i ];
        if ( remove )
        {
          rubrics[ i ] = null;
          this.rubrics = rubrics.compact();
        }
        return rubric;
      }
    }
    return null;
  },

  getGradingRubric: function(  )
  {
    var rubrics = this.rubrics;
    for ( var i = 0, len = rubrics.length; i < len; ++i )
    {
      if ( rubrics[ i ].gradable )
      {
        var rubric = rubrics[ i ];
        return rubric;
      }
    }
    return null;
  },

  onPickerCallback: function( pickedRubrics )
  {
    if ( this.mode == 'immediate' )
    {
      this.refreshPanel( );
    }
    else
    {
      if ( pickedRubrics && pickedRubrics.length > 0 )
      {
        var functionToSyncPointsAfterRefresh;
        var gradingRubric = this.getGradingRubric();
        var isAddGradingRubric = ( gradingRubric === null );
        if ( isAddGradingRubric )
        {
          // so no grading rubric yet, so let's promote one of the selected as the grading rubric
          var nextGradingRubricId = pickedRubrics[ 0 ];
          var isMultipleRubrics = ( pickedRubrics.length > 1 );
          functionToSyncPointsAfterRefresh = function( )
          {
            var rubricToSyncWith = this.getRubric( nextGradingRubricId );
            if ( rubricToSyncWith )
            {
              if ( isMultipleRubrics )
              {
                alert( page.bundle.getString( 'rubric.association.set_gradable.multiple' ) );
              }
              rubricModule.askAndSyncRubricToPointsPossible( rubricToSyncWith, this.pointsPossibleElement );
            }
          };
        }
        else
        {
          for ( var i = 0, len = pickedRubrics.length; i < len; ++i )
          {
            if ( ( pickedRubrics[ i ] == gradingRubric.id ) && this.pointsPossibleElement)
            {
              // Modifying the grading rubric - setup some logic to prompt to update points if desired.
              var oldValue = gradingRubric.maxPoints;
              var elemValue = $(this.pointsPossibleElement).value;
              if (oldValue == elemValue)
              {
                var nextGradingRubricId = gradingRubric.id;
                functionToSyncPointsAfterRefresh = function( )
                {
                  var rubricToSyncWith = this.getRubric( nextGradingRubricId );
                  if (rubricToSyncWith.maxPoints != oldValue)
                  {
                    if ( rubricToSyncWith )
                    {
                      rubricModule.askAndSyncRubricToPointsPossible( rubricToSyncWith, this.pointsPossibleElement );
                    }
                  }
                };
              }
            }
          }
        }
        for ( var i = 0, len = pickedRubrics.length; i < len; ++i )
        {
          // the rubric attributes will be refreshed by the panel refresh
          this.addRubric( '', pickedRubrics[ i ], isAddGradingRubric && ( i === 0 ) /* make the 1st one gradable */,
                          "not_visible", false /*showEvalFlag*/, false/*gradeRubricFlag*/, false/*numericFlag*/, 0/*maxPoints*/, false /* no eval */ );
        }
        this.refreshPanel( functionToSyncPointsAfterRefresh, pickedRubrics );
      }
    }
  },

  refreshPanel: function( afterRefreshFunction, pickedRubrics )
  {
    var panelId = this.panelId;
    var afterRefresh = function( )
    {
      rubricModule.panels[ panelId ].afterRefresh( afterRefreshFunction );
    }
    rubricModule.refreshPanel( this.panelId, this.entityType, this.entityId, this.courseId, this.mode, this.rubrics, this.pointsPossibleElement?this.pointsPossibleElement:"", afterRefresh, pickedRubrics );
  },

  afterRefresh: function( additionalLogic )
  {
    // the AJAX will contain the flyover menus that need to be initialized
    page.util.initFlyoutMenuBehaviourForListActionMenuItems( $( 'table_' + this.panelId ) );
    if ( additionalLogic )
    {
      ( additionalLogic.bind( this ) )( );
    }
  }

};

var refreshConfirm = function(pageId)
{
  rubricModule.associationListRefresh(pageId);
};

