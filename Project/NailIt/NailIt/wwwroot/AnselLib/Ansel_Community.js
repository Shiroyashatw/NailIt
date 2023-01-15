// only for testing. Should get data from backend.
// sessionStorage.setItem("MemberId", "1");

var scop = {
    loginId: 0, // 目前登入者
    userName: "", // 目前登入者
    articleCodeList: [], // 版別清單
    reportCodeList: [], // 檢舉項目清單
    articleCode: "", // ex:"L0"
    // articleName: "", // ex:"交流"
    articles: [], // 目前帶出的list of article
    articleIndex: 0, // 現在選取的article在list中的index
    page: 0, // 目前頁數
    articleAuthorId: 0, // 目前帶出的文章作者或會員個人頁面
    replies: [], // 目前article的replies
}

//#region Function
//#region Action
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
    let replyIndex = scop.replies.findIndex(r => r.reply.replyId == replyId);
    let reply = scop.replies[replyIndex];
    // build a like with replyId and memberId:scop.loginId
    let replyLike = new ReplyLikeTable({
        ReplyId: replyId,
        MemberId: scop.loginId
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
        let result = await deleteReplyLike(replyLike.ReplyId, replyLike.MemberId);
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
    let article = {};
    if (scop.articles.reaultArticles == undefined) {
        article = scop.articles[scop.articleIndex];
    } else {
        article = scop.articles.reaultArticles[scop.articleIndex];
    }

    // build a like with articleId and memberId:scop.loginId
    let articleLike = new ArticleLikeTable({
        ArticleId: article.article.articleId,
        MemberId: scop.loginId
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
        let result = await deleteArticleLike(articleLike.ArticleId, articleLike.MemberId);
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
    updateTheArticle(article);
}
// show person page
var showPersonPage = function () {
    showMyMain(scop.articleAuthorId);
    // Modal hide
    $("#articleModal").modal("hide");
}
// show Modal
var showModal = async function (articleId) {
    let articles = scop.articles;
    if (scop.articles.articleCount !== undefined) {
        articles = scop.articles.reaultArticles;
    }

    scop.articleIndex = articles.findIndex((item) => item.article.articleId == articleId);
    // call and show relies
    scop.articleAuthorId = articles[scop.articleIndex].article.articleAuthor;
    await getReplies(articles[scop.articleIndex].article.articleId);
    updateReplaies();

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
        updateArticles(scop.articles.reaultArticles);
    } else {
        await getArticles();
        updateArticles(scop.articles);
    }
}
// load more 10 articles
var showMoreArticle = async function () {
    scop.page++;
    // call and show 10 more articles
    let moreArticles = [];
    if (scop.articleCode == "My") moreArticles = await getMyArticles();
    else moreArticles = await getArticles();
    updateArticles(moreArticles);
}
// show articles of one person (my or other)
var showMyMain = async function (memberId) {
    scop.articleCode = "My";
    scop.page = 0;
    // update main area
    if (memberId == undefined) {
        $("#mainTitle").html("我的");
        scop.articleAuthorId = scop.loginId;
    } else $("#mainTitle").hide();
    $("#memberInfo").children().show();
    $("#btnMoreArticle").removeAttr("disabled");
    await getMyArticles();
    $("#avatar").addClass("d-flex align-items-center");
    $("#memberNames").children()[0].innerText = scop.articles.reaultArticles[0].memberNickname;
    $("#memberNames").children()[1].innerText = scop.articles.reaultArticles[0].memberAccount;
    $("#memberNames").children()[2].innerText = `共${scop.articles.articleCount}篇文章`;
    updateArticles(scop.articles.reaultArticles);
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
    updateArticles(scop.articles);
}
//#endregion

//#region render updates
var updateReplaies = function () {
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
                <a href="#">編輯</a>
                <a href="#" class="text-danger">刪除</a>
            `;
        }
        // Only can report others reply
        else {
            replyHTML += `
                <a href="#" class="text-danger">檢舉</a>
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
    // $("#ModelReplies").empty();
    $("#ModelReplies").html(replyHTML);
}
var updateArtiModDropdown = function () {
    let dropContentHTML = ``;
    // Can edit and delete own article
    if (scop.articleAuthorId == scop.loginId) {
        dropContentHTML = `
            <a href="#">編輯</a>
            <a href="#" class="text-danger">刪除</a>`;
    }
    // Only can report others reply
    else {
        dropContentHTML = `
            <a href="#" class="text-danger">檢舉</a>`;
    }
    $("#ArtiModDropContent").html(dropContentHTML);
};
var updateTheArticle = function (article) {
    let articleHTML = `
        <h4 class="m-0">${article.article.articleTitle}</h4>
        <span data-memberId="${article.article.articleAuthor}">${article.memberNickname}</span><br>
        <span>${article.article.articleContent}</span><br>
        <i class="fa-solid fa-heart text-danger""></i>${article.article.articleLikesCount}
        <i class="fa-sharp fa-solid fa-comment text-primary"></i>${article.article.articleReplyCount}`;
    $(`div[data-articleid="${article.article.articleId}"]`).html(articleHTML);
}
var updateArticles = function (articles) {
    let articlesHTML = "";
    for (const article of articles) {
        articlesHTML +=
            `<div class="mb-4 bottomBorder cursor-pointer" onclick="showModal($(this).data('articleid'))" data-articleid="${article.article.articleId}">
                <h4 class="m-0">${article.article.articleTitle}</h4>
                <span data-memberId="${article.article.articleAuthor}">${article.memberNickname}</span><br>
                <span>${article.article.articleContent}</span><br>
                <i class="fa-solid fa-heart text-danger""></i>${article.article.articleLikesCount}
                <i class="fa-sharp fa-solid fa-comment text-primary"></i>${article.article.articleReplyCount}
            </div>`;
    }
    if (scop.page == 0) $("#articles").empty();
    $("#articles").append(articlesHTML);
    if (articles.length < 10) {
        $("#articles").append('<div>查無更多資料</div>');
        $("#btnMoreArticle").prop("disabled", "true");
    }
}
//#endregion

//#region call API
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
//#endregion

document.addEventListener("DOMContentLoaded", async function () {
    scop.loginId = $("#loginId").val();
    scop.userName = $("#userName").val();
    scop.articleAuthorId = scop.loginId;
    console.log(scop.loginId, scop.userName, scop.articleAuthorId);

    // initial data
    scop.articleCodeList = await SocialService.getCodes("L");
    if (scop.articleCodeList.status != undefined) alert(`[${scop.articleCodeList.status}]後端執行異常，請聯絡系統人員，感謝!`);
    scop.reportCodeList = await SocialService.getCodes("G");
    if (scop.reportCodeList.status != undefined) alert(`[${scop.reportCodeList.status}]後端執行異常，請聯絡系統人員，感謝!`);

    //#region Event Binding
    // Close the dropdown if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            $(".dropdown-content").each((index, elem) => {
                if (elem.classList.contains("show"))
                    elem.classList.remove("show");
            });
        }
    }
    // Initial Modal show setting
    $('#articleModal').on('show.bs.modal', function (event) {
        let articles = scop.articles;
        if (scop.articles.articleCount !== undefined) {
            articles = scop.articles.reaultArticles;
        }
        let article = articles[scop.articleIndex];

        $("#ModalAuthor").children()[0].innerText = article.memberNickname;
        $("#ModalAuthor").children()[1].innerText = article.memberAccount;

        if (article.like) $("#ModelArticleLike").css("color", "red");
        else $("#ModelArticleLike").css("color", "rgb(108, 117, 125)");
        $("#ModelArticleLikesCount").text(article.article.articleLikesCount);
        $("#ModalArticleTitle").children()[0].innerText = article.article.articleTitle;
        $("#ModalArticleTitle").children()[1].innerText = article.article.articleLastEdit;
        $("#ModalArticleContent").html(article.article.articleContent);
        $("#ModalArticleReplyCount").html(`共${article.article.articleReplyCount}則留言`);
        // Render nodal dropdown
        updateArtiModDropdown();
    })

    // Bind action, show articles when press 'Enter' at searchinput 
    $("#searchInput").on('keypress', function (e) {
        if (e.which == 13) {
            showSearch();
        }
    });
    //#endregion

    //#region setup community menu and show first sort
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
    //#endregion

});