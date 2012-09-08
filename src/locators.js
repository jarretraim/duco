

/**
 * Fixed top locator so that it renders in the middle of the obejct.
 */
graphiti.layout.locator.TopLocator = graphiti.layout.locator.Locator.extend({
  NAME : "graphiti.layout.locator.TopLocator",

  /**
     * @constructor
     * Constructs a ManhattanMidpointLocator with associated Connection c.
     * 
     * @param {graphiti.Figure} parent the parent associated with the locator
     */
    init: function(parent)
    {
      this._super(parent);
    },
    
    
    /**
     * @method
     * Relocates the given Figure.
     *
     * @param {Number} index child index of the target
     * @param {graphiti.Figure} target The figure to relocate
     **/
    relocate:function(index, target)
    {
       var parent = this.getParent();
       var boundingBox = parent.getBoundingBox();
    
       var targetBoundingBox = target.getBoundingBox();
       target.setPosition(boundingBox.w / 2, -(targetBoundingBox.h+2));

       console.log("TOP Position: " + target.x + ", " + target.y);
    }

});


/**
 * @class graphiti.layout.locator.BottomLocator
 * 
 * A TopLocator  is used to place figures at the top/center of a parent shape.
 *
 * @author Andreas Herz
 * @extend graphiti.layout.locator.Locator
 */
graphiti.layout.locator.BottomLocator= graphiti.layout.locator.Locator.extend({
    NAME : "graphiti.layout.locator.BottomLocator",
    
    /**
     * @constructor
     * Constructs a ManhattanMidpointLocator with associated Connection c.
     * 
     * @param {graphiti.Figure} parent the parent associated with the locator
     */
    init: function(parent)
    {
      this._super(parent);
    },
    
    
    /**
     * @method
     * Relocates the given Figure.
     *
     * @param {Number} index child index of the target
     * @param {graphiti.Figure} target The figure to relocate
     **/
    relocate:function(index, target)
    {
       var parent = this.getParent();
       var boundingBox = parent.getBoundingBox();
    
       var targetBoundingBox = target.getBoundingBox();
       target.setPosition(boundingBox.w/2, 2 + boundingBox.h + targetBoundingBox.h);

       console.log("BOTTOM Position: " + target.x + ", " + target.y);
    }
});


/**
 * @class graphiti.layout.locator.LeftLocator
 * 
 * A LeftLocator is used to place figures to the left of a parent shape.
 *
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *
 *     // create a basic figure and add a Label/child via API call
 *     //
 *     var start = new graphiti.shape.node.Start();
 *     start.addFigure(new graphiti.shape.basic.Label("Left Label"), new graphiti.layout.locator.LeftLocator(start)); 
 *     canvas.addFigure( start, 100,50);
 *
 *     
 * @author Andreas Herz
 * @extend graphiti.layout.locator.Locator
 */
graphiti.layout.locator.LeftLocator = graphiti.layout.locator.Locator.extend({
    NAME : "graphiti.layout.locator.LeftLocator",
    
    /**
     * @constructor
     * Constructs a locator with associated parent.
     * 
     * @param {graphiti.Figure} parent the parent associated with the locator
     */
    init: function(parent)
    {
      this._super(parent);
    },
    
    
    /**
     * @method
     * Relocates the given Figure.
     *
     * @param {Number} index child index of the target
     * @param {graphiti.Figure} target The figure to relocate
     **/
    relocate:function(index, target)
    {
       var parent = this.getParent();
       var boundingBox = parent.getBoundingBox();

       var targetBoundingBox = target.getBoundingBox();
       target.setPosition(-targetBoundingBox.w-2, boundingBox.h/2);

       console.log("LEFT Position: " + target.x + ", " + target.y);
    }
});


/**
 * @class graphiti.layout.locator.RightLocator
 * 
 * A RightLocator is used to place figures to the right of a parent shape.
 *
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *
 *     // create a basic figure and add a Label/child via API call
 *     //
 *     var end = new graphiti.shape.node.End();
 *     end.addFigure(new graphiti.shape.basic.Label("Right Label"), new graphiti.layout.locator.RightLocator(end)); 
 *     canvas.addFigure( end, 50,50);
 *
 *     
 * @author Andreas Herz
 * @extend graphiti.layout.locator.Locator
 */
graphiti.layout.locator.RightLocator = graphiti.layout.locator.Locator.extend({
    NAME : "graphiti.layout.locator.RightLocator",
    
    /**
     * @constructor
     * Constructs a locator with associated parent.
     * 
     * @param {graphiti.Figure} parent the parent associated with the locator
     */
    init: function(parent)
    {
      this._super(parent);
    },
    
    
    /**
     * @method
     * Relocates the given Figure.
     *
     * @param {Number} index child index of the target
     * @param {graphiti.Figure} target The figure to relocate
     **/
    relocate:function(index, target)
    {
       var parent = this.getParent();
       var boundingBox = parent.getBoundingBox();
       var topRight = boundingBox.getTopRight();
       
       var targetBoundingBox = target.getBoundingBox();
       target.setPosition(boundingBox.w + 12, boundingBox.h/2);

       console.log("RIGHT Position: " + target.x + ", " + target.y);
    }
});
