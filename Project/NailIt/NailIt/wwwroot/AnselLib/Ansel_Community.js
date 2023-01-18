﻿// only for testing. Should get data from backend.
// sessionStorage.setItem("memberId", "1");

var scop = {
    loginId: 0, // 目前登入者Id
    loginName: "", // 目前登入者名字
    loginNickname: "", // 目前登入者暱稱, 給新增留言使用
    articleCodeList: [], // 版別清單
    reportCodeList: [], // 檢舉項目清單
    articleCode: "", // 目前所在的版別ex:"L0"
    articleMode: "", // new or edit or save.目前編輯器是哪個狀態。
    newArticle: {}, // new article object for create a article.
    articles: [], // 目前帶出的list of article
    articleId: 0, // 現在選取的articleId, 給刪除/編輯/檢舉article以及新增reply使用
    page: 0, // 目前頁數，給查詢/帶出更多使用
    articleAuthorId: 0, // 目前帶出的文章作者或會員個人頁面, 用來比對是否為本人貼文或留言
    replies: [], // 目前article的replies
    replyId: 0, // 給刪除/檢舉reply使用
}

//#region Function
//#region Action
var showSaveArticle = async function () {
    if ($("#editModalArticleTitle").val().trim() == "" || $("#editModalArticleContent").html().trim().replace("<div>", "").replace("</div>", "").replace("<br>", "") == "") {
        alert("貼文標題與貼文內容皆為必填!");
        return;
    }
    if (scop.articleMode == "new") {
        let article = scop.newArticle;
        article.articleBoardC = $("#newArtiCodeList").val();
        article.articleTitle = $("#editModalArticleTitle").val().trim();
        // save image, return url
        let content = $("#editModalArticleContent").html();
        content = await dataURLToLink(content);
        article.articleContent = content;
        article.articleBuildTime = new Date();
        article.articleLastEdit = new Date();
        // call api
        let result = await postArticle(article);
        if (!!result) {
            scop.articleMode = "save";
            $("#editArticleModal").modal("hide");
            // show the article code page
            let articleCode = scop.articleCodeList.find(a => a.codeId == $("#newArtiCodeList").val());
            showMain(articleCode.codeId, articleCode.codeRepresent);
        }
    }
    if (scop.articleMode == "edit") {
        let article = currentArticle().article;
        article.articleTitle = $("#editModalArticleTitle").val();
        // save image, return url
        let content = $("#editModalArticleContent").html()
        content = await dataURLToLink(content);
        article.articleContent = content;
        article.articleLastEdit = new Date();
        // call api
        let result = await putArticle(article);
        if (!!result) {
            scop.articleMode = "save";
            $("#editArticleModal").modal("hide");
            // show article modal and render articles
            $("#articleModal").modal("show");
            renderTheArticle(currentArticle());
            // show the article modal
            $("#articleModal").modal("show");
        }
    }
}
var showEditArticleModal = function () {
    scop.articleMode = "edit";
    $("#editArticleModal").modal("show");
}
var showNewArticleModal = function () {
    scop.articleMode = "new";
    scop.newArticle = new ArticleTable({
        articleBoardC: scop.articleCode,
        articleAuthor: scop.loginId,
    });
    $("#editArticleModal").modal("show");
}
// Report article or reply, and the item disappear from display.
var showReportAction = async function () {
    // check report value exist
    let reportCodeId = $("input[name='reportOption']:checked").val();
    if (reportCodeId == undefined) {
        alert("請選取檢舉事項!");
        return;
    }
    let reportRepresent = scop.reportCodeList.find(r => r.codeId == reportCodeId).codeRepresent;
    // new report for reply
    let report = new ReportTable({
        reportBuilder: scop.loginId,
        ReportTarget: scop.articleAuthorId,
        reportItem: currentArticle().article.articleId,
        reportPlaceC: "D5",
        reportReasonC: reportCodeId,
        reportContent: reportRepresent
    });
    // if it's article report, change report content
    if (scop.replyId != 0) {
        let reply = scop.replies.find(r => r.reply.replyId == scop.replyId);
        report.ReportTarget = reply.reply.memberId;
        report.reportItem = reply.reply.replyId;
        report.reportPlaceC = "D6";
    }
    // if "其他", "G9"(reportCodeId) be chosen, get report reason from #reportOtherInput
    if (reportCodeId == "G9") {
        report.reportContent = $("#reportOtherInput").val();
    }
    // call api
    let result = await SocialService.postSocialReport(report);
    // check result
    if (result) {
        // close report modal
        $("#reportModal").modal("hide");
        // hide the reply/article
        if (scop.replyId == 0) { // article
            // remove the article from display
            renderRemoveArticle();
            // hide article modal
            $("#articleModal").modal("hide");
        } else { // reply
            // remove the reply from display. update reply area reply count. update the article reply count.
            renderRemoveTheReply();
        }
        // snack bar inform complete
        showSnackbar("檢舉已完成!");
    }

}
// Show report reason list, before confirm report
var showReportModal = function (obj) {
    // fade articleModal
    $("#articleModal").css("z-index", "1040");
    let replyId = $(obj).parent().parent().parent().parent().data("replyid");
    // check it's reply or article
    if (replyId != undefined) {
        $("#reportModalTitle").text("你為何要檢舉這則留言?");
        // prepare replyId for report.
        scop.replyId = replyId;
    } else {
        $("#reportModalTitle").text("你為何要檢舉這則貼文?");
        // use replyId equal 0, to tell it's article report.
        scop.replyId = 0;
    }
    // show report modal
    $("#reportModal").modal("show");
}
// Remove the reply from replies
var showDeleteReply = async function () {
    let result = await deleteReply(scop.replyId);
    if (result) {
        // remove the reply from display. update reply area reply count. update the article reply count.
        renderRemoveTheReply();
        // snack bar inform complete
        showSnackbar("刪除已完成!");
    }
}
// Show the new article in articles
var showNewReply = async function () {
    let reply = new ReplyTable({
        articleId: scop.articleId,
        memberId: scop.loginId,
        replyContent: $("#replyInput").val(),
    })
    let resultReply = await postReply(reply);
    if (!!resultReply) {
        reply = {
            reply: resultReply,
            memberNickname: scop.loginNickname,
            replyLastDateDiff: "0分鐘前",
            like: false
        }
        // add input replies. prepend the new reply. clean input. update the articleReplyCount++
        scop.replies.unshift(reply);
        // Render reply area
        renderNewReply(resultReply);
        $("#replyInput").val("");
        currentArticle().article.articleReplyCount++;
        $("#ModalArticleReplyCount").html(`共${currentArticle().article.articleReplyCount}則留言`);
        // Render the reply at articles
        renderTheArticle(currentArticle());
        // snack bar inform complete
        showSnackbar("留言已完成!");
    }
}
// Remove the article from articles
var showDeleteArticle = async function () {
    let result = await deleteArticle(scop.articleId);
    if (result) {
        // remove the article data-articleid
        renderRemoveArticle();
        // snack bar inform complete
        showSnackbar("刪除已完成!");
        $("#articleModal").modal("hide");
    }
}
// Show confirm Modal, if delete the article or reply.
var showConfirmDelModal = function (obj) {
    // fade articleModal
    $("#articleModal").css("z-index", "1040");
    let replyId = $(obj).parent().parent().parent().parent().data("replyid");
    // check it's reply or article
    if (replyId != undefined) {
        let reply = scop.replies.find(r => r.reply.replyId == replyId);
        // bind reply info
        $("#confirmModalBody").html(`<p>留言內容: ${reply.reply.replyContent}<br>
                                          按讚數: ${reply.reply.replyLikesCount}</p>`);
        // bind delete action
        scop.replyId = replyId;
        btnConfirmDel.onclick = showDeleteReply;
    } else {
        let article = currentArticle();
        // bind article info
        $("#confirmModalBody").html(`<p>文章標題: ${article.article.articleTitle}<br>
                                          按讚數: ${article.article.articleLikesCount}<br>
                                          留言數: ${article.article.articleReplyCount}</p>`);
        // bind delete action
        btnConfirmDel.onclick = showDeleteArticle;
    }
    // show confirm modal
    $("#confirmModal").modal("show");
}
var showSnackbar = function (text) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    // Add the "show" class to DIV
    x.className = "snackShow";
    x.innerText = text;
    // After 2.5 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("snackShow", ""); }, 2500);
}
// When the user clicks on the button,toggle between hiding and showing the dropdown content 
var showDropdown = function (obj) {
    if ($(obj).parent().children()[1].classList.contains("show")) {
        // display none all dropdown-content
        $(".dropdown-content").each((index, elem) => {
            if (elem.classList.contains("show"))
                elem.classList.remove("show");
        });
    } else {
        // display none all dropdown-content
        $(".dropdown-content").each((index, elem) => {
            if (elem.classList.contains("show"))
                elem.classList.remove("show");
        });
        // show the dropdown
        $(obj).parent().children()[1].classList.add("show");
    }
}
// show reply like status change
var showReplyLikeToggle = async function (likeObj) {
    // get the reply (like status)
    let replyId = $(likeObj).parent().parent().data("replyid")
    let reply = scop.replies.find(r => r.reply.replyId == replyId);
    // build a like with replyId and memberId:scop.loginId
    let replyLike = new ReplyLikeTable({
        replyId: replyId,
        memberId: scop.loginId
    })
    // if like == false (build a like)
    if (!reply.like) {
        // POST the like
        let result = await postReplyLike(replyLike);
        // Check api success, like data of scop.articles change to ture, and update display.
        if (result) {
            reply.like = true;
            $(likeObj).css("color", "red");
            reply.reply.replyLikesCount++;
        }
    }
    // else (delete a like)
    else {
        // DELETE the like
        let result = await deleteReplyLike(replyLike.replyId, replyLike.memberId);
        // Check api success, like data of scop.articles change to false, and update display.
        if (result) {
            reply.like = false;
            $(likeObj).css("color", "rgb(108, 117, 125)");
            reply.reply.replyLikesCount--;
        }
    }
    // Update articleLikesCount display.
    $(likeObj).parent().children()[2].innerText = reply.reply.replyLikesCount;
}
// show article like status change
var showArticleLikeToggle = async function (likeObj) {
    // get like status
    let article = currentArticle();
    // build a like with articleId and memberId:scop.loginId
    let articleLike = new ArticleLikeTable({
        articleId: scop.articleId,
        memberId: scop.loginId
    });
    // if like == false (create a like)
    if (!article.like) {
        // POST the like
        let result = await postArticleLike(articleLike);
        // Check api success, like data of scop.articles change to ture, and update display.
        if (result) {
            article.like = true;
            $(likeObj).css("color", "red");
            article.article.articleLikesCount++;
        }
    }
    // else (delete a like)
    else {
        // DELETE the like
        let result = await deleteArticleLike(articleLike.articleId, articleLike.memberId);
        // Check api success, like data of scop.articles change to false, and update display.
        if (result) {
            article.like = false;
            $(likeObj).css("color", "rgb(108, 117, 125)");
            article.article.articleLikesCount--;
        }
    }
    // Update articleLikesCount display.
    $("#ModelArticleLikesCount").text(article.article.articleLikesCount);
    // Render the reply
    renderTheArticle(article);
}
// show Modal
var showModal = async function (articleId) {
    scop.articleId = articleId;
    let article = currentArticle();
    // call and show relies
    scop.articleAuthorId = article.article.articleAuthor;
    await getReplies(articleId);
    renderReplaies();

    // Modal show article data
    await $("#articleModal").modal("show");
}
// search button show articles
var showSearch = async function () {
    scop.page = 0;
    $("#btnMoreArticle").removeAttr("disabled");
    // show articles
    if (scop.articleCode == "My") {
        await getMyArticles();
        renderArticles(scop.articles.reaultArticles);
    } else {
        await getArticles();
        renderArticles(scop.articles);
    }
}
// load more 10 articles
var showMoreArticle = async function () {
    scop.page++;
    // call and show 10 more articles
    let moreArticles = [];
    if (scop.articleCode == "My") moreArticles = await getMyArticles();
    else moreArticles = await getArticles();
    renderArticles(moreArticles);
}
// show articles of one person (my or other)
var showMyMain = async function (own) {
    scop.articleCode = "My";
    scop.page = 0;
    // update main area
    if (own) {
        $("#mainTitle").html("我的");
        scop.articleAuthorId = scop.loginId;
    } else $("#mainTitle").hide();
    $("#memberInfo").children().show();
    $("#btnMoreArticle").removeAttr("disabled");
    await getMyArticles();
    $("#avatar").addClass("d-flex align-items-center");
    $("#memberNames").children()[0].innerText = scop.articles.member.memberNickname;
    $("#memberNames").children()[1].innerText = scop.articles.member.memberAccount;
    $("#memberNames").children()[2].innerText = `共${scop.articles.articleCount}篇文章`;
    renderArticles(scop.articles.reaultArticles);
}
// show articles by sort of article
var showMain = async function (code, name) {
    scop.articleCode = code;
    scop.page = 0;
    // update main area
    $("#mainTitle").html(name);
    $("#mainTitle").show();
    $("#memberInfo").children().hide();
    $("#btnMoreArticle").removeAttr("disabled");
    $("#avatar").removeClass("d-flex align-items-center");
    // show articles
    await getArticles();
    renderArticles(scop.articles);
}
//#endregion

