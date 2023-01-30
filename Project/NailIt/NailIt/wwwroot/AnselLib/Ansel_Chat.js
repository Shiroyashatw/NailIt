var scop = {
    loginId: 0, // 目前登入者Id
    loginAccount: "", // 目前登入者帳號
    loginNickname: "", // 目前登入者暱稱
    chattingMembersMenu: null, // right click menu of chattingMembers
    chattingMembersArea: null // right click area of chattingMembers
}
//#region Function
//#region Action
var showRevokeBlock = function () {
    // get memberId
    // call api (deleteBlacklist)
    // showChatMember() reload cahtting member
}
var showAddBlack = function () {
    // get memberId
    // create black model 
    // call api (postBlacklist)
    // remove member from display
}
// Checking for new messages 
var showNewMsg = function () {
    // call api (getNewMsg)

    // update chatting members

    // (update message)
    // (call api for unread message)
}
// Revoking chosen message
var showRevokeMsg = function () {
    // get messageId

    // call api (putMsgRevoke)

    // update message
}
// Showing my conversation with chosen member
var showSingleMemberMsg = function () {
    // get memberId

    // call api for read message (getSingleMemberMsg)

    // call api for unread message (putMsgRead)

    // show messages
    // update chatting members
}
// Sending image(s) message
var showMyNewImg = function () {
    // get file

    // call api (postMsgImage)

    // show new message
    // update chatting members
}
// Sending message
var showMyNewMsg = function () {
    // get value from textarea

    // call api (postMessage)

    // clear textarea
    // show new message
    // update chatting members
}
var showChatMember = async function () {
    // call api (getMembersMsg)
    var result = await getMembersMsg();
    if (!!result) {
        // show chatting members
        renderChatMember(result);
    }
}
//#endregion

//#region render updates
var renderChatMember = function (chatMembers) {
    for (const chatMember of chatMembers) {
        let chatMemberHTML = `<div class="data-memberid cursor-pointer d-flex align-items-center px-3 py-2" data-memberid="${chatMember.memberId}">
                                <div class="d-flex justify-content-center align-items-center bg-secondary rounded-circle"
                                    style="aspect-ratio:1;color: #fff;width:35px">
                                    <div class="font-weight-bold">
                                        ${chatMember.msgTimeDiff[0]}
                                    </div>
                                </div>
                                <div class="pl-1 pl-sm-4">
                                    <div class="font-weight-bold">${chatMember.memberId}</div>
                                    <div>${chatMember.msgTimeDiff}</div>
                                </div>
                            </div>`;
        $("#chattingMembers").prepend(chatMemberHTML);        
    }
}
//#endregion

//#region call API
var postBlacklist = async function (blacklist) {
    // call api get related data
    var res = await BlacklistService.postBlacklist(blacklist);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return list of member msg for update member msg
    return res;
}
var deleteBlacklist = async function (builderId, targetId) {
    // call api get related data
    var res = await BlacklistService.deleteBlacklist(builderId, targetId);
    if (!res.status.toString().startsWith("2")) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    return true;
}
var getMembersMsg = async function () {
    // call api get related data
    var res = await ChatService.getMembersMsg();
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return list of member msg for update member msg
    return res;
}
var getSingleMemberMsg = async function (memberId) {
    // call api get related data
    var res = await ChatService.getSingleMemberMsg(memberId);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return list of member msg for update member msg
    return res;
}
var getNewMsg = async function (updateTime) {
    // call api get related data
    var res = await ChatService.getNewMsg(updateTime);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return list of member msg for update member msg
    return res;
}
var putMsgRead = async function (senderId) {
    // call api get related data
    var res = await ChatService.putMsgRead(senderId);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return list of message for displaying the message
    return res;
}
var putMsgRevoke = async function (messageId) {
    // call api get related data
    var res = await ChatService.putMsgRevoke(messageId);
    if (!res.status.toString().startsWith("2")) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    return true;
}
var postMessage = async function (message) {
    // call api get related data
    var res = await ChatService.postMessage(message);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return built model for displaying the message
    return res;
}
var postMsgImage = async function (imageFiles) {
    // call api get related data
    var res = await ChatService.postMsgImage(imageFiles);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return built model for displaying the message
    return res;
}
//#endregion

const normalizePozition = (mouseX, mouseY, area, contextMenu) => {
    // compute what is the mouse position relative to the container element (scope)
    const {
        left: scopOffsetX,
        top: scopeOffsetY
    } = area.getBoundingClientRect();

    const scopeX = mouseX - scopOffsetX;
    const scopeY = mouseY - scopeOffsetY;

    // check if the element will go out of bounds
    const outOfBoundsOnX =
        scopeX + contextMenu.clientWidth > area.clientWidth;

    const outOfBoundsOnY =
        scopeY + contextMenu.clientHeight > area.clientHeight;

    let normalizedX = mouseX;
    let normalizedY = mouseY;

    // normalize on X
    if (outOfBoundsOnX) {
        normalizedX =
            scopOffsetX + area.clientWidth - contextMenu.clientWidth;
    }

    // normalize on Y
    if (outOfBoundsOnY) {
        normalizedY =
            scopeOffsetY + area.clientHeight - contextMenu.clientHeight;
    }

    return { normalizedX, normalizedY };
}
function ShowChattingButtom() {
    var chattingArea = document.querySelector('#chattingArea');
    chattingArea.scrollTop = chattingArea.scrollHeight - chattingArea.clientHeight;
}
function ShowTAInput() {
    this.style.height = 0;
    this.style.height = (this.scrollHeight) + "px";
}
//#endregion

document.addEventListener("DOMContentLoaded", async function () {
    // $('#editArticleModal').modal({
    //     show: true, // 預設開啟modal
    // })

    // 是否需要把backend的session設定到frontend ?
    scop.loginId = $("#loginId").val();
    scop.loginAccount = $("#loginAccount").val();
    scop.loginNickname = $("#loginNickname").val();
    console.log(scop.loginId, scop.loginAccount, scop.loginNickname);

    //#region Event Binding

    // Setup event for right clicke context menu
    var bodyArea = document.querySelector("body");
    // hide context menu while not click on specific area
    bodyArea.addEventListener("click", (e) => {
        if (e.target.offsetParent != chattingMembersMenu) {
            chattingMembersMenu.classList.remove("visible");
        }
        if (e.target.offsetParent != chattingMsgMenu) {
            chattingMsgMenu.classList.remove("visible");
        }
    });
    // hide context menu while scrolling
    document.addEventListener("scroll", (e) => {
        chattingMembersMenu.classList.remove("visible");
        chattingMsgMenu.classList.remove("visible");
    });
    document.getElementById("chattingArea").addEventListener("scroll", (e) => {
        chattingMembersMenu.classList.remove("visible");
        chattingMsgMenu.classList.remove("visible");
    });
    // context menu for chattingMembers
    const chattingMembersMenu = document.getElementById("chattingMembersMenu");
    var chattingMembersArea = document.getElementsByClassName("data-memberid");
    for (const itemValue of chattingMembersArea) {
        itemValue.addEventListener("contextmenu", (e) => {
            e.preventDefault();

            const { clientX: mouseX, clientY: mouseY } = e;
            const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY, bodyArea, chattingMembersMenu);

            chattingMembersMenu.style.top = `${normalizedY}px`;
            chattingMembersMenu.style.left = `${normalizedX}px`;

            chattingMsgMenu.classList.remove("visible");
            chattingMembersMenu.classList.remove("visible");
            setTimeout(() => {
                chattingMembersMenu.classList.add("visible");
            }, "50");
        });
    }
    // context menu for chattingArea
    const chattingMsgMenu = document.getElementById("chattingAreaMenu");
    var chattingMsgArea = document.getElementsByClassName("data-messageid");
    for (const itemValue of chattingMsgArea) {
        itemValue.childNodes[1].addEventListener("contextmenu", (e) => {
            e.preventDefault();

            const { clientX: mouseX, clientY: mouseY } = e;
            const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY, bodyArea, chattingMsgMenu);

            chattingMsgMenu.style.top = `${normalizedY}px`;
            chattingMsgMenu.style.left = `${normalizedX}px`;

            chattingMsgMenu.classList.remove("visible");
            chattingMembersMenu.classList.remove("visible");
            setTimeout(() => {
                chattingMsgMenu.classList.add("visible");
            }, "50");
        });
    }

    // Setup draftMessagetextarea input event
    const tx = document.getElementById("draftMessagetextarea");
    tx.setAttribute("style", "height:" + (tx.scrollHeight) + "px;");
    tx.addEventListener("input", ShowTAInput, false);

    // Scroll to buttom of message 
    ShowChattingButtom();

    //#endregion
});