# open window
```js
{
    "code": 101,
    "indent": 0,
    "parameters": [
        "FaceImageName",
        setFaceImage.x,
        setFaceImage.y,
        setBackground,    // 0:normal / 1:dark / 2:hide
        setPositionType   // 0:top / 1:middle / 2:bottom
    ]
}
// 続けて message/openChoice/selectedItem
```
# message
```js
{
    "code": 401,
    "indent": 0,
    "parameters": [
        "OneLineOfSentences A"
    ]
},
{
    "code": 401,
    "indent": 0,
    "parameters": [
        "OneLineOfSentences B"
    ]
},
```
# open choice
```js
{
    "code": 102,
    "indent": 0, // startPosition
    "parameters": [
        [
            "choice A",
            "choice B"
        ],
        setCancelType,
        setDefaultType,
        setPositionType,
        setBackground
    ]
}
// next choices
```
# choices
```js
{
    "code": 402,
    "indent": 0, // startPosition
    "parameters": [
        0, // choiceNumber: 0 ～
        "choice A"
    ]
},
// any
{
    "code": any,
    "indent": 1, // SP + 1
    "parameters": [...any]
},
// EOC
{
    "code": 0,
    "indent": 1, // SP + 1
    "parameters": []
},
// next choices...
{
    "code": 402,
    "indent": 0, // startPosition
    "parameters": [
        1, // choiceNumber
        "choice B"
    ]
},
/* any */// SP + 1
/* EOC */// SP + 1
// close choice
{
    "code": 404,
    "indent": 0, // startPosition
    "parameters": []
}
```
# EOS
```js
{
    "code": 0,
    "indent": 0,
    "parameters": []
}
```
