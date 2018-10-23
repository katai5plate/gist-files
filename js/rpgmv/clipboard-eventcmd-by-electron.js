const { app, clipboard } = require("electron");
function main() {
  clipboard.writeBuffer(
    "application/rpgmv-EventCommand",
    new Buffer(
      JSON.stringify([
        { code: 101, indent: 0, parameters: ["Actor1", 0, 0, 2] },
        { code: 401, indent: 0, parameters: ["あぁ～！水素の音ォ～！！"] }
      ]),
      "utf-8"
    )
  );
  console.log(clipboard.readBuffer("application/rpgmv-EventCommand").toString());
  app.exit();
}
app.on("ready", main);

// mkdir electestmv && cd electestmv && yarn init -y && yarn add electron && npx electron <this>
