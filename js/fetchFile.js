var fetchFile = async url =>
  await (await fetch(url))
    .body
    .getReader()
    .read();