//#region render updates
// remove the reply from display. update reply area reply count. update the article reply count.
var renderRemoveTheReply = function () {
    $(`div[data-replyid="${scop.replyId}"]`).remove();
    currentArticle().article.articleReplyCount--;
    $("#ModalArticleReplyCount").html(`共${currentArticle().article.articleReplyCount}則留言`);
    renderTheArticle(currentArticle());
}
var renderNewReply = function (reply) {
    let replyHTML = `
                <div data-replyid="${reply.replyId}">
                    <div class="d-flex align-items-center"> <!-- Reply header -->
                        <div style="margin-right:auto">
                            <span>${scop.loginNickname}</span><span>1秒前</span>
                        </div>
                        <i class="fa-solid fa-heart cursor-pointer" style="color:rgb(108, 117, 125);" onclick="showReplyLikeToggle(this)"></i>
                        <span>${reply.replyLikesCount}</span>
                        <div class="dropdown">
                            <i onclick="showDropdown(this)" class="dropbtn fa-solid fa-ellipsis-vertical"></i>
                            <div class="dropdown-content">
                                <a href="javascript:void(0)" class="text-danger" onclick="showConfirmDelModal(this)">刪除</a>
                            </div>
                        </div>
                    </div>
                    <div> <!-- Reply content -->
                        ${reply.replyContent}
                    </div>
                </div>
    `;
    $("#ModelReplies").prepend(replyHTML);
}
var renderReplaies = function () {
    let replyHTML = "";
    for (const reply of scop.replies) {
        replyHTML += `<div data-replyid="${reply.reply.replyId}">
                        <div class="d-flex align-items-center"> <!-- Reply header -->
                            <div style="margin-right:auto">
                                <span>${reply.memberNickname}</span><span>${reply.replyLastDateDiff}</span>
                            </div>`;
        if (reply.like) { // show user already like the comment
            replyHTML += `<i class="fa-solid fa-heart cursor-pointer" style="color:red;" onclick="showReplyLikeToggle(this)"></i>`;
        } else {
            replyHTML += `<i class="fa-solid fa-heart cursor-pointer" style="color:rgb(108, 117, 125);" onclick="showReplyLikeToggle(this)"></i>`;
        }
        replyHTML += `
                    <span>${reply.reply.replyLikesCount}</span>
                    <div class="dropdown">
                        <i onclick="showDropdown(this)" class="dropbtn fa-solid fa-ellipsis-vertical"></i>
                        <div class="dropdown-content">
        `;
        // Can edit and delete own reply
        if (reply.reply.memberId == scop.loginId) {
            replyHTML += `
                <a href="javascript:void(0)" class="text-danger" onclick="showConfirmDelModal(this)">刪除</a>
            `;
        }
        // Only can report others reply
        else {
            replyHTML += `
                <a href="javascript:void(0)" class="text-danger" onclick="showReportModal(this)">檢舉</a>
            `;
        }
        replyHTML += `                    
                        </div>
                    </div>
                </div>
                <div> <!-- Reply content -->
                        ${reply.reply.replyContent}
                    </div>
                </div>
        `;
    }
    $("#ModelReplies").html(replyHTML);
}
var renderArtiModDropdown = function () {
    let dropContentHTML = ``;
    // Can edit and delete own article
    if (scop.articleAuthorId == scop.loginId) {
        dropContentHTML = `
            <a href="javascript:void(0)" onclick="showEditArticleModal()">編輯</a>
            <a href="javascript:void(0)" class="text-danger" onclick="showConfirmDelModal()">刪除</a>`;
    }
    // Only can report others reply
    else {
        dropContentHTML = `
            <a href="javascript:void(0)" class="text-danger" onclick="showReportModal()">檢舉</a>`;
    }
    $("#ArtiModDropContent").html(dropContentHTML);
};
var renderRemoveArticle = function () {
    $(`div[data-articleid="${scop.articleId}"]`).remove();
    if (scop.articleCode == "My") {
        scop.articles.articleCount--;
        $("#memberNames").children()[2].innerText = `共${scop.articles.articleCount}篇文章`;
    }
}
var renderTheArticle = function (article) {
    let articleHTML = `
        <div class="col-10 pr-0">
            <h4 class="m-0">${article.article.articleTitle}</h4>
            <span data-memberId="${article.article.articleAuthor}">${article.memberNickname}</span><br>
            <span>${shortContent(60, article.article.articleContent)}</span><br>
            <i class="fa-solid fa-heart text-danger""></i>${article.article.articleLikesCount}
            <i class="fa-sharp fa-solid fa-comment text-primary"></i>${article.article.articleReplyCount}
        </div>`;
    let firsImg = firstImg(article.article.articleContent);
    if (firsImg != undefined) {
        articleHTML += `
            <div class="col-2 pl-0 d-flex align-items-center">
                <img class="mw-100" src="${firsImg.src}" style="aspect-ratio:1;">
            </div>`;
    }
    $(`div[data-articleid="${article.article.articleId}"]`).html(articleHTML);
}
var renderArticles = function (articles) {
    let articlesHTML = "";
    for (const article of articles) {
        articlesHTML +=
            `<div class="pb-3 mb-3 bottomBorder cursor-pointer d-flex justify-content-between" onclick="showModal($(this).data('articleid'))" data-articleid="${article.article.articleId}">
                
                <div class="col-10 pr-0">
                    <h4 class="m-0">${article.article.articleTitle}</h4>
                    <span data-memberId="${article.article.articleAuthor}">${article.memberNickname}</span><br>
                    <span>${shortContent(60, article.article.articleContent)}</span><br>
                    <i class="fa-solid fa-heart text-danger""></i>${article.article.articleLikesCount}
                    <i class="fa-sharp fa-solid fa-comment text-primary"></i>${article.article.articleReplyCount}
                </div>`;
        let firsImg = firstImg(article.article.articleContent);
        if (firsImg != undefined) {
            articlesHTML += `
                <div class="col-2 pl-0 d-flex align-items-center">
                    <img class="mw-100" src="${firsImg.src}" style="aspect-ratio:1;">
                </div>`;
        }
        articlesHTML += `
            </div>`;

    }
    if (scop.page == 0) $("#articles").empty();
    $("#articles").append(articlesHTML);
    if (articles.length < 10) {
        $("#articles").append('<div>查無更多資料</div>');
        $("#btnMoreArticle").prop("disabled", "true");
    }
}
// Render report reason options
var renderReport = function () {
    let reportListHTML = "";
    for (const [key, value] of Object.entries(scop.reportCodeList)) {
        reportListHTML += `
            <input name="reportOption" type="radio" id="${key}" value="${value.codeId}"><label for="${key}">${value.codeRepresent}</label><br>
        `;
    }
    reportListHTML += `<input id="reportOtherInput" type="text" class="border_bottom_Input" style="width:80%">`;
    $("#reportModalBody").html(reportListHTML);
    $("#reportOtherInput").hide();
}
// Setup community menu and show first sort
var renderMenu = function () {
    let menuHTML = "";
    for (const [key, value] of Object.entries(scop.articleCodeList)) {
        menuHTML += `<li><button class="btn btn-light" onclick="showMain('${value.codeId}','${value.codeRepresent}')">${value.codeRepresent}</button></li>`;

        // show first sort
        if (key == 0) {
            scop.articleCode = value.codeId;
            scop.articleName = value.codeRepresent;
            showMain(value.codeId, value.codeRepresent);
        }
    }
    $(".communityUl").prepend(menuHTML);
}
//#endregion

//#region call API
var uploadImage = async function (formdata) {
    // call api get related data
    let res = await SocialService.uploadImage(formdata);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return image url.
    return res.imageURL;
}
var postReport = async function (report) {
    // call api get related data
    let res = await SocialService.postReport(report);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    return true;
}
var deleteArticle = async function (articleId) {
    // call api get related data
    let res = await ArticleService.deleteArticle(articleId);
    if (!res.status.toString().startsWith("2")) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    return true;
}
var putArticle = async function (article) {
    // call api get related data
    let res = await ArticleService.putArticle(article.articleId, article);
    if (!res.status.toString().startsWith("2")) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    return true;
}
var postArticle = async function (article) {
    // call api get related data
    let res = await ArticleService.postArticle(article);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return built model for displaying
    return res;
}
var deleteReply = async function (replyId) {
    // call api get related data
    let res = await ReplyService.deleteReply(replyId);
    if (!res.status.toString().startsWith("2")) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    return true;
}
var postReply = async function (reply) {
    // call api get related data
    let res = await ReplyService.postReply(reply);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return built model for displaying the reply
    return res;
}
var deleteReplyLike = async function (replyId, memberId) {
    // call api get related data
    let res = await ReplyLikeService.deleteReplyLike(replyId, memberId);
    if (!res.status.toString().startsWith("2")) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    return true;
}
var postReplyLike = async function (replyLike) {
    // call api get related data
    let res = await ReplyLikeService.postReplyLike(replyLike);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    return true;
}
var deleteArticleLike = async function (articleId, memberId) {
    // call api get related data
    let res = await ArticleLikeService.deleteArticleLike(articleId, memberId);
    if (!res.status.toString().startsWith("2")) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    return true;
}
var postArticleLike = async function (articleLike) {
    // call api get related data
    let res = await ArticleLikeService.postArticleLike(articleLike);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    return true;
}
var getReplies = async function (articleId) {
    // call api get related data
    let res = await ReplyService.getReplies(articleId);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); scop.replies = []; return; }
    scop.replies = res;
}
var getMyArticles = async function () {
    // call api get related data
    if ($('#searchInput').val() == "") {
        articles = await ArticleSocialService.getMyArticles(scop.articleAuthorId, scop.page, $('#order').val());
        if (articles.status != undefined) { alert(`[${articles.status}]後端執行異常，請聯絡系統人員，感謝!`); return []; }
    } else {
        articles = await ArticleSocialService.getMyArticlesWithKeyword(scop.articleAuthorId, scop.page, $('#order').val(), $('#searchInput').val());
        if (articles.status != undefined) { alert(`[${articles.status}]後端執行異常，請聯絡系統人員，感謝!`); return []; }
    }
    if (scop.page == 0) scop.articles = articles;
    else {
        for (const item of articles.reaultArticles) {
            scop.articles.reaultArticles.push(item);
        }
    }
    return articles.reaultArticles;
}
var getArticles = async function () {
    // call api get related data
    if ($('#searchInput').val() == "") {
        articles = await ArticleService.getArticles(scop.articleCode, scop.page, $('#order').val());
        if (articles.status != undefined) { alert(`[${articles.status}]後端執行異常，請聯絡系統人員，感謝!`); return []; }
    } else {
        articles = await ArticleService.getArticlesWithKeyword(scop.articleCode, scop.page, $('#order').val(), $('#searchInput').val());
        if (articles.status != undefined) { alert(`[${articles.status}]後端執行異常，請聯絡系統人員，感謝!`); return []; }
    }
    if (scop.page == 0) scop.articles = articles;
    else {
        for (const item of articles) {
            scop.articles.push(item);
        }
    }
    return articles;
}
//#endregion

// Save dataURL image. Replace image src dataURL to url link.
async function dataURLToLink(html) {
    let divEltment = document.createElement("div");
    divEltment.innerHTML = `<div>${html}</div>`;
    let imgTags = divEltment.getElementsByTagName("img");
    for (const imgTag of imgTags) {
        // if it's base64.
        if (imgTag.src.startsWith("data")) {
            let file = await urlToFile(imgTag.src, 'lab.png', 'image/png');
            let articlePic = new ArticlePicTable({
                articleId: (scop.articleMode == "new") ? 0 : currentArticle().article.articleId
            });
            let formdata = new FormData();
            formdata.append("file", file);
            formdata.append("articlePic", JSON.stringify(articlePic));
            // call api save image, return url
            let result = await uploadImage(formdata);
            if (!!result) {
                let urlImg = document.createElement("img");
                urlImg.src = apiServer + result;
                imgTag.before(urlImg);
                imgTag.remove();
            }
        }
    }
    return divEltment.childNodes[0].innerHTML;
}
var currentArticle = function () {
    let articles = scop.articles;
    if (scop.articles.reaultArticles != undefined) {
        articles = scop.articles.reaultArticles;
    }
    return articles.find(a => a.article.articleId == scop.articleId);
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

    // Initial data, menu list and report list
    scop.articleCodeList = await SocialService.getCodes("L");
    if (scop.articleCodeList.status != undefined) alert(`[${scop.articleCodeList.status}]後端執行異常，請聯絡系統人員，感謝!`);
    else {
        // Setup community menu and show first sort
        renderMenu();
        // Render new article Code List
        renderSelect("newArtiCodeList", scop.articleCodeList, "codeRepresent", "codeId");
    }
    scop.reportCodeList = await SocialService.getCodes("G");
    if (scop.reportCodeList.status != undefined) alert(`[${scop.reportCodeList.status}]後端執行異常，請聯絡系統人員，感謝!`);
    else renderReport(); // Render report reason options

    //#region Event Binding
    // While report modal hide, show article Modal will come up.
    $("#reportModal").on("hide.bs.modal", function (e) {
        $("#articleModal").css("z-index", "1050");
        // reset report modal
        $("#reportOtherInput").val("");
        $("#reportOtherInput").hide();
        $("input[name='reportOption']:checked").prop("checked", false);
    });
    // While confirm modal hide, show article Modal will come up.
    $("#confirmModal").on("hide.bs.modal", function (e) {
        $("#articleModal").css("z-index", "1050");
    });
    // If input is not empty, build the new reply
    $("#replyInput").on('keypress', function (e) {
        if (e.which == 13) {
            // reply can't be empty or only space
            if ($(e.target).val().trim() == "") return;
            showNewReply();
        }
    });
    // Close the dropdown if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            $(".dropdown-content").each((index, elem) => {
                if (elem.classList.contains("show"))
                    elem.classList.remove("show");
            });
        }
    }
    // Show input of report other, if otherOption been chosen.
    $("input[name='reportOption']").on("change", function (e) {
        if (this.value == "G9") {
            $("#reportOtherInput").show();
            $("#reportOtherInput").focus();
        } else {
            $("#reportOtherInput").hide();
        }
    });
    // If #Title and #Content have value, check user don't want to reply it, and ready to loose it, while closing #articleModal.
    $("#editArticleModal").on("hide.bs.modal", function (e) {
        // new mode, check is there any value
        if (scop.articleMode == "new") {
            if ($("#editModalArticleTitle").val().trim() != "" || $("#editModalArticleContent").html().trim().replace("<div>", "").replace("</div>", "").replace("<br>", "") != "") {
                if (!confirm("有新增內容尚未送出，離開將會遺失，是否確認離開?")) {
                    e.preventDefault();
                    return;
                } else {
                    // remove draft
                    $("#editModalArticleTitle").val("");
                    $("#editModalArticleContent").html("");
                }
            }
        }
        // edit mode, check is there any change.
        if (scop.articleMode == "edit") {
            if ($("#editModalArticleTitle").val().trim() != currentArticle().article.articleTitle ||
                $("#editModalArticleContent").html().trim() != currentArticle().article.articleContent) {
                if (!confirm("內容已有異動，離開將會遺失變更，是否確認離開?")) {
                    e.preventDefault();
                    return;
                } else {
                    // remove draft
                    $("#editModalArticleTitle").val("");
                    $("#editModalArticleContent").html("");
                }
            }
            $("#articleModal").modal("show");
        }
    });
    // Initial Modal show setting
    $("#editArticleModal").on("show.bs.modal", function (e) {
        let article = scop.newArticle;
        $("#newArtiCodeList").removeAttr('disabled');
        if (scop.articleMode == "edit") {
            $("#newArtiCodeList").attr('disabled', 'disabled');
            $("#articleModal").modal("hide");
            article = currentArticle().article;
        }
        $("#editModalAuthor").children()[0].innerText = scop.loginNickname;
        $("#editModalAuthor").children()[1].innerText = scop.loginAccount;
        $("#newArtiCodeList").val(scop.articleCode);
        $("#editModalArticleTitle").val(article.articleTitle);
        $("#editModalArticleContent").html(article.articleContent);
    });
    // If #replyInput have value, check user don't want to reply it, and ready to loose it, while closing #articleModal.
    $("#articleModal").on("hide.bs.modal", function (e) {
        // check if the replyInput has a value
        if ($("#replyInput").val().trim() != "") {
            if (!confirm("有留言尚未送出，離開將會遺失，是否確認離開?")) {
                e.preventDefault();
            } else {
                // remove draft reply
                $("#replyInput").val("");
            }
        }
    });
    // Initial Modal show setting
    $("#articleModal").on("show.bs.modal", function (e) {
        let article = currentArticle();

        $("#ModalAuthor").children()[0].innerText = article.memberNickname;
        $("#ModalAuthor").children()[1].innerText = article.memberAccount;

        if (article.like) $("#ModelArticleLike").css("color", "red");
        else $("#ModelArticleLike").css("color", "rgb(108, 117, 125)");
        $("#ModelArticleLikesCount").text(article.article.articleLikesCount);
        $("#ModalArticleTitle").children()[0].innerText = article.article.articleTitle;
        $("#ModalArticleTitle").children()[1].innerText = article.article.articleLastEdit.YYYYMMDD();
        if (article.article.articleLastEdit != article.article.articleBuildTime)
            $("#ModalArticleTitle").children()[1].innerText += "(已編輯)";
        $("#ModalArticleContent").html(article.article.articleContent);
        $("#ModalArticleReplyCount").html(`共${article.article.articleReplyCount}則留言`);
        // Render modal dropdown
        renderArtiModDropdown();
    });
    // Show articles when press 'Enter' at searchinput 
    $("#searchInput").on("keypress", function (e) {
        if (e.which == 13) {
            showSearch();
        }
    });
    //#endregion

});