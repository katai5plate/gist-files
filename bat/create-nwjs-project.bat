@echo off

rem ----------------------------
set sdkversion=0.29.3
rem ----------------------------

set /p pname=[NEW PlojectName] 
mkdir %pname%
cd %pname%
set fname=package.json
echo {>%fname%
echo     "name":"%pname%",>>%fname%
echo     "main":"index.html",>>%fname%
echo     "scripts":{>>%fname%
echo         "start":"nw">>%fname%
echo     },>>%fname%
echo     "window":{>>%fname%
echo         "min_width":640,>>%fname%
echo         "min_height":480,>>%fname%
echo         "icon":"">>%fname%
echo     }>>%fname%
echo }>>%fname%

set fname=index.html
echo ^<!DOCTYPE html^>>%fname%
echo ^<html^>>>%fname%
echo     ^<head^>>>%fname%
echo         ^<title^>%pname%^</title^>>>%fname%
echo     ^</head^>>>%fname%
echo     ^<body^>>>%fname%
echo         ^<script type="text/javascript" src="main.js"^>^</script^>>>%fname%
echo     ^</body^>>>%fname%
echo ^</html^>>>%fname%

echo document.body.innerText="Hello!";>main.js
echo npm start>run.bat
npm i nw@%sdkversion%-sdk
