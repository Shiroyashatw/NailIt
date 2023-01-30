var scop = {
    loginId: 0, // 目前登入者Id
    loginAccount: "", // 目前登入者帳號
    loginNickname: "", // 目前登入者暱稱
    chattingMembersMenu: null, // right click menu of chattingMembers
    chattingMembersArea: null // right click area of chattingMembers
}
//#region Function
//#region Action
function ShowChattingButtom() {
    var chattingArea = document.querySelector('#chattingArea');
    chattingArea.scrollTop = chattingArea.scrollHeight - chattingArea.clientHeight;
}
function ShowTAInput() {
    this.style.height = 0;
    this.style.height = (this.scrollHeight) + "px";
}
//#endregion

//#region render updates
//#endregion

//#region call API
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
        itemValue.addEventListener("contextmenu", (e) => {
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