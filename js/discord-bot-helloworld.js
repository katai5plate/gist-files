(async ()=>{
    const dis = require("discord.js");
    const client = new dis.Client();

    const clientID = "";
    const tokenID = "";

    //ここにアクセスする
    const inviteURI = `https://discordapp.com/api/oauth2/authorize?client_id=${clientID}&scope=bot&permissions=0`;

    await client.login(tokenID);
    console.log("LOGGED IN");
    
    await client.on('message', msg => {
        if (msg.content === 'hi') {
            msg.reply("hi there");
        }
    });
})();
