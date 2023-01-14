// only for testing
sessionStorage.setItem("MemberId", "1");

var scop = {
    userId: sessionStorage.getItem("MemberId"), // 目前登入者
    articleCodeList: [], // 版別清單
    reportCodeList: [], // 檢舉項目清單
    articleCode: "", // ex:"L0"
    // articleName: "", // ex:"交流"
    articles: [], // 目前帶出的list of article
    articleIndex: 0, // 現在選取的article在list中的index
    page: 0, // 目前頁數
    memberId: 0, // 目前帶出的會員個人頁面
    replies: [], // 目前article的replies
}

//#region Function

//#region Action
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
// show articles of one person (my or other)
var showMyMain = async function (memberId) {
    scop.articleCode = "My";
    scop.page = 0;
    // update main area
    if (memberId == undefined) {
        $("#mainTitle").html("我的");
        memberId = scop.userId;
    }
    else $("#mainTitle").hide();
    $("#memberInfo").children().show();
    $("#btnMoreArticle").removeAttr("disabled");
    // show member info and articles
    scop.memberId = memberId;
    await getMyArticles();
    $("#avatar").addClass("d-flex align-items-center");
    $("#memberNames").children()[0].innerText = scop.articles.reaultArticles[0].memberNickname;
    $("#memberNames").children()[1].innerText = scop.articles.reaultArticles[0].memberAccount;
    $("#memberNames").children()[2].innerText = `共${scop.articles.articleCount}篇文章`;
    updateArticles(scop.articles.reaultArticles);
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
// show Modal
var showModal = async function (articleId) {
    let articles = scop.articles;
    if (scop.articles.articleCount !== undefined) {
        articles = scop.articles.reaultArticles;
    }

    scop.articleIndex = articles.findIndex((item) => item.article.articleId == articleId);
    // call and show relies
    await getReplies(articles[scop.articleIndex].article.articleId);
    updateReplaies();

    // Modal show article data
    await $("#articleModal").modal("show");
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
//#endregion

//# update functions
var updateArticles = function (articles) {
    let articlesHTML = "";
    for (const article of articles) {
        articlesHTML +=
            `<div class="mb-4 bottomBorder" onclick="showModal($(this).data('articleid'))" data-articleid="${article.article.articleId}">
                <h4 class="m-0">${article.article.articleTitle}</h4>
                <span data-memberId="${article.article.articleAuthor}">${article.memberNickname}</span><br>
                <span>${article.article.articleContent}</span><br>
                <i class="fa-solid fa-heart text-danger"></i>${article.article.articleLikesCount}
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
var updateReplaies = function () {
    let replyHTML = "";
    for (const reply of scop.replies) {
        replyHTML += `<div>
                        <div class="d-flex justify-content-between align-items-center"> <!-- Reply header -->
                            <div>
                                <span>${reply.memberNickname}</span><span>${reply.replyLastDateDiff}</span>
                            </div>
                            <div class="d-flex align-items-center">`;
        if (reply.like) { // show user already like the comment
            replyHTML += `<i class="fa-solid fa-heart text-danger"></i>`;
        } else {
            replyHTML += `<i class="fa-solid fa-heart text-secondary"></i>`;
        }
        replyHTML += `<span>${reply.reply.replyLikesCount}</span>
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>
            <div> <!-- Reply content -->
                    ${reply.reply.replyContent}
                </div>
            </div>`;
    }
    $("#ModelReplies").empty();
    $("#ModelReplies").append(replyHTML);
}
//#endregion

//#region Call API
var getReplies = async function (articleId) {
    // call api get related data
    scop.replies = await ReplyService.getReplies(articleId);
}
var getArticles = async function () {
    // call api get related data
    if ($('#searchInput').val() == "") {
        articles = await ArticleService.getArticles(scop.articleCode, scop.page, $('#order').val());
    } else {
        articles = await ArticleService.getArticlesWithKeyword(scop.articleCode, scop.page, $('#order').val(), $('#searchInput').val());
    }
    if (scop.page == 0) scop.articles = articles;
    else {
        for (const item of articles) {
            scop.articles.push(item);
        }
    }
    // console.log(articles);
    return articles;
}
var getMyArticles = async function () {
    // call api get related data
    if ($('#searchInput').val() == "") {
        articles = await ArticleSocialService.getMyArticles(scop.memberId, scop.page, $('#order').val());
    } else {
        articles = await ArticleSocialService.getMyArticlesWithKeyword(scop.memberId, scop.page, $('#order').val(), $('#searchInput').val());
    }
    if (scop.page == 0) scop.articles = articles;
    else {
        for (const item of articles.reaultArticles) {
            scop.articles.reaultArticles.push(item);
        }
    }
    return articles.reaultArticles;
}
//#endregion
//#endregion

document.addEventListener("DOMContentLoaded", async function () {

    // $('#articleModal').modal({
    //     show: true, // 預設開啟modal
    //     // backdrop: static // 點擊背景不會關閉modal
    // })

    // initial data
    scop.articleCodeList = await SocialService.getCodes("L");
    scop.reportCodeList = await SocialService.getCodes("G");

    // initial Modal show setting
    $('#articleModal').on('show.bs.modal', function (event) {
        let articles = scop.articles;
        if (scop.articles.articleCount !== undefined) {
            articles = scop.articles.reaultArticles;
        }
        let item = articles[scop.articleIndex];

        $("#ModalAuthor").children()[0].innerText = item.memberNickname;
        $("#ModalAuthor").children()[1].innerText = item.memberAccount;

        if (item.like) $("#ModelArticleLike").css("color", "red");
        $("#ModelArticleLikesCount").text(item.article.articleLikesCount);
        $("#ModalArticleTitle").children()[0].innerText = item.article.articleTitle;
        $("#ModalArticleTitle").children()[1].innerText = item.article.articleLastEdit;
        $("#ModalArticleContent").html(item.article.articleContent);
        $("#ModalArticleReplyCount").html(`共${item.article.articleReplyCount}則留言`);
    })

    // bind action, show articles when press 'Enter' at searchinput 
    $("#searchInput").on('keypress', function (e) {
        if (e.which == 13) {
            showSearch();
        }
    });

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