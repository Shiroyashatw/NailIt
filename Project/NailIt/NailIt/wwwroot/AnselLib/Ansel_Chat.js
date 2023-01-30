var scop = {
    loginId: 0, // 目前登入者Id
    loginAccount: "", // 目前登入者帳號
    loginNickname: "", // 目前登入者暱稱
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

document.addEventListener("DOMContentLoaded", async function () {
    // $('#editArticleModal').modal({
    //     show: true, // 預設開啟modal
    // })

    // 是否需要把backend的session設定到frontend ?
    scop.loginId = $("#loginId").val();
    scop.loginAccount = $("#loginAccount").val();
    scop.loginNickname = $("#loginNickname").val();
    console.log(scop.loginId, scop.loginAccount, scop.loginNickname);

    // setup draftMessagetextarea input event
    const tx = document.getElementById("draftMessagetextarea");
    tx.setAttribute("style", "height:" + (tx.scrollHeight) + "px;");
    tx.addEventListener("input", ShowTAInput, false);

    ShowChattingButtom();
    
});