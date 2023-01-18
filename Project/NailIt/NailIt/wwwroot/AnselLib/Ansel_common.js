//#region Prototype
// Get date in "YYYY-MM-DD" ex:"2023-01-17"
String.prototype.YYYYMMDD = function () {
    if (this === undefined || this === null) {
        return '';
    }
    let dt = new Date(this);
    let month = (dt.getMonth() + 1).toString().padStart(2,"0");
    let day = dt.getDate().toString().padStart(2,"0");

    return `${dt.getFullYear()}-${month}-${day}`
}
// Get date in "YYYY-MM-DD" ex:"2023-01-17"
Date.prototype.YYYYMMDD = function () {
    if (this === undefined || this === null) {
        return '';
    }
    let month = (this.getMonth() + 1).toString().padStart(2,"0");
    let day = this.getDate().toString().padStart(2,"0");

    return `${this.getFullYear()}-${month}-${day}`
}
//#endregion


//#region HTML element
/**
 * 產生下拉選單(指定需求的name和value屬性)
 * @param {string} target id of select tag
 * @param {Array<object>} data array include needed name and value
 * @param {string} name innerHTML for option
 * @param {string} value value for option
 */
 function renderSelect(target, data, name, value) {    
    let select = {};
    if (typeof target === 'string') {
        select = document.getElementById(target);
    } else {
        select = target;
    }
    select.innerHTML = "";

    let opt = document.createElement('option');
    // Need first default option ?
    // opt.value = "0";
    // opt.innerHTML = "請選擇";
    // select.appendChild(opt);

    for (let item of data) {
        let opt = document.createElement('option');
        opt.innerHTML = item[name];
        opt.value = item[value];

        select.appendChild(opt);
    }
}
/**
 * Remove every tag, html to plain text.
 * @param {string} html HTML string
 * @returns 
 */
function HTMLToText (html) {
    let divEltment = document.createElement("div");
    divEltment.innerHTML = `<div>${html}</div>`;
    return divEltment.innerText.replace(/\s/g,""); // remove space in text
}
// Get short version of HTML content. If content is longer than input length, add "..." at the end.
function shortContent(length,contentHTML) {
    let contentText =  HTMLToText(contentHTML);
    if (contentText.length <= length) {
        return contentText;
    }
    return contentText.slice(0,length)+"..."
}
// Return first img element of HTML.
function firstImg (html) {
    let divEltment = document.createElement("div");
    divEltment.innerHTML = `<div>${html}</div>`;
    return divEltment.getElementsByTagName("img")[0];
}
// How to insert text into the textarea at the current cursor position?
function insertAtCursor(myField, myValue) {
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}
//#endregion


//#region File
// dataURL(base64) to file, works for any type of url, (http url, dataURL, blobURL, etc...)
// Return a promise that resolves with a File instance
// Usage: urlToFile(`data:image/png;base64,iVBORw0KGg...`, 'hear.png','image/png').then( function(file){...get file. }); 
function urlToFile(url, filename, mimeType){
    return (fetch(url)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], filename,{type:mimeType});})
    );
}
// Display file with opening a new tab by file object
function showFileObject(file){
    const url = URL.createObjectURL(file);
    window.open(url);
}
// Download file by file object
function downloadFileObject(file){
    const link = document.createElement('a');
    const url = URL.createObjectURL(file);
    link.href = url;
    // Download file.
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
}
// Save dataURL image. Replace image src dataURL to url link.
async function dataURLToLink (html) {
    let divEltment = document.createElement("div");
    divEltment.innerHTML = `<div>${html}</div>`;
    let imgTags = divEltment.getElementsByTagName("img");
    for (const imgTag of imgTags) {
        // if it's base64.
        if (imgTag.src.startsWith("data")) {
            let file = await urlToFile(imgTag.src, 'lab01.png','image/png')
            // call api save image, return url
            let result = await uploadImage(file)
            if (!!result) {
            // if (true) {
                // pretend return url link
                // result = "https://imgur.dcard.tw/Gjx7XsSl.jpg";
                let urlImg = document.createElement("img");
                urlImg.src = result;
                imgTag.before(urlImg);
                imgTag.remove();
            }
        }
    }
    return divEltment.childNodes[0].innerHTML;
}
//#endregion