// Create namespace
var g = {};

g.Application = Class.extend({
  NAME: "draw2d.Application",

  /**
   * @constructor
   *
   * @param {String} canvasId the id of the DOM element to use as paint container
   */
  init: function() {
    this.properties = new g.Properties(this);
    this.view = new g.View("canvas", this.properties);      
  },

  undo: function() {
    this.view.getCommandStack().undo();
  },

  redo: function() {
    this.view.getCommandStack().redo();
  },

  zoom: function(x, y, zoomFactor) {
    this.view.setZoom(this.view.getZoom() * zoomFactor);
  },

  zoomReset: function() {
    this.view.setZoom(1.0);
  },

  toggleSnapToGrid: function() {    
  },

  getJson: function() {
    var writer = new draw2d.io.json.Writer();
    return JSON.stringify(writer.marshal(this.view), null, 2);
  },

  showProperties: function(shapeData, modal) {
    this.properties.showPropertyEditModal(shapeData, modal);
  },

  saveProperties: function(shapeId, properties) {    
        var shape = this.view.getFigure(shapeId);
        var namePropertyTemplate = this.properties.byPropertyName('Name');

        var namePropertyValue = _.find(properties, function(property) {
            if (property.id == namePropertyTemplate.id) {
                shape.setLabelText(property.value);
            }
        });

    shape.properties = properties;
  },

  reportError: function(data, description) {
    console.log('ERROR: ' + description + ' -> ' + JSON.stringify(data));
    },

    load: function(diagramJson) {
        var reader = new draw2d.io.json.Reader();
        reader.unmarshal(this.view, diagramJson);
    },

    save:function (diagramId) {
        var json = this.getJson();
        var uri = '/diagrams/' + DIAGRAM_ID;

        $.ajax({
            type: "PUT",
            url: uri,
            data: json,
            contentType: "application/json"
        }).done(function(msg) {
           console.log('Saved');
        });
  }
});

g.View = draw2d.Canvas.extend({

  init: function(id, properties) {
    this._super(id);
    this.setScrollArea("#" + id);
    this.currentDropConnection = null;
    this.installEditPolicy(new draw2d.policy.canvas.SnapToGeometryEditPolicy());
    this.snapToGrid = true;
    this.properties = properties;
    this.shapes = [];

    draw2d.Connection.createConnection = function(sourcePort, targetPort) {
      var conn = new draw2d.Connection();
      conn.setSourceDecorator(new draw2d.decoration.connection.AppModelArrowDecorator());
      conn.setTargetDecorator(new draw2d.decoration.connection.AppModelArrowDecorator());
      return conn;
    }
  },

  /**
   * @method
   * Called if the DragDrop object is moving around.<br>
   * <br>
   * draw2d use the jQuery draggable/droppable lib. Please inspect
   * http://jqueryui.com/demos/droppable/ for further information.
   *
     * @param {HTMLElement} droppedDomNode The dragged DOM element.
   * @param {Number} x the x coordinate of the drag
   * @param {Number} y the y coordinate of the drag
   *
   * @template
   **/
    onDrag:function (droppedDomNode, x, y) {
    },

    getShape: function(shapeId) {
      var shape = _.find(this.shapes, function(shape) {
        if (shape.id == shapeId) {
          return shape;
        }
      });

      return shape;
    },

  /**
   * @method
   * Called if the user drop the droppedDomNode onto the canvas.<br>
   * <br>
   * draw2d use the jQuery draggable/droppable lib. Please inspect
   * http://jqueryui.com/demos/droppable/ for further information.
   *
   * @param {HTMLElement} droppedDomNode The dropped DOM element.
   * @param {Number} x the x coordinate of the drop
   * @param {Number} y the y coordinate of the drop
   * @private
   **/
  onDrop: function(droppedDomNode, x, y) {
    var type = $(droppedDomNode).data("shape");
    var figure = eval("new " + type + "();");
    figure.setProperties(this.properties);
    this.shapes.push(figure);

    // create a command for the undo/redo support
    var center = figure.getCenter();
    var command = new draw2d.command.CommandAdd(this, figure, x - center.getX(), y - center.getY());
    this.getCommandStack().execute(command);
  }
});

g.Shapes = {};
g.Shapes.Common = {};

g.Shapes.Common.onDoubleClick = function() {
  $('body').trigger('g.showProperties', this.getPersistentAttributes());
};

g.Shapes.Common.setProperties = function(defaultProperties) {
  var propertyTemplates = defaultProperties.byShapeName(this.getShapeName());
  var properties = [];

  _.each(propertyTemplates, function(property) {
    var prop = {};
    prop['id'] = property.id;
    prop['value'] = property.default_value;
    properties.push(prop);
  });

  this.properties = properties;
}

g.Shapes.Common.getPersistentAttributes = function() {
  var s = this._super();
  s["properties"] = this.properties;
  return s;
}

g.Shapes.Common.setPersistentAttributes = function(attributes) {
    this._super(attributes);

    var label =  _.find(attributes.properties, function(property) {
            if (property.id == g.Properties.NameProperty.id) {
                return property;
            }
        });

    this.setLabelText(label.value);
    this.properties = attributes.properties;
}

g.Shapes.Common.setLabelText = function(text) {
    this.label.setText(text);
}

g.Shapes.Process = draw2d.shape.basic.Circle.extend({
  NAME: "g.Shapes.Process",

  init: function(width, height) {
    this._super();
    this.setDimension(100, 100);    
    this.setCssClass("process");

    // Label
    this.label = new draw2d.shape.basic.WrappingLabel("New Process");
    this.addFigure(this.label, new draw2d.layout.locator.CenterLocator(this));

    this.createPort("hybrid", new draw2d.layout.locator.TopLocator(this));
    this.createPort("hybrid", new draw2d.layout.locator.RightLocator(this));
    this.createPort("hybrid", new draw2d.layout.locator.LeftLocator(this));
    this.createPort("hybrid", new draw2d.layout.locator.BottomLocator(this));
  },

  getShapeName: function() {
    return "process";
  },

  onDoubleClick: g.Shapes.Common.onDoubleClick,
  setProperties: g.Shapes.Common.setProperties,
  setLabelText: g.Shapes.Common.setLabelText,
  setPersistentAttributes: g.Shapes.Common.setPersistentAttributes,
  getPersistentAttributes: g.Shapes.Common.getPersistentAttributes  
});

g.Shapes.ComplexProcess = draw2d.shape.basic.Circle.extend({
  NAME: "g.Shapes.ComplexProcess",

  init: function(width, height) { 
    this._super();
    this.setDimension(100, 100);
    this.setCssClass("complex-process");

    // Other circle
    this.inner = new draw2d.shape.basic.Circle();
    this.inner.setDimension(90,90);
    this.inner.setCssClass("complex-process");
    this.addFigure(this.inner, new draw2d.layout.locator.PaddedTopLeftLocator(this));

    // Label
    this.label = new draw2d.shape.basic.WrappingLabel("New Process");    
    this.addFigure(this.label, new draw2d.layout.locator.CenterLocator(this));

    this.createPort("hybrid", new draw2d.layout.locator.TopLocator(this));
    this.createPort("hybrid", new draw2d.layout.locator.RightLocator(this));
    this.createPort("hybrid", new draw2d.layout.locator.LeftLocator(this));
    this.createPort("hybrid", new draw2d.layout.locator.BottomLocator(this));
  },

  getShapeName: function() {
    return "complex-process";
  },

  onDoubleClick: g.Shapes.Common.onDoubleClick,
  setProperties: g.Shapes.Common.setProperties,
  setLabelText: g.Shapes.Common.setLabelText,
  setPersistentAttributes: g.Shapes.Common.setPersistentAttributes,
  getPersistentAttributes: g.Shapes.Common.getPersistentAttributes
});

g.Shapes.DataStore = draw2d.shape.icon.Db.extend({
  NAME : "g.Shapes.DataStore",

  init: function(width, height) {    
    this._super();    
    this.setDimension(100, 85);
    this.setCssClass("data-store");

    // This shouldn't be necessary, but setting the CSS class doesn't propagate
    // and I can't figure out why.
    //this.setBackgroundColor("#DDF4FB");
    //this.setColor("#339BB9");

    // Label
    this.label = new draw2d.shape.basic.WrappingLabel("New Data Store");
    this.addFigure(this.label, new draw2d.layout.locator.CenterLocator(this));

    this.createPort("hybrid", new draw2d.layout.locator.TopLocator(this));
    this.createPort("hybrid", new draw2d.layout.locator.RightLocator(this));
    this.createPort("hybrid", new draw2d.layout.locator.LeftLocator(this));
    this.createPort("hybrid", new draw2d.layout.locator.BottomLocator(this));
  },

  getShapeName: function() {
    return "data-store";
  },

  onDoubleClick: g.Shapes.Common.onDoubleClick,
  setProperties: g.Shapes.Common.setProperties,
  setLabelText: g.Shapes.Common.setLabelText,
  setPersistentAttributes: g.Shapes.Common.setPersistentAttributes,
  getPersistentAttributes: g.Shapes.Common.getPersistentAttributes
});

g.Shapes.Interactor = draw2d.shape.basic.Rectangle.extend({
  NAME: "g.Shapes.Interactor",

  init: function(width, height) {   
    this._super();
    this.setDimension(100, 75);
    this.setCssClass("interactor");

    // Label
    this.label = new draw2d.shape.basic.WrappingLabel("New External Interactor");
    this.addFigure(this.label, new draw2d.layout.locator.CenterLocator(this));        

    this.createPort("hybrid", new draw2d.layout.locator.TopLocator(this));
    this.createPort("hybrid", new draw2d.layout.locator.RightLocator(this));
    this.createPort("hybrid", new draw2d.layout.locator.LeftLocator(this));
    this.createPort("hybrid", new draw2d.layout.locator.BottomLocator(this));
  },

  getShapeName: function() {
    return "interactor";
  },    

  onDoubleClick: g.Shapes.Common.onDoubleClick,
  setProperties: g.Shapes.Common.setProperties,
  setLabelText: g.Shapes.Common.setLabelText,
  setPersistentAttributes: g.Shapes.Common.setPersistentAttributes,
  getPersistentAttributes: g.Shapes.Common.getPersistentAttributes,

  isStrechable:function()
  {
    return false;
  }  
});

g.Properties = Class.extend({

  init: function(app) {
    this.app = app;

    $.ajax({
      type: 'GET',
      url: '/properties.json',
      dataType: 'json',
      context: this,
            success:function (data) {
                this.properties = data;
            },
      error: app.reportError,
      data: {},
      async: false
    });

    $.ajax({
      type: 'GET',
      url: '/shapes.json',
      dataType: 'json',
      context: this,
            success:function (data) {
                this.shapes = data;
            },
      error: app.reportError,
      data: {},
      async: false
    });
  },

  byId: function(id) {
        return _.find(this.properties, function (p) {
      if (p.id == id) {
        return p;
      }
    });
  },

    byPropertyName:function(propertyName) {
        return _.find(this.properties, function(property) {
            if (property.name == propertyName) {
                return property;
            }
        });
    },

  byShapeName: function(shapeName) {
    var shape = _.find(this.shapes, function(shape) {
      if (shape.slug == shapeName) {
        return shape;
      }
    });

        return _.filter(this.properties, function (property) {
            if (property.shape_id == shape.id || property.shape_id == null) {
        return property;
      }
    });
  },

  showPropertyEditModal: function(shapeData, modal) {
    var body = modal.find("#properties_form");
    body.empty();

    body.append('<input name="shapeId" type="hidden" value="' + shapeData.id + '" />');

    _.each(shapeData.properties, function(property) {
      var propertyTemplate = this.byId(property.id);
      var markup = this.renderTemplate(propertyTemplate, property);
      body.append(markup);
    }, this);

    modal.modal('show');
  },

  renderTemplate: function(propertyTemplate, property) {
    var template = null;
        switch (propertyTemplate.property_type.name) {
      case 'String':
        template = $('#text-field').html();
        break;
      case 'Integer':
        template = $('#integer-field').html();
        break;
      case 'Boolean':
        template = $('#bool-field').html();
        break;
      case 'List':
        template = $('#list-field').html();
        break;
      default:
        console.log('Unknown property template "' + propertyTemplate.property_type.name + '", using text.')
        template = $('#text-field').html();
    }

    var merged = $.extend(propertyTemplate, { "value": property.value } );

    return Mustache.to_html(template, merged);
  }
});


$().ready(function() {
  document.ontouchmove = function(e) {
    e.preventDefault();
  };

  $('.tooltip').tooltip();

  var app = new g.Application();

  $('#cmd_undo').click(function(ev) {
    app.undo();
  });

  $('#cmd_redo').click(function(ev) {
    app.redo();
  });

  $('#cmd_zoom_in').click(function(ev) {
    app.zoom(ev.clientX, ev.clientY, .9);
  });

  $('#cmd_zoom_out').click(function(ev) {
    app.zoom(ev.clientX, ev.clientY, 1.1);
  });

  $('#cmd_zoom_reset').click(function(ev) {
    app.zoomReset();
  });

  $('#cmd_snap_to_grid').click(function(ev) {
    app.toggleSnapToGrid();
  });

  $('#cmd_download_json').click(function(ev) {
    $('#json').val(app.getJson());
    $('#json_modal').modal('show');
  });

  $('body').on("g.showProperties", function(event, objectData) {
    var modal = $('#properties_modal');
    app.showProperties(objectData, modal);    
  });

  $('#properties_submit_button').click(function() {
    $('#properties_form').submit();
  });

  $('#properties_form').submit(function() {
    var shapeId = this.shapeId.value;
    var inputs = $(this).find('input');
    var selects = $(this).find('select');

    var props = _.union(inputs.toArray(), selects.toArray());    
    var properties = [];
    
    _.each(props, function(input) {
      if (input.name == "shapeId") {
        return;
      }

      var value = input.value;
      if (input.type == "checkbox") {
        value = $(input).prop('checked');
      }

      var x = {
        "id": input.id,
        "value": value
      };

      properties.push(x);
    });

    app.saveProperties(shapeId, properties);
    return false;
  });
});