/**
 * tagging.js
 **/
var tagging = {
  Tags: Class.create({
    /**
   * Tagging Behaviour
   *
   * The tagging behaviour manages displaying a list of tags associated to some element
   * and the addition/removal of tags to that list.  It will invoke the supplied callback
   * with the signature "addCallback( tagValue )" when a new tag is added, and
   * "removeCallback( tagValue )" when a tag is removed. Also a getMatchingTagsCallBack( tagValue )
   *  can suggest a set of relevant suggestions based on the input tag value.
   * Note: the tag values should be enclosed in either an anchor or a span, depending
   * on whether you want a link on the tag or not.
   *
   * There are 6 main sub-spans that must be in the tags element, they are:
   * 1. Container for the actual tag spans
   * 2. Container for the "add tag" link
   * 3. Container for the add tag text box and ok button (must be hidden initially)
   * 4. Localized text for "None" (must be hidden)
   * 5. HTML that will go in the "remove" span in the tag when a new one is created (must be hidden)
   * 6. (Optional) link that will be attached to a new tag.  The text @X@TagName@X@ in that link will be
   *    replaced by the actual tag name.  If this span is not present, links will not be created
   *    on new tags.
   *
   * Example:
   * <span>
   *  <span>
   *   <span class="tag"><a href="http://linkToViewTag1">tag1</a> <span>remove icon</span></span>
   *   <span class="tag"><a href="http://linkToViewTag2">tag12</a> <span>remove icon</span></span>
   *   ...
   *  </span>
   *  <span><a href="#" onClick="return false;" class="inlineAction">${ addTagLabel }</a></span>
   *  <span style="display:none"><input autocomplete="off" type="textbox" size="15">
   *    <span><a href="#" onClick="return false;" class="inlineAction">${ okLabel }</a></span>
   *  </span>
   *  <span class="hidden">${ noneLabel }</span>
   *  <span class="hidden"><img src="linktoremoveimage"></span>
   *  <span class="hidden">javascript:addTag('@X@TagName@X@');</span>
   * </span>
   */
    // todo: modify the logic to use $ and then traverse the dom and remove the dependency on the actualy HTML structure
    initialize: function(taggingData){
      this.messageStrings = taggingData.messageStrings;
      this.tagIdString = taggingData.tagIdString;
      this.container = $s(taggingData.tagIdString);
      this.tags = [];
      // readonly mode, no association of event handlers
      if( !this.container )
      {
        return;
      }
      // use for autocompletion
      this.tagSet = [];
      this.existingTagSet = [];
      if(taggingData.allTags && taggingData.allTags.length > 0){
       for (var c = 0; c < taggingData.allTags.length; c++) {
         this.tagSet.push( taggingData.allTags[c].value);
       }
      }
      this.allTags = taggingData.fullTagArray;
      this.allTagsFontMap = $H(taggingData.fullTagFontMap);
      this.showTagCloud = taggingData.showTagCloud;

      this.normalizeTagValue = taggingData.normalizeTagValue;
      this.showAutoComplete = taggingData.showAutoCompleteForTags;
      this.showSelectFromExistingLink = taggingData.showSelectFromExisting;
      this.removeMsg = taggingData.removeMsg;

      this.hiddenFieldName = taggingData.fieldName;
      this.field =$('id_' + this.tagIdString + "_" + this.hiddenFieldName);

      //filter out the text nodes
      var childrenElements = bbcommon.filterOutNonElements(this.container.childNodes);
      // the following references all the exisiting tags
      this.tagsContainer = childrenElements[0];
      this.addTagButton = childrenElements[1];
      this.addTagInputElements = childrenElements[2];

      var tagInputElements = bbcommon.filterOutNonElements(this.addTagInputElements.childNodes);
      this.addTagInputTextField = tagInputElements[1];
      // accomodate for the auto-complete div element which is tagInputElements[2]
      this.addTagOkButton = tagInputElements[3];
      this.noneText = childrenElements[3].innerHTML;
      this.removeText = childrenElements[4].innerHTML;
      var count = 5;
      if (childrenElements.length == 6 || childrenElements.length == 8) {
        this.viewLink = childrenElements[count++].innerHTML;
      }
      else {
        this.viewLink = '';
      }
      if (childrenElements.length == 7 || childrenElements.length == 8) {
        this.chooseFromExistingLink = $(childrenElements[count++]);
        this.chooseExistingSpan = $(childrenElements[count++]);
        this.chooseExistingSpan.remove();
        this.chooseExistingSpan.setStyle({
           display: 'none'
         });
        document.body.appendChild(this.chooseExistingSpan);
        this.existingSpan = this.chooseExistingSpan.down('span');
        this.existingSpanCloseLink = this.chooseExistingSpan.down('a.closeCloud');
      }
      this.addCallback = taggingData.addJsCallback;
      this.removeCallback = taggingData.removeJsCallback;
      this.getMatchingTagsCallback = taggingData.getMatchingTagsJsCallback;
      this.attachBehaviourToElements();

    },

    attachBehaviourToElements: function(){
      //init tags
      var tagsElements = bbcommon.filterOutNonElements(this.tagsContainer.childNodes);
      tagsElements.each(function(tagElement){
        this.tags.push(new tagging.Tag(tagElement, this));
      }.bind(this));
      this.tags.each(function(tagEle){
        this.existingTagSet.push(tagEle.value);
      }.bind(this));
      //wire up the add tag functionality
      Event.observe(this.addTagButton, 'click', this.onClickAddTag.bindAsEventListener(this));
      Event.observe(this.addTagOkButton, 'click', this.onSubmitAddTag.bindAsEventListener(this));
      Event.observe(this.addTagInputTextField, 'keypress', this.onInputKeyPress.bindAsEventListener(this));

      //wire up the choose from existing functionality
      if (this.chooseFromExistingLink) {
        Event.observe(this.chooseFromExistingLink, 'click', this.onClickExistingLink.bindAsEventListener(this));
        Event.observe(this.existingSpanCloseLink, 'click', this.onClickCloseExistingLink.bindAsEventListener(this));
      }
      if( this.tagSet )
      {
        this.filterExistingTagsFromTagSet();
      }
      // wire up the autocompletion support using the allTags collection provided during the tag rendering
      var autoCompleteElement = $('auto_'+ this.tagIdString);
      if(this.showAutoComplete && this.tagSet )
      {
          var autocompleter = new Autocompleter.Local( this.addTagInputTextField, autoCompleteElement, this.tagSet, { } );
          tagging._autoCompleteSetOnLoad = true;
      }
      else
      {
        Event.observe(this.addTagInputTextField, 'change', this.getTagsOnTheFly.bindAsEventListener(this));
      }
    },

    onInputKeyPress: function(event){
      var keynum;
      var keychar;
      var numcheck;

      if (window.event) // IE
      {
        keynum = event.keyCode;
      }
      else
      if (event.which) // Netscape/Firefox/Opera
      {
        keynum = event.which;
      }

      //if they press enter while in the textbox, we
      //add the tag
      if (keynum == 13) {
        this.onSubmitAddTag();
        //firefox (1.5, at least) needs this or else it
        //submits the form regardless of what you return.
        Event.stop(event);
      }
      return true;
    },

    onClickCloseExistingLink: function(event){
      this.chooseExistingSpan.setStyle({
        display: 'none'
      });
     },

    filterExistingTagsFromTagSet : function( ){
      this.existingTagSet.each(function(tag){
        // remove from the tagSet, do not suggest exisiting tags
        var indexOfTag = this.tagSet.indexOf(tag);
        this.tagSet.splice(indexOfTag, 1);
      }.bind(this));
      this.tagSet.sort();
    },

    onClickExistingLink: function(event){
      var tmpStr = "";
      if (this.allTags && this.allTags.length > 0) {
        this.allTags.sort();

        var findFunc = function( thisTagValue ) {
          return function(tag)
          {
            if (tag.value == thisTagValue) {
              return true;
            }
          };
        };

        for (var c = 0; c < this.allTags.length; c++) {
          var thisTagValue = this.allTags[c];
          var existingTag = this.tags.find( findFunc( thisTagValue ) );

          // get Font-size based on tag weight
          var style = "font-size: 10px";
          if (this.showTagCloud)
          {
            style = this.allTagsFontMap.get(this.allTags[c]);
          }

          if (existingTag )
          {
             if (this.showTagCloud)
             {
               tmpStr += '<a class="tagDisabled ' + style +'">' + this.allTags[c] + '</a>';
             }
             else
             {
               tmpStr += this.allTags[c];
             }
          }
          else //it can be added
          {
            if (this.showTagCloud) {
              tmpStr += '<a href="#" onClick="return false"  class="' + style + '" >' + this.allTags[c] + '</a>';
            }
            else {
              tmpStr += '<a href="#" onClick="return false">' + this.allTags[c] + '</a>';
            }
          }
          if (c < this.allTags.length - 1) {
            tmpStr += ', ';
          }
        }
      }
      this.existingSpan.innerHTML = tmpStr;
      var linkChildren = bbcommon.filterOutNonElements(this.existingSpan.childNodes);
      linkChildren.each(function(linkElement){
        Event.observe(linkElement, 'click', this.onClickExistingTag.bindAsEventListener(this));
      }
      .bind(this));


      var leftOffset = 0;
      if ( page.util.isRTL() )
      {
        var spanWidth = this.chooseExistingSpan.getWidth();
        var linkWidth = this.chooseFromExistingLink.getWidth();
        leftOffset = ( spanWidth < linkWidth ) ? spanWidth - linkWidth : linkWidth - spanWidth;
      }
      this.chooseExistingSpan.clonePosition( this.chooseFromExistingLink,
      {
          setWidth : false,
          setHeight : false,
          offsetLeft : leftOffset
      } );
      this.chooseExistingSpan.setStyle({
        display : 'block',
        'z-index' : 1000
      });
      this.chooseExistingSpan.down('a').focus();
    },

    onClickExistingTag: function(event){
      // Hide the "context menu"
      this.chooseExistingSpan.setStyle({
        display: 'none'
      });
      // get the item that originated the event (i.e. the tag link)
      var link = Event.element(event);
      // put the tag name into the text field
      this.addTagInputTextField.value = link.childNodes[0].nodeValue;
      // call submit tag
      this.onSubmitAddTag(event);
    },

    formatTag: function(tagValue){
      if (this.normalizeTagValue) {
        var newTagValue = '';
        var words = tagValue.split(' '); // separate the tag into its component words
        for (var i = 0; i < words.length; i++) {
          var word = words[i];

          // multiple spaces in between words will come through as empty words... ignore them
          if (word.length !== 0) {
            // need to add space back in between words
            if (i > 0) {
              newTagValue += " ";
            }

            // uppercase the first letter of the word and lowercase all other letters
            newTagValue += word.substring(0, 1).toUpperCase() +
            word.substring(1, word.length).toLowerCase();
          }
        }
        return newTagValue;
      }
      else {
        return tagValue;
      }
    },

    getTagsOnTheFly : function() {
      // make a call to the callback method, assuming it is an ajax get request
      // Note: Instead of call back methods we choose to add request urls, the following api can come handy
      // new Ajax.Autocompleter(id_of_text_field, id_of_div_to_populate, url, options);
         if( this.getMatchingTagsCallback )
         {
          var tagValue = this.addTagInputTextField.value;
          if (this.validateInputTagValue(tagValue))
          {
             this.tagSet = this.getMatchingTagsCallback( this.formatTag(tagValue));
          }
        }
       // set-up AutoCompleter if there are suggestions available
        var autoCompleteElement = $('auto_'+ this.tagIdString);
        if (this.tagSet ) {
          var autocompleter = new Autocompleter.Local(this.addTagInputTextField, autoCompleteElement, this.tagSet, {  } );
          // needed for IE7 (doesn't hurt the other browsers )
          $(autocompleter.update);
        }
    },

    onClickAddTag: function(event){
      this.addTagButton.style.display = 'none';
      this.addTagInputElements.style.display = 'inline';
      if (this.chooseFromExistingLink && this.allTags && this.allTags.length > 0) {
        this.chooseFromExistingLink.style.display = 'inline';
      }
      this.addTagInputTextField.value = '';
      this.addTagInputTextField.focus(); // focus on the text box now that we've shown it
    },

    validateInputTagValue : function(tagValue) {
      var validTag = true;

      if ( !tagValue ) {
        validTag = false;
      }
      else {
        // trim whitespace from the beginning and end of the string
        tagValue = tagValue.replace(/^\s*|\s*$/g, "");
        if (tagValue.length === 0) {
          validTag = false;
        }
        else
          if (tagValue.length == 256) {
            alert(page.bundle.getString('validation.maximum_length.no_name.singular', '255'));
            return;
          }
          else
            if (tagValue.length > 255) {
              alert(page.bundle.getString('validation.maximum_length.no_name.plural','255', tagValue.length - 255));
              return;
            }
      }
     return validTag;
    },

    onSubmitAddTag: function(event){
      this.addTagButton.style.display = 'inline';
      this.addTagInputElements.style.display = 'none';
      if (this.chooseFromExistingLink || this.existingSpan) {
        this.chooseFromExistingLink.style.display = 'none';
        this.chooseExistingSpan.setStyle({
          display: 'none'
        });
      }
      // add multiple tags with comma separated values
      var tagValue = this.addTagInputTextField.value.split(",");
      var tagId = this.addTagInputTextField.getAttribute('bb_tag_id');

      if (tagValue && tagValue.length > 0)
      {
       for (var i = 0; i < tagValue.length; i++) {
        if (this.validateInputTagValue(tagValue[i])) {
          // format the tag according to tag rules and then add it
          var tagData = this.formatTag(tagValue[i]);
          this.addTag(tagData, tagId, this);
          var indexOfTag = this.tagSet.indexOf( tagData );
          this.tagSet.splice( indexOfTag, 1 );
        }
       }
      }
      return false;
    },

    addTag: function(tagValue,tagId, objTags){
      var showViewLink = false;
      tagValue = tagValue.trim();
      var existingTag = this.tags.find(function(tag){
        if (tag.value == tagValue) {
          return true;
        }
      });

      if (existingTag ) {
        alert( objTags.messageStrings.addTagSpecificPostAlreadyTaggedMsg );
        return false;
      }
      if( this.addCallback )
      {
       showViewLink = true;
       this.addCallback(tagValue);
      }

      //construct the DOM for the tag
      var tagElement = document.createElement('span');
      Element.addClassName(tagElement, 'tag');
      var tagValueElement;
      if (this.viewLink != '' && showViewLink) {
        tagValueElement = document.createElement('a');
       if(this.viewLink.indexOf('TagValue') >= 0)
       {
         tagValueElement.setAttribute('href', this.viewLink.replace(/@X@TagValue@X@/, tagValue));
       }
       if(this.viewLink.indexOf('TagId') >= 0)
       {
         tagValueElement.setAttribute('href', this.viewLink.replace(/@X@TagId@X@/, tagId));
       }
      }
      else {
        tagValueElement = document.createElement('span');
        if ( page.util.isRTL() ) {
          tagValueElement.dir = "rtl";
        }
      }
      var tagValueTextNode = document.createTextNode(tagValue);
      tagValueElement.appendChild(tagValueTextNode);
      tagElement.appendChild(tagValueElement);


      tagElement.appendChild(document.createTextNode(' '));
      var tagRemoveElement = document.createElement('span');
      tagRemoveElement.innerHTML = this.removeText;
      tagElement.appendChild(tagRemoveElement);

      if (this.tags.length === 0) {
        this.tagsContainer.replaceChild(tagElement, this.tagsContainer.childNodes[0]);
      }
      else {
        this.tagsContainer.appendChild(tagElement);
      }

      this.tags.push(new tagging.Tag(tagElement, this ));
      // update the form field
      if (this.field ) {
        this.hiddenFieldValue = this.field.value;
        if (this.hiddenFieldName && this.hiddenFieldValue ) {
          var token = tagging._tagSeparator + tagValue + tagging._tagSeparator;
          this.hiddenFieldValue += token;
          // set the hiddenFieldValue to the hiddenFieldName
          this.field.value = this.hiddenFieldValue;
        }
      }

      return true;
    }

  }),

 /**
 * Used by the tagging behaviour.  Represents a single tag.
 */
  Tag: Class.create({

    initialize: function(tagElement, parent){
      this.tag = tagElement;
      this.parent = parent;
      this.removeCallback = parent.removeCallback;
      this.removeMsg = parent.removeMsg;
      this.tagIdString = parent.tagIdString;
      this.hiddenFieldName = parent.hiddenFieldName;
      this.field =$('id_' + this.tagIdString + "_" + this.hiddenFieldName);
      var childrenElements = bbcommon.filterOutNonElements(tagElement.childNodes);
      if (childrenElements &&  childrenElements[0]  ) {
        this.value = childrenElements[0].innerHTML;

        var removeElement = childrenElements[1];
        if (removeElement )
        {
          Event.observe(removeElement, 'click', this.onRemove.bindAsEventListener(this));
        }
      }
    },

    onRemove: function(event)
    {
      if (this.removeMsg && !confirm(this.removeMsg))
      {
        return false;
      }
      if (this.removeCallback )
      {
        if ( this.removeCallback(this.value) === false )
        {
          return false;
        }
      }
      if (this.parent.chooseFromExistingLink && this.parent.existingSpan) //ensure the elements exist
      {
        //if we're showing the "existing" tags, hide that div
        //and go back to the "choose from existing" button.
        //
        //in a perfect world, we'd actually be just re-linking
        //the appropriate "existing" tag in that div.  for now,
        //this is all that's easy/feasible to do.
        if (this.parent.existingSpan.style.display == 'inline') {
          this.parent.existingSpan.style.display = 'none';
          this.parent.chooseFromExistingLink.style.display = 'inline';
        }
      }

      var tagIndex = 0;
      for (var i = 0; i < this.parent.tags.length; i++) {
        if (this.parent.tags[i] == this) {
          tagIndex = i;
          break;
        }
      }
      this.parent.tags.splice(tagIndex, 1);
      Element.remove(this.tag);
      // add to the parent.tagSet for suggestion
       this.parent.tagSet.push(this.value);
       this.parent.tagSet.sort();

      if (this.parent.tags.length === 0) {
        this.parent.tagsContainer.innerHTML = this.parent.noneText;
      }
      // update the form fields
      if ( this.field ) {
        this.hiddenFieldValue = this.field.value;

        if (this.hiddenFieldName && this.hiddenFieldValue) {
          this.value = this.value.replace(/\&gt;/g,'>').replace(/\&lt;/g,'<').replace(/\&amp;/g,'&');
          var token = tagging._tagSeparator + this.value + tagging._tagSeparator;
          this.hiddenFieldValue = this.hiddenFieldValue.replace(token, tagging._tagSeparator);
          // set the hiddenFieldValue to the hiddenFieldName
          this.field.value = this.hiddenFieldValue;
        }
      }
    }
  }),

  /* Static properties/methods */
   _autoCompleteSetOnLoad : false,
   _tagSeparator: "|"
};
