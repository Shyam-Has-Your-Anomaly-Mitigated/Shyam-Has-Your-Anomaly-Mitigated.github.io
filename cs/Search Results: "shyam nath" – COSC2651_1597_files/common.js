var common_db_util =
{
  /**
   * Validate that at least one checkbox in the form is checked.
   * 
   * @param formName Optional form name parameter. Default is the first form on the page.
   * @param checkboxInputName Optional checkbox input name parameter. Default name is "ckbox".
   * @param selectAtLeastOneErrorMsg Required. Message to display in an alert box if no checkboxes are checked.
   * @return true if there is at least one checkbox checked in the form; otherwise false
   */
  validateCheckboxes : function( formName, checkboxInputName, selectAtLeastOneErrorMsg )
  {
    if ( !formName )
    {
      formName = 0;
    }
    if ( !checkboxInputName )
    {
      checkboxInputName = "ckbox";
    }

    if ( document.forms[ formName ].elements[ checkboxInputName ] )
    {
      if ( !document.forms[ formName ].elements[ checkboxInputName ].length )
      {
        // This is one of the vagaries of javascript
        // if an object is referred by name, if there is only ONE object on the page, you get that object.
        // If there is MORE than one object, you get an array of them.
        if ( document.forms[ formName ].elements[ checkboxInputName ].checked )
        {
          return true;
        }

      }
      else
      {
        for ( var i = 0; i < document.forms[ formName ].elements[ checkboxInputName ].length; i++ )
        {
          if ( document.forms[ formName ].elements[ checkboxInputName ][ i ].checked )
          {
            return true;
          }
        }
      }
    }

    alert( selectAtLeastOneErrorMsg );
    return false;

  }

};
