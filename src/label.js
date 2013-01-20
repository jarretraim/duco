
draw2d.shape.basic.WrappingLabel= draw2d.shape.basic.Label.extend({

    NAME : "draw2d.shape.basic.WrappingLabel",

    /**
     * @method
     * Trigger the repaint of the element and transport all style properties to the visual representation.<br>
     * Called by the framework.
     * 
     * @template
     **/
    repaint: function(attributes) {

      if (this.text && this.getParent()) {
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

      this._super(attributes);
    },

    visualSize: function(text) {
      var ruler = $('<span id="ruler" style="visibility: hidden; white-space: nowrap"></span>');
      $('body').append(ruler);
      ruler.text(text);

      return {
        'width': ruler.width(),
        'height': ruler.height()
      }
    }
});

