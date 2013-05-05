require 'uglifier'

files = [
"graphiti/src/draw2d.js",
"graphiti/src/util/Color.js",
"graphiti/src/util/UUID.js",
"graphiti/src/util/ArrayList.js",
"graphiti/src/policy/EditPolicy.js",
"graphiti/src/policy/canvas/CanvasPolicy.js",
"graphiti/src/policy/canvas/SelectionPolicy.js",
"graphiti/src/policy/canvas/SingleSelectionPolicy.js",
"graphiti/src/policy/canvas/BoundingBoxSelectionPolicy.js",
"graphiti/src/policy/canvas/DecorationPolicy.js",
"graphiti/src/policy/canvas/FadeoutDecorationPolicy.js",
"graphiti/src/policy/canvas/SnapToEditPolicy.js",
"graphiti/src/policy/canvas/SnapToGridEditPolicy.js",
"graphiti/src/policy/canvas/SnapToGeometryEditPolicy.js",
"graphiti/src/policy/figure/DragDropEditPolicy.js",
"graphiti/src/policy/figure/SelectionFeedbackPolicy.js",
"graphiti/src/policy/figure/RectangleSelectionFeedbackPolicy.js",
"graphiti/src/policy/figure/AntSelectionFeedbackPolicy.js",
"graphiti/src/policy/figure/LineSelectionFeedbackPolicy.js",
"graphiti/src/policy/figure/SlimSelectionFeedbackPolicy.js",
"graphiti/src/policy/port/PortFeedbackPolicy.js",
"graphiti/src/policy/port/IntrusivePortsFeedbackPolicy.js",
"graphiti/src/Selection.js",
"graphiti/src/Canvas.js",
"graphiti/src/Figure.js",
"graphiti/src/geo/Point.js",
"graphiti/src/geo/Rectangle.js",
"graphiti/src/shape/node/Node.js",
"graphiti/src/VectorFigure.js",
"graphiti/src/shape/basic/Line.js",
"graphiti/src/shape/basic/Oval.js",
"graphiti/src/shape/basic/Circle.js",
"graphiti/src/shape/basic/Rectangle.js",
"graphiti/src/shape/basic/PolyLine.js",
"graphiti/src/layout/locator/Locator.js",
"graphiti/src/layout/locator/ConnectionLocator.js",
"graphiti/src/layout/locator/PortLocator.js",
"graphiti/src/layout/locator/InputPortLocator.js",
"graphiti/src/layout/anchor/ConnectionAnchor.js",
"graphiti/src/Port.js",
"graphiti/src/InputPort.js",
"graphiti/src/OutputPort.js",
"graphiti/src/HybridPort.js",
"graphiti/src/SetFigure.js",
"graphiti/src/ResizeHandle.js",
"graphiti/src/shape/basic/Label.js",
"src/label.js",
"graphiti/src/LineResizeHandle.js",
"graphiti/src/LineStartResizeHandle.js",
"graphiti/src/LineEndResizeHandle.js",
"graphiti/src/layout/connection/ConnectionRouter.js",
"graphiti/src/layout/connection/ManhattanConnectionRouter.js",
"graphiti/src/layout/connection/ManhattanBridgedConnectionRouter.js",
"graphiti/src/Connection.js",
"graphiti/src/command/CommandType.js",
"graphiti/src/command/Command.js",
"graphiti/src/command/CommandCollection.js",
"graphiti/src/command/CommandStack.js",
"graphiti/src/command/CommandStackEvent.js",
"graphiti/src/command/CommandStackEventListener.js",
"graphiti/src/command/CommandMove.js",
"graphiti/src/command/CommandResize.js",
"graphiti/src/command/CommandConnect.js",
"graphiti/src/command/CommandReconnect.js",
"graphiti/src/command/CommandDelete.js",
"graphiti/src/command/CommandAdd.js",
"graphiti/src/io/Writer.js",
"graphiti/src/io/Reader.js",
"graphiti/src/io/json/Writer.js",
"graphiti/src/io/json/Reader.js",
"src/locators.js",
"graphiti/src/layout/locator/CenterLocator.js",
"graphiti/src/shape/icon/Icon.js",
"graphiti/src/shape/icon/Db.js"
]



File.open('diagram.js', 'w') do |out|
  files.each do |f|
    puts "-- " + f

    File.open(f, "r:bom|utf-8"){ |file|
      text_without_bom = file.read
      out.puts(text_without_bom)
    }

  end
end

compress = IO.read('diagram.js')
compress.encode!('UTF-16', 'UTF-8', :invalid => :replace, :replace => '')
compress.encode!('UTF-8', 'UTF-16')
IO.write('diagram.min.js', Uglifier.new().compile(compress) )

