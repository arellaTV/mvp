"use strict";

var pageList = [];
pageList[0] = {
  "title": "Batman Part 1",
  "panels": [{ "i": "a", "x": 0, "y": 0, "w": 5, "h": 9, "path": "/images/test01.png" }, { "i": "b", "x": 5, "y": 0, "w": 5, "h": 9, "path": "/images/test02.png" }, { "i": "c", "x": 0, "y": 0, "w": 5, "h": 9, "path": "/images/test03.png" }]
};
pageList[1] = {
  "title": 'Batman Part 2',
  "panels": [{ "i": "d", "x": 0, "y": 0, "w": 5, "h": 9, "path": "/images/test04.png" }, { "i": "e", "x": 5, "y": 0, "w": 5, "h": 9, "path": "/images/test05.png" }, { "i": "f", "x": 0, "y": 0, "w": 5, "h": 9, "path": "/images/test06.png" }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYXRhL2RhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsRUFBZjtBQUNBLFNBQVMsQ0FBVCxJQUFjO0FBQ1osV0FBUyxlQURHO0FBRVosWUFBVSxDQUNSLEVBQUMsS0FBSyxHQUFOLEVBQVcsS0FBSyxDQUFoQixFQUFtQixLQUFLLENBQXhCLEVBQTJCLEtBQUssQ0FBaEMsRUFBbUMsS0FBSyxDQUF4QyxFQUEyQyxRQUFRLG9CQUFuRCxFQURRLEVBRVIsRUFBQyxLQUFLLEdBQU4sRUFBVyxLQUFLLENBQWhCLEVBQW1CLEtBQUssQ0FBeEIsRUFBMkIsS0FBSyxDQUFoQyxFQUFtQyxLQUFLLENBQXhDLEVBQTJDLFFBQVEsb0JBQW5ELEVBRlEsRUFHUixFQUFDLEtBQUssR0FBTixFQUFXLEtBQUssQ0FBaEIsRUFBbUIsS0FBSyxDQUF4QixFQUEyQixLQUFLLENBQWhDLEVBQW1DLEtBQUssQ0FBeEMsRUFBMkMsUUFBUSxvQkFBbkQsRUFIUTtBQUZFLENBQWQ7QUFRQSxTQUFTLENBQVQsSUFBYztBQUNaLFdBQVMsZUFERztBQUVaLFlBQVUsQ0FDUixFQUFDLEtBQUssR0FBTixFQUFXLEtBQUssQ0FBaEIsRUFBbUIsS0FBSyxDQUF4QixFQUEyQixLQUFLLENBQWhDLEVBQW1DLEtBQUssQ0FBeEMsRUFBMkMsUUFBUSxvQkFBbkQsRUFEUSxFQUVSLEVBQUMsS0FBSyxHQUFOLEVBQVcsS0FBSyxDQUFoQixFQUFtQixLQUFLLENBQXhCLEVBQTJCLEtBQUssQ0FBaEMsRUFBbUMsS0FBSyxDQUF4QyxFQUEyQyxRQUFRLG9CQUFuRCxFQUZRLEVBR1IsRUFBQyxLQUFLLEdBQU4sRUFBVyxLQUFLLENBQWhCLEVBQW1CLEtBQUssQ0FBeEIsRUFBMkIsS0FBSyxDQUFoQyxFQUFtQyxLQUFLLENBQXhDLEVBQTJDLFFBQVEsb0JBQW5ELEVBSFE7QUFGRSxDQUFkIiwiZmlsZSI6ImRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcGFnZUxpc3QgPSBbXTtcbnBhZ2VMaXN0WzBdID0ge1xuICBcInRpdGxlXCI6IFwiQmF0bWFuIFBhcnQgMVwiLFxuICBcInBhbmVsc1wiOiBbXG4gICAge1wiaVwiOiBcImFcIiwgXCJ4XCI6IDAsIFwieVwiOiAwLCBcIndcIjogNSwgXCJoXCI6IDksIFwicGF0aFwiOiBcIi9pbWFnZXMvdGVzdDAxLnBuZ1wifSxcbiAgICB7XCJpXCI6IFwiYlwiLCBcInhcIjogNSwgXCJ5XCI6IDAsIFwid1wiOiA1LCBcImhcIjogOSwgXCJwYXRoXCI6IFwiL2ltYWdlcy90ZXN0MDIucG5nXCJ9LFxuICAgIHtcImlcIjogXCJjXCIsIFwieFwiOiAwLCBcInlcIjogMCwgXCJ3XCI6IDUsIFwiaFwiOiA5LCBcInBhdGhcIjogXCIvaW1hZ2VzL3Rlc3QwMy5wbmdcIn1cbiAgXVxufTtcbnBhZ2VMaXN0WzFdID0ge1xuICBcInRpdGxlXCI6ICdCYXRtYW4gUGFydCAyJyxcbiAgXCJwYW5lbHNcIjogW1xuICAgIHtcImlcIjogXCJkXCIsIFwieFwiOiAwLCBcInlcIjogMCwgXCJ3XCI6IDUsIFwiaFwiOiA5LCBcInBhdGhcIjogXCIvaW1hZ2VzL3Rlc3QwNC5wbmdcIn0sXG4gICAge1wiaVwiOiBcImVcIiwgXCJ4XCI6IDUsIFwieVwiOiAwLCBcIndcIjogNSwgXCJoXCI6IDksIFwicGF0aFwiOiBcIi9pbWFnZXMvdGVzdDA1LnBuZ1wifSxcbiAgICB7XCJpXCI6IFwiZlwiLCBcInhcIjogMCwgXCJ5XCI6IDAsIFwid1wiOiA1LCBcImhcIjogOSwgXCJwYXRoXCI6IFwiL2ltYWdlcy90ZXN0MDYucG5nXCJ9XG4gIF1cbn07XG4iXX0=