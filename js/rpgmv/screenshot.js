(function(){
	var now = (function(n){return(`${n.getFullYear()}${`0${n.getMonth()+1}`.slice(-2)}${`0${n.getDate()}`.slice(-2)}${`0${n.getHours()}`.slice(-2)}${`0${n.getMinutes()}`.slice(-2)}${`0${n.getSeconds()}`.slice(-2)}${`00${n.getMilliseconds()}`.slice(-3)}`)})(new Date());
	var fn = `${process.cwd()}\\ss_${now}.png`;
	require('nw.gui').Window.get().capturePage(function(buf){
		require('fs').writeFile(fn,buf,function(e){
			if(e) throw e;
			var mes = `ScreenShot is saved!\n${fn}`
			alert(mes); console.log(mes);
		});
	},{format:'png',datatype:'buffer'});
})();
