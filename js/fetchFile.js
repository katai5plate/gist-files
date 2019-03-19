var fetchFile = async url => await (await fetch(url));
var fetchText = async url => await (await fetch(url)).text();
var fetchJson = async url => await (await fetch(url)).json();
var fetchBuffer = async url => await (await fetch(url)).arrayBuffer();
var fetchBlob = async url => await (await fetch(url)).blob();
