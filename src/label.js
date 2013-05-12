
draw2d.shape.basic.WrappingLabel= draw2d.shape.basic.Label.extend({

    NAME : "draw2d.shape.basic.WrappingLabel",

    init : function(text)
    {
      this._super(text);
      this.setCssClass("shape-label");
      this.setFontColor("#545454");
      this.setStroke(0);
      
      this.ruler = $('#ruler');
      if (this.ruler.length != 1) {
        this.ruler = $('<span id="ruler" style="visibility: hidden; white-space: nowrap"></span>');
        $('body').append(this.ruler);
      }
    },

    /**
     *  Overrided doubleclick. The default behavior of a label is to pop some 
     *  kind of editor on double click. This passes the event to the parent object
     *  so that the properties windows will fire correctly.
     *
     */
    onDoubleClick: function() {
        this.parent.onDoubleClick();
    },


    /**
     * @method
     * Trigger the repaint of the element and transport all style properties to the visual representation.<br>
     * Called by the framework.
     * 
     * @template
     **/
    repaint: function(attributes) {

      if (this.text && this.getParent()) {
        this.text = this.text.replace(/(\r\n|\n|\r)/gm,"");

        var PADDING = 10;
        var textWidth = this.visualSize(this.text).width;

        if (textWidth + (PADDING * 2) > this.getParent().getWidth()) {
          var words = this.getText().split(" ");
          var line = [];
          var lineLength = 0;

          for(var i = 0; i < words.length; i++) {
            var wordWidth = this.visualSize(words[i]).width;

            if ((wordWidth + (PADDING*2) + lineLength) > this.getParent().getWidth()) {
              line.push('\n');
              lineLength = 0;
            }

            lineLength += wordWidth;
            line.push(words[i] + " ");
          }

          this.text = line.join("").trim();
        }
      }

      this.width = this.getMinWidth();
      this.height = this.getMinHeight();

      this._super(attributes);
    },

    visualSize: function(text) {
      this.ruler.text(text);

      return {
        'width': this.ruler.width(),
        'height': this.ruler.height()
      }
    }
});

