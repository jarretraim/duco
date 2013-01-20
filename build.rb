require 'uglifier'

files = [
  "graphiti/src/graphiti.js",
  "graphiti/src/Canvas.js",
  "graphiti/src/Figure.js",
  "graphiti/src/util/Color.js",
  "graphiti/src/util/UUID.js",
  "graphiti/src/util/ArrayList.js",
  "graphiti/src/geo/Point.js",
  "graphiti/src/geo/Rectangle.js",
  "graphiti/src/shape/node/Node.js",
  "graphiti/src/VectorFigure.js",  
  "graphiti/src/shape/basic/Line.js",
  "graphiti/src/shape/basic/Oval.js",
  "graphiti/src/shape/basic/Circle.js",
  "graphiti/src/shape/basic/Rectangle.js",
  "graphiti/src/shape/basic/PolyLine.js",
  "graphiti/src/Port.js", 
  "graphiti/src/InputPort.js",
  "graphiti/src/OutputPort.js",
  "graphiti/src/HybridPort.js",
  "graphiti/src/ConnectionAnchor.js",
  "graphiti/src/SetFigure.js", 
  "graphiti/src/ResizeHandle.js", 
  "graphiti/src/shape/basic/Label.js",
  "src/label.js",
  "graphiti/src/LineResizeHandle.js",
  "graphiti/src/LineStartResizeHandle.js",
  "graphiti/src/LineEndResizeHandle.js",
  "graphiti/src/layout/locator/Locator.js",
  "graphiti/src/layout/locator/ConnectionLocator.js",
  "graphiti/src/layout/connection/ConnectionRouter.js",
  "graphiti/src/layout/connection/ManhattanConnectionRouter.js",
  "graphiti/src/layout/connection/ManhattanBridgedConnectionRouter.js",
  "graphiti/src/Connection.js",
  "graphiti/src/command/CommandType.js",
  "graphiti/src/command/Command.js",
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
  "graphiti/src/io/json/Writer.js",
  "graphiti/src/io/Reader.js",
  "graphiti/src/io/json/Reader.js",
  "src/locators.js",
  "graphiti/src/layout/locator/CenterLocator.js",
  "graphiti/src/ui/LabelEditor.js",
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
IO.write('diagram.min.js', Uglifier.new().compile(compress) )

