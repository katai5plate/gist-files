await(async(u,b,j="application/json")=>await
fetch(u,{method:"POST",headers:{Accept:j,"Content-Type":j},
body:JSON.stringify(b)})).json()
("http://localhost:3332/chat/post", {x:1});
