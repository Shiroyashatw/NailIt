var scop = {
    loginId: 0, // 目前登入者Id
    loginAccount: "", // 目前登入者帳號
    loginNickname: "", // 目前登入者暱稱
    bodyArea: null, // for closing right click menu
    chattingMembersMenu: null, //  for chattingMembers right click menu
    chattingMsgsMenu: null, // for chattingMsg right click menu
    messageid: 0, // 目前開啟context menu的訊息Id
    memberid: 0, // 目前開啟context menu的人員Id
    chattingMembers: [], // 有聊天記錄的人員清單, show在#chattingMembers
    currentChatMemId: 0, // 目前聊天對象Id
}
//#region Function
//#region Action
var showRevokeBlock = function () {
    // get memberId
    // call api (deleteBlacklist)
    // showChatMember() reload cahtting member
}
var showBlacklist = function () {
    // call api get blacklist
    // show black list modal
}
var showAddBlack = async function () {
    // create black model 
    let blacklist = new MessageBlacklistTable({
        blacklistBuilder: scop.loginId,
        blacklistTarget: scop.memberid
    });
    // call api (postBlacklist)
    var result = await postBlacklist(blacklist);
    if (!!result) {
        // remove member from display
        $(`div[data-memberid='${scop.memberid}']`).remove();
        // if chatting area show the member's message
        if (scop.memberid == scop.currentChatMemId) {
            $("#chattingMain").addClass("d-none");
        }
    }
}
// Checking for new messages 
var showNewMsg = function () {
    // call api (getNewMsg)

    // update chatting members

    // (update message)
    // (call api for unread message)
}
// Revoking chosen message
var showRevokeMsg = async function () {
    // call api (putMsgRevoke)
    var result = await putMsgRevoke(scop.messageid);
    if (!!result) {
        // update message
        $(`div[data-messageid='${scop.messageid}']`).prepend(`<span class="rounded px-3 py-2" style="border: 4px solid black;">訊息已收回</span>`);
        $(`div[data-messageid='${scop.messageid}']`).children()[1].remove( );
    }
}
// Showing my conversation with chosen member
var showSingleMemberMsg = async function (obj) {
    // chosen css
    $(`div[data-memberid='${scop.currentChatMemId}']`).removeClass("chosen");
    $(obj).addClass("chosen");
    // get member info
    scop.currentChatMemId = $(obj).data("memberid");
    avatar.innerText = $(obj).children()[0].innerText;
    member.innerText = $(obj).children()[1].childNodes[1].innerText;
    // call api for read message (getSingleMemberMsg)
    let result = await getSingleMemberMsg(scop.currentChatMemId);
    let messageDate;
    if (!!result) {
        chattingMain.classList.remove("d-none");
        chattingArea.innerHTML = "";
        // show messages
        for (const message of result) {
            // print Date
            if (messageDate != message.messageTime.localYYYYMMDD()) {
                messageDate = message.messageTime.localYYYYMMDD();
                let messageDateHTML = `
                    <div class="my-3 d-flex justify-content-center">
                        <span class="px-3 bg-secondary text-white rounded">${messageDate}</span>
                    </div>`;
                $("#chattingArea").append(messageDateHTML)                
            }
            await renderMessage(message);           
        }
        BindingMsgRightMenu($(".myMessage"));
        // Scroll to buttom of message 
        setTimeout(() => {
            ShowChattingButtom();
        }, "80")
    }
    // call api for unread message (putMsgRead)
    let result2 = await putMsgRead(scop.currentChatMemId);
    if (!!result2 && result2.length > 0) {
        let messageDateHTML = `
            <div id="unreadStart" class="my-3 d-flex justify-content-center">
                <span class="px-3 bg-secondary text-white rounded">以下為尚未讀取的訊息</span>
            </div>`;
        $("#chattingArea").append(messageDateHTML)
        // show messages
        for (const message of result2) {
            // print Date
            if (messageDate != message.messageTime.localYYYYMMDD()) {
                messageDate = message.messageTime.localYYYYMMDD();
                let messageDateHTML = `
                    <div class="my-3 d-flex justify-content-center">
                        <span class="px-3 bg-secondary text-white rounded">${messageDate}</span>
                    </div>`;
                $("#chattingArea").append(messageDateHTML)
            }
            renderMessage(message);           
        }
        // update chatting members, remove unread
        $(`div[data-memberid='${scop.currentChatMemId}']`).children()[2].remove(); 
        scrolltoId("unreadStart");
    }    
}
// Sending image(s) message
var showMyNewImg = async function (obj) {
    // get file
    var files = $(obj).prop('files');
    var message = new MessageTable({
        messageSender: scop.loginId,
        messageReceiver: scop.currentChatMemId
    });
    let formdata = new FormData();
    // call api (postMsgImage), get new message
    for (let index = 0; index < files.length; index++) {
        formdata.append(`file${index}`, files[index]);
    }
    formdata.append("message", JSON.stringify(message));
    var result = await postMsgImage(formdata);
    if (!!result) {
        // show new message
        await renderMessage(result);
        BindingMsgRightMenu($(`div[data-messageid="${result.messageId}"]`));
        // update chatting members
        await renderTheChatMember(result);
        BindingMemberRightMenu([$("#chattingMembers").children()[0]]); // first one   
        // Scroll to buttom of message 
        setTimeout(() => {
            ShowChattingButtom();
        }, "80")
    }
}
// Sending message
var showMyNewMsg = async function () {
    if (!draftMessage.innerHTML.trim()) {
        return;
    }
    content = await elmDataURLToLink(draftMessage.innerHTML);
    // get value from textarea
    let message = new MessageTable({
        messageSender: scop.loginId,
        messageReceiver: scop.currentChatMemId, // 需替換 scop.currentChatMemId
        messageContent: content,
    });
    // call api (postMessage) 因為postMessage與系統功能名稱重複，改為postTheMessage
    var result = await postTheMessage(message);
    if (!!result) {
        // clear textarea
        draftMessage.innerHTML = "";
        // show new message
        result.messageTime = addHours(new Date(result.messageTime), -8);
        await renderMessage(result);
        var lastMessage = $("#chattingArea").children()[$("#chattingArea").children().length-1];
        BindingMsgRightMenu([lastMessage]); // last one
        // update chatting members
        await renderTheChatMember(result);
        BindingMemberRightMenu([$("#chattingMembers").children()[0]]); // first one
        // Scroll to buttom of message
        setTimeout(() => {
            ShowChattingButtom();
        }, "80")
    }
}
var showChatMember = async function () {
    // call api (getMembersMsg)
    var result = await getMembersMsg();
    if (!!result) {
        // show chatting members        
        await renderChatMember(result);
        BindingMemberRightMenu(document.getElementsByClassName("data-memberid"));
        scop.chattingMembers = result;
    }
}
//#endregion

