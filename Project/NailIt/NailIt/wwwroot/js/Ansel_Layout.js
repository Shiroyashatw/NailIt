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
        $(".unread-badge-sysNotic").addClass("d-none");
        $("#sysNoticDropDown").empty();
        //在dropDown印出unread system notice
        for (const message of result) {
            let sysNoticHTML = `<a class="drop-sysNotic-item">${message.messageContent}</a>`;
            $("#sysNoticDropDown").append(sysNoticHTML);
        }
    }
    // Show dropDown, When the user clicks on the button,toggle between hiding and showing the dropdown content 
    $("#sysNoticDropDown").addClass("show");
}
var showCheckNotic = async function () {
    if (!checkLogin()) return;
    let result = await getMembersMsg();
    if (!!result) {
        if (result.findIndex(x => x.unreadCount > 0 && x.memberId == 0) > -1) {
            $(".unread-badge-sysNotic").removeClass("d-none");
        }else{
            $(".unread-badge-sysNotic").addClass("d-none");
        }
        if (result.findIndex(x => x.unreadCount > 0 && x.memberId != 0) > -1) {
            $(".unread-badge-message").removeClass("d-none");
        }else{
            $(".unread-badge-message").addClass("d-none");
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

    // Close the dropdown if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn-sysNotic') && !event.target.matches('.drop-sysNotic-item')) {
            $(".dropdown-content-sysNotic").each((index, elem) => {
                if (elem.classList.contains("show"))
                    elem.classList.remove("show");
            });
        }
    }

    // check is there any new message for me per 10sec
    setInterval(showCheckNotic, 10*1000);

});