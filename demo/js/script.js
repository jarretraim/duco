// Create namespace
var g = {};

g.Application = Class.extend({
  NAME: "graphiti.Application",

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
    this.view.setSnapToGrid(!this.view.getSnapToGrid());
  },

  getJson: function() {
    var writer = new graphiti.io.json.Writer();
    return JSON.stringify(writer.marshal(this.view), null, 2);
  },

  showProperties: function(shapeData, modal) {
    this.properties.showPropertyEditModal(shapeData, modal);
  },

  saveProperties: function(shapeId, properties) {    
    var shape = this.view.getShape(shapeId);
    shape.properties = properties;
  },

  reportError: function(data, description) {
    console.log('ERROR: ' + description + ' -> ' + JSON.stringify(data));
  }
});

g.View = graphiti.Canvas.extend({

  init: function(id, properties) {
    this._super(id);
    this.setScrollArea("#" + id);
    this.currentDropConnection = null;
    this.setSnapToGrid(true);
    this.properties = properties;
    this.shapes = [];
  },

  /**
   * @method
   * Called if the DragDrop object is moving around.<br>
   * <br>
   * Graphiti use the jQuery draggable/droppable lib. Please inspect
   * http://jqueryui.com/demos/droppable/ for further information.
   *
   * @param {HTMLElement} droppedDomNode The dragged DOM element.
   * @param {Number} x the x coordinate of the drag
   * @param {Number} y the y coordinate of the drag
   *
   * @template
   **/
  onDrag: function(droppedDomNode, x, y) {},

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
   * Graphiti use the jQuery draggable/droppable lib. Please inspect
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
    var command = new graphiti.command.CommandAdd(this, figure, x - center.getX(), y - center.getY());
    this.getCommandStack().execute(command);
  }
});

g.Shapes = {};
g.Shapes.Process = graphiti.shape.basic.Circle.extend({
  NAME: "g.Shapes.Process",

  init: function(width, height) {
    this._super();
    this.setDimension(100, 100);
    
    this.setColor("#339BB9");
    this.setBackgroundColor("#DDF4FB");
    this.setCssClass("process");

    // Label
    this.label = new graphiti.shape.basic.WrappingLabel("New Process");
    this.label.setFontColor("#339BB9");
    this.label.setStroke(0);
    this.addFigure(this.label, new graphiti.layout.locator.CenterLocator(this));

    this.createPort("hybrid", new graphiti.layout.locator.TopLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.RightLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.LeftLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.BottomLocator(this));
  },

  onDoubleClick: function() {
    $('body').trigger('g.showProperties', this.getPersistentAttributes());
  },

  setProperties: function(defaultProperties) {
    var propertyTemplates = defaultProperties.byShapeName("process");
    var properties = [];

    _.each(propertyTemplates, function(property) {
      var prop = {};
      prop['id'] = property.id;
      prop['value'] = property.default_value;
      properties.push(prop);
    });

    this.properties = properties;
  },

  getPersistentAttributes : function() {
    var s = this._super();
    s["properties"] = this.properties;
    return s;
  }
});

g.Shapes.ComplexProcess = graphiti.shape.basic.Circle.extend({
  NAME: "g.Shapes.ComplexProcess",

  init: function(width, height) { 
    this._super();
    this.setDimension(100, 100);
    
    this.setColor("#339BB9");
    this.setBackgroundColor("#DDF4FB");
    this.setCssClass("complex_process");    

    // Other circle
    this.inner = new graphiti.shape.basic.Circle();
    this.inner.setDimension(90,90);
    this.inner.setColor("#339BB9");
    this.inner.setBackgroundColor("#DDF4FB");
    this.addFigure(this.inner, new graphiti.layout.locator.CenterLocator(this));

    // Label
    this.label = new graphiti.shape.basic.WrappingLabel("New Process");
    this.label.setFontColor("#339BB9");
    this.label.setStroke(0);
    this.addFigure(this.label, new graphiti.layout.locator.CenterLocator(this));

    this.createPort("hybrid", new graphiti.layout.locator.TopLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.RightLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.LeftLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.BottomLocator(this));
  },

  onDoubleClick: function() {
    $('body').trigger('g.showProperties', this.getPersistentAttributes());
  },

  setProperties: function(defaultProperties) {
    var propertyTemplates = defaultProperties.byShapeName("complex-process");
    var properties = [];

    _.each(propertyTemplates, function(property) {
      var prop = {};
      prop['id'] = property.id;
      prop['value'] = property.default_value;
      properties.push(prop);
    });

    this.properties = properties;
  },

  getPersistentAttributes : function() {
    var s = this._super();
    s["properties"] = this.properties;
    return s;
  }
});

g.Shapes.DataStore = graphiti.SetFigure.extend({
  NAME : "g.Shapes.DataStore",

  init: function(width, height) {    
    this._super();
    
    this.setDimension(100, 85);
    this.setColor("#339BB9");
    this.setBackgroundColor("#DDF4FB");
    this.setCssClass("data_store");

    // Label
    this.label = new graphiti.shape.basic.WrappingLabel("New Data Store");
    this.label.setFontColor("#339BB9");
    this.label.setStroke(0);
    this.addFigure(this.label, new graphiti.layout.locator.CenterLocator(this));

    this.createPort("hybrid", new graphiti.layout.locator.TopLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.RightLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.LeftLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.BottomLocator(this));
  },

  onDoubleClick: function() {
    $('body').trigger('g.showProperties', this.getPersistentAttributes());
  },

  repaint : function(attributes)
  {
    if(this.repaintBlocked===true || this.shape===null){
      return;
    }

    if (typeof attributes === "undefined") {
      attributes = {};
    }
    
    // redirect the bgColor to the inner set and not to the outer container
    //
    attributes.fill="none";
    if(this.svgNodes !== null) {
      this.svgNodes.attr({fill: this.bgColor.getHashStyle(), stroke:"#339BB9"});
    }
    
    this._super(attributes);
  },

  createSet : function() {
    return this.canvas.paper.path("M15.499,23.438c-3.846,0-7.708-0.987-9.534-3.117c-0.054,0.236-0.09,0.48-0.09,0.737v3.877c0,3.435,4.988,4.998,9.625,4.998s9.625-1.563,9.625-4.998v-3.877c0-0.258-0.036-0.501-0.09-0.737C23.209,22.451,19.347,23.438,15.499,23.438zM15.499,15.943c-3.846,0-7.708-0.987-9.533-3.117c-0.054,0.236-0.091,0.479-0.091,0.736v3.877c0,3.435,4.988,4.998,9.625,4.998s9.625-1.563,9.625-4.998v-3.877c0-0.257-0.036-0.501-0.09-0.737C23.209,14.956,19.347,15.943,15.499,15.943zM15.5,1.066c-4.637,0-9.625,1.565-9.625,5.001v3.876c0,3.435,4.988,4.998,9.625,4.998s9.625-1.563,9.625-4.998V6.067C25.125,2.632,20.137,1.066,15.5,1.066zM15.5,9.066c-4.211,0-7.625-1.343-7.625-3c0-1.656,3.414-3,7.625-3s7.625,1.344,7.625,3C23.125,7.724,19.711,9.066,15.5,9.066z");
  },

  setProperties: function(defaultProperties) {
    var propertyTemplates = defaultProperties.byShapeName("data-store");
    var properties = [];

    _.each(propertyTemplates, function(property) {
      var prop = {};
      prop['id'] = property.id;
      prop['value'] = property.default_value;
      properties.push(prop);
    });

    this.properties = properties;
  },

  getPersistentAttributes : function() {
    var s = this._super();
    s["properties"] = this.properties;
    return s;
  }
});

g.Shapes.Interactor = graphiti.shape.basic.Rectangle.extend({
  NAME: "g.Shapes.Interactor",

  init: function(width, height) {   
    this._super();

    this.setDimension(100, 75);

    this.setColor("#339BB9");
    this.setBackgroundColor("#DDF4FB");
    this.setCssClass("interactor");

    // Label
    //this.label = new graphiti.shape.basic.Label("New External Interactor");
    this.label = new graphiti.shape.basic.WrappingLabel("New External Interactor");
    this.label.setFontColor("#339BB9");
    this.label.setStroke(0);
    this.addFigure(this.label, new graphiti.layout.locator.CenterLocator(this));        

    this.createPort("hybrid", new graphiti.layout.locator.TopLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.RightLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.LeftLocator(this));
    this.createPort("hybrid", new graphiti.layout.locator.BottomLocator(this));
  },

  onDoubleClick: function() {
    $('body').trigger('g.showProperties', this.getPersistentAttributes());
  },

  isStrechable:function()
  {
    return false;
  },

  setProperties: function(defaultProperties) {
    var propertyTemplates = defaultProperties.byShapeName("interactor");
    var properties = [];

    _.each(propertyTemplates, function(property) {
      var prop = {};
      prop['id'] = property.id;
      prop['value'] = property.default_value;
      properties.push(prop);
    });

    this.properties = properties;
  },

  getPersistentAttributes : function() {
    var s = this._super();
    s["properties"] = this.properties;
    return s;
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
      success: function(data) { this.properties = data; },
      error: app.reportError,
      data: {},
      async: false
    });

    $.ajax({
      type: 'GET',
      url: '/shapes.json',
      dataType: 'json',
      context: this,
      success: function(data) { this.shapes = data; },
      error: app.reportError,
      data: {},
      async: false
    });
  },

  byId: function(id) {
    var property = _.find(this.properties, function(p) {
      if (p.id == id) {
        return p;
      }
    });

    return property;
  },

  byShapeName: function(shapeName) {
    var shape = _.find(this.shapes, function(shape) {
      if (shape.slug == shapeName) {
        return shape;
      }
    });

    var properties = _.filter(this.properties, function(property) {
      if (property.shape_id == shape.id) {
        return property;
      }
    });

    return properties;
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
    switch (propertyTemplate.property_type.name)
    {
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