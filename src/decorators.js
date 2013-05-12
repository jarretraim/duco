
draw2d.decoration.connection.AppModelArrowDecorator = draw2d.decoration.connection.Decorator.extend({

    NAME : "draw2d.decoration.connection.AppModelArrowDecorator",

    /**
     * @constructor 
     * 
     * @param {Number} [width] the width of the arrow
     * @param {Number} [height] the height of the arrow
     */
    init : function(width, height)
    {           
        this._super( width, height);        
        this.setBackgroundColor("#333333");
        this.setColor("#333333");
        this.setDimension(10, 10);
    },

    /**
     * Draw a filled arrow decoration.
     * It's not your work to rotate the arrow. The draw2d do this job for you.
     * 
     * <pre>
     *                        ---+ [length , width/2]
     *                 -------   |
     * [3,0]   --------          |
     *     +---                  |==========================
     *         --------          |
     *                 -------   |
     *                        ---+ [length ,-width/2]
     * 
     *</pre>
     * @param {Raphael} paper the raphael paper object for the paint operation 
     **/
    paint:function(paper)
    {
        var st = paper.set();
        
        st.push(paper.path(["M0 0" ,
                            "L", this.width, " ", -this.height/2,
                            "L", this.width, " ",  this.height/2, 
                            "L0 0"].join("")));
        
        st.attr({fill:this.backgroundColor.hash(),stroke:this.color.hash()});

        return st;
    }
});