//#region render updates
// 渲染人員對話記錄
var renderMessage = async function (message) {
    let messageHTML = "";
    // the message sent by other
    if (message.messageSender != scop.loginId) {
        // text message
        if (message.messageContent.indexOf("<img") == -1) {
            messageHTML = `
                <div class="mb-1 d-flex" data-messageid="${message.messageId}">
                    <span class="bg-secondary text-white rounded px-3 py-2">${message.messageContent}</span>                    
                    <span class="col-2 px-2 align-self-end">${message.messageTime.localHHmm()}</span>
                </div>`;
        }
        // image message
        else{
            messageHTML = `
                <div class="mb-1 d-flex" data-messageid="${message.messageId}">
                    <span class="bg-secondary rounded mw-100 px-1 py-1">${message.messageContent}</span>
                    <span class="col-2 px-2 align-self-end">${message.messageTime.localHHmm()}</span>
                </div>`;
        }
    }
    // the message sent by me
    else {
        // text message
        if (message.messageContent.indexOf("<img") == -1) {
            messageHTML = `
                <div class="myMessage mb-1 d-flex flex-row-reverse" data-messageid="${message.messageId}">
                    <span class="rounded px-3 py-2" style="border: 4px solid black;">${message.messageContent}</span>
                    <span class="col-2 px-2 align-self-end" style="text-align:right">${message.messageTime.localHHmm()}</span>
                </div>`;
        }
        // image message
        else{
            messageHTML = `
                <div class="myMessage mb-1 d-flex flex-row-reverse" data-messageid="${message.messageId}">
                    <span class="rounded mw-100" style="border: 4px solid black;">${message.messageContent}</span>
                    <span class="col-2 px-2 align-self-end" style="text-align:right">${message.messageTime.localHHmm()}</span>
                </div>`;
        }
    }
    $("#chattingArea").append(messageHTML);
}
// 更新對話記錄人員list
var renderTheChatMember = async function () {
    // remove old memder msg
    $(`div[data-memberid="${scop.currentChatMemId}"]`).remove();
    // prepend new one
    let chatMemberHTML = `
        <div class="data-memberid cursor-pointer d-flex align-items-center px-3 py-2 w-100" data-memberid="${scop.currentChatMemId}" onclick="showSingleMemberMsg(this)">
            <div class="d-flex justify-content-center align-items-center bg-secondary rounded-circle"
                style="aspect-ratio:1;color: #fff;width:35px">
                <div class="font-weight-bold">
                    ${avatar.innerText}
                </div>
            </div>
            <div class="pl-1 pl-sm-4">
                <div class="font-weight-bold">${member.innerText}</div>
                <div>1秒前</div>
            </div>
        </div>`;
    $("#chattingMembers").prepend(chatMemberHTML);
}
// 渲染對話記錄人員list
var renderChatMember = async function (chatMembers) {
    for (const chatMember of chatMembers) {
        let chatMemberHTML = `
        <div class="data-memberid cursor-pointer d-flex align-items-center px-3 py-2 w-100" data-memberid="${chatMember.memberId}" onclick="showSingleMemberMsg(this)">
            <div class="d-flex justify-content-center align-items-center bg-secondary rounded-circle"
                style="aspect-ratio:1;color: #fff;width:35px">
                <div class="font-weight-bold">
                    ${chatMember.memberAccount[0].toUpperCase()}
                </div>
            </div>
            <div class="pl-1 pl-sm-4">
                <div class="font-weight-bold">${chatMember.memberNickname}</div>
                <div>${chatMember.msgTimeDiff}</div>
            </div>`;
        if (chatMember.unreadCount > 0)
            chatMemberHTML += `    
            <div class="bg-danger rounded-circle text-center"style="aspect-ratio:1;color:#fff;margin-left:auto;width:24px">
                ${chatMember.unreadCount}
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
    var res = (await ChatService.putMsgRead(senderId)).json();
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
var postTheMessage = async function (message) {
    // call api get related data
    var res = await ChatService.postMessage(message);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return built model for displaying the message
    return res;
}
var uploadImage = async function (formdata) {
    // call api get related data
    let res = await ChatService.uploadImage(formdata);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return list of image url.
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
function scrolltoId(id){
    var access = document.getElementById(id);
    access.scrollIntoView();
}
// Save dataURL image. Replace image src dataURL to url link.
async function elmDataURLToLink(html) {
    let divEltment = document.createElement("div");
    divEltment.innerHTML = `<div>${html}</div>`;
    let imgTags = divEltment.getElementsByTagName("img");

    let imageURLs = []; // 回復的image url link
    let index = 0;
    let formdata = new FormData();

    // create image file with base64 which in article content.
    for (const imgTag of imgTags) {
        // if it's base64.
        if (imgTag.src.startsWith("data")) {
            let file = await urlToFile(imgTag.src, `lab.png${index}`, 'image/png');
            formdata.append(`file${index}`, file);
            index++;
        }
    }
    if (index > 0) {
        index = 0;
        // call api save image, return url
        let result = await uploadImage(formdata);
        if (!!result) {
            imageURLs = result;
        }
        // html <img> change base64 to backend link.
        for (const imgTag of imgTags) {
            if (imgTag.src.startsWith("data")) {
                let urlImg = document.createElement("img");
                urlImg.src = apiServer + imageURLs[index];
                urlImg.classList.add("mw-100");
                imgTag.before(urlImg);
                imgTag.remove();
                index++;
            }
        }
    }

    return divEltment.childNodes[0].innerHTML;
}
// Context menu for chattingArea
function BindingMsgRightMenu(chattingMsgArea) {
    var bodyArea = document.querySelector("body");
    const chattingMembersMenu = scop.chattingMembersMenu;
    const chattingMsgsMenu = scop.chattingMsgsMenu;
    // var chattingMsgArea = documenchattingMsgAreachattingMsgAreat.getElementsByClassName("data-messageid");
    for (const itemValue of chattingMsgArea) {
        itemValue.childNodes[1].addEventListener("contextmenu", (e) => {
            e.preventDefault();
            // get the message id
            scop.messageid = $(e.currentTarget).parent().data("messageid");
            const { clientX: mouseX, clientY: mouseY } = e;
            const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY, bodyArea, chattingMsgsMenu);

            chattingMsgsMenu.style.top = `${normalizedY}px`;
            chattingMsgsMenu.style.left = `${normalizedX}px`;

            chattingMsgsMenu.classList.remove("visible");
            chattingMembersMenu.classList.remove("visible");
            setTimeout(() => {
                chattingMsgsMenu.classList.add("visible");
            }, "50");
        });
    }
}
// Context menu for chattingMembers
function BindingMemberRightMenu(chattingMembersArea) {
    var bodyArea = document.querySelector("body");
    const chattingMembersMenu = scop.chattingMembersMenu;
    const chattingMsgsMenu = scop.chattingMsgsMenu;
    // var chattingMembersArea = document.getElementsByClassName("data-memberid");
    for (const itemValue of chattingMembersArea) {
        itemValue.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            // get the member id
            scop.memberid = $(e.currentTarget).data("memberid");
            console.log(scop.memberid)
            const { clientX: mouseX, clientY: mouseY } = e;
            const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY, bodyArea, chattingMembersMenu);

            chattingMembersMenu.style.top = `${normalizedY}px`;
            chattingMembersMenu.style.left = `${normalizedX}px`;

            chattingMsgsMenu.classList.remove("visible");
            chattingMembersMenu.classList.remove("visible");
            setTimeout(() => {
                chattingMembersMenu.classList.add("visible");
            }, "50");
        });
    }
}
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

    // Initial
    showChatMember()

    //#region Event Binding
    // Mousedown insert image at article editor. Don't preventDefault focus, or upload file can't find the plase to insert. 
    // Don't use onclick, focus already set on mouse down.
    $("#btnPostImage").on("mousedown", function (e) {
        document.getElementById('postImage').click();
        e.preventDefault();
    })

    // Setup event for right clicke context menu
    var bodyArea = document.querySelector("body");
    const chattingMembersMenu = document.getElementById("chattingMembersMenu");
    const chattingMsgsMenu = document.getElementById("chattingAreaMenu");
    // hide context menu while not click on specific area
    bodyArea.addEventListener("click", (e) => {
        chattingMembersMenu.classList.remove("visible");
        chattingMsgsMenu.classList.remove("visible");
    });
    // hide context menu while scrolling
    document.addEventListener("scroll", (e) => {
        chattingMembersMenu.classList.remove("visible");
        chattingMsgsMenu.classList.remove("visible");
    });
    document.getElementById("chattingArea").addEventListener("scroll", (e) => {
        chattingMembersMenu.classList.remove("visible");
        chattingMsgsMenu.classList.remove("visible");
    });
    scop.chattingMembersMenu = chattingMembersMenu;
    scop.chattingMsgsMenu = chattingMsgsMenu;

    //#endregion
});