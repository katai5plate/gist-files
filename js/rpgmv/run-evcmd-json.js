var callEvents = events => {
  let inter = new Game_Interpreter();
  inter._list = events;
  $gameMap._commonEvents.push(inter);
}

callEvents([
  { code: 101, parameters: ["Actor1", 0, 0, 2] },
  { code: 401, parameters: ["あぁ～！水素の音ォ～！！"] },
  { code: 101, parameters: ["Actor2", 0, 0, 2] },
  { code: 401, parameters: ["あぁ～ぁ～！水素の音ォ～！！"] },
])

/*

i = new Game_Interpreter();
i.setup([
  { code: 101, parameters: ["", 0, 0, 2] },
  { code: 401, parameters: ["aa"] },
]);

*/
