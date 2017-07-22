var bbcommon = {};

var ELEMENT_TYPE = 1;

/**
 * Helper function that filters an array of nodes so that it only contains
 * nodes of type 1 (ELEMENT)
 * Returns an array of nodes of ELEMENT type
 */
bbcommon.filterOutNonElements = function ( nodeArray )
{
  var result = [];

  for ( var i = 0; i < nodeArray.length; i++ )
  {
    var node = nodeArray[i];
    if (node.nodeType == ELEMENT_TYPE)
    {
      result.push( node );
    }
  }

  return result;
};

/**
 * Toggle Behaviour
 *
 * The toggle behaviour will toggle an element between two values and invoke a
 * callback with the signature "callback( toggleValue )" to indicate when the
 * value has changed.
 *
 * The entity passed in must be of the following form:
 *
 * <span><span>Current Value</span><span style="display:none">On text</span><span style="display:none">Off text</span>
 *
 */
bbcommon.Toggle = Class.create();

bbcommon.Toggle.prototype =
{
  initialize: function( entity, callback )
  {
    this.entity = entity;
    this.callback = callback;
    var childrenElements = bbcommon.filterOutNonElements( entity.childNodes );
    this.current = childrenElements[0];
    this.on_text = childrenElements[1].innerHTML;
    this.off_text = childrenElements[2].innerHTML;
    Event.observe( entity, 'click', this.onToggle.bindAsEventListener( this ) );
  },

  onToggle: function( event )
  {
    // first callback and if ok toggle UI
    if ( this.isOn() )
    {
      this.callback( false );
      this.current.innerHTML = this.off_text;
    }
    else
    {
      this.callback( true );
      this.current.innerHTML = this.on_text;
    }
  },

  isOn: function()
  {
    return ( this.current.innerHTML == this.on_text );
  }
};


/**
 * Ordering Behaviour
 *
 * This behaviour manages the re-ordering of elements on a page with drop-down boxes.  When an
 * item is moved the callback will be invoked (signature: callback( newIndex )
 *
 * The entity object that is passed in (e.g. in surveys, survey.Question) must have a
 * property called "orderer" that is a reference to the <select> DOM element, as well
 * as a property called "element" that is a reference to the object as a whole (e.g a
 * container div, or a table row)
 *
 * You must also pass in an ordered array of entity objects as well as the DOM element that
 * is the direct parent of the ordered elements.  These are used to reorder the elements.
 */
bbcommon.OrderedEntity = Class.create();

bbcommon.OrderedEntity.prototype =
{
  initialize: function( entity, entityArray, entityContainer, callback )
  {
     this.entity = entity;
     this.entityArray = entityArray;
     this.entityContainer = entityContainer;
     this.callback = callback;
     Event.observe( entity.orderer, 'change', this.onOrder.bindAsEventListener( this ) );
  },

  onOrder: function( event )
  {
     this.callback( this.entity.orderer.selectedIndex );

     //Get the old and new index
     var newIndex = this.entity.orderer.selectedIndex;
     var oldIndex = 0;
     for ( var i = 0; i < this.entityArray.length; i++ )
     {
       if (this.entityArray[i] == this.entity)
       {
         oldIndex = i;
         break;
       }
     }

     var entityAtNewIndex = this.entityArray[newIndex];

     //Re-order the array and elements
     if ( newIndex > oldIndex )
     {
       this.entityArray.splice( newIndex+1, 0, this.entity );
       this.entityArray.splice( oldIndex, 1 );
       Element.remove( this.entity.element );
       this.entityContainer.insertBefore( this.entity.element, entityAtNewIndex.element.nextSibling );
     }
     else
     {
       this.entityArray.splice( newIndex, 0, this.entity );
       this.entityArray.splice( oldIndex + 1, 1 );
       Element.remove( this.entity.element );
       this.entityContainer.insertBefore( this.entity.element, entityAtNewIndex.element );
     }

     this.resetOrderers();
  },

  //Resets the <select> options
  resetOrderers: function()
  {
   var orderers = this.entityArray.pluck( 'orderer' ),
       i, j, orderer;

   for ( i = 0; i < orderers.length; i++)
   {
       orderer = orderers[i];
       for ( j = 0; j < orderer.options.length; j++)
       {
           orderer.options[j] = null;
       }
       orderer.options.length = 0;
     }

   for ( i = 0; i < orderers.length; i++ )
   {
     orderer = orderers[i];
     for ( j = 0; j < orderers.length; j++ )
     {
       orderer.options[j] = new Option( j+1,j+1 );
       if ( i == j )
       {
         orderer.options[j].selected = true;
       }
     }
   }
  }
};
