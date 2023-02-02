// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.


// Write your JavaScript code.
var scop = {
    loginId: 0,
}
var showChatPage = function () {
    if (!checkLogin()) return;
    // link to page
    window.location.href = `${apiServer}/Community/chat`;
}
var showSysNotic = async function () {
    if (!checkLogin()) return;

    // check unread system notice
    let result = await putMsgRead(0);
    if (!!result && result.length > 0) {
        //在dropDown印出unread system notice
        for (const message of result) {
            let sysNoticHTML = ``;
        }
    }
    // Show dropDown, When the user clicks on the button,toggle between hiding and showing the dropdown content 
    $("#sysNoticDropDown").slideToggle();
}
var showCheckNotic = async function () {
    if (!checkLogin()) return;
    let result = await getMembersMsg();
    if (!!result) {
        if (result.findIndex(x => x.unreadCount > 0 && x.memberId == 0) > -1) {
            console.log("有系統訊息")
            // 顯示紅點點 
        }
        if (result.findIndex(x => x.unreadCount > 0 && x.memberId != 0) > -1) {
            console.log("有其他會員訊息")
            // 顯示紅點點        
        }
    }
}

var putMsgRead = async function (senderId) {
    // call api get related data
    let res = (await ChatService.putMsgRead(senderId)).json();
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return list of message for displaying the message
    return res;
}
var getMembersMsg = async function () {    
    // call api get related data
    let res = await ChatService.getMembersMsg();
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return list of member msg for update member msg
    return res;
}

var checkLogin = function () {
    if (scop.loginId == 0) {
        alert("請先登入!");
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", function () {
    scop.loginId = 1;//$("#loginId").val();
    showCheckNotic()

    // When the user clicks on the button,toggle between hiding and showing the dropdown content 
    var showDropdown = function (obj) {
        // display none all dropdown-content
        $(".dropdown-content").each((index, elem) => {
            if (elem.classList.contains("show"))
                elem.classList.remove("show");
        });
        if (!$(obj).parent().children()[1].classList.contains("show")) {
            // show the dropdown
            $(obj).parent().children()[1].classList.add("show");
        }
    }

    // check is there any new message for me per 10sec
    // setInterval(showCheckNotic, 10*1000);

});