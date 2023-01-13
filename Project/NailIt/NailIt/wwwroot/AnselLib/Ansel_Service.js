// 前後Server相同
 function getHost() {
     var url = window.location.href;
     var arr = url.split("/");
     return arr[0] + "//" + arr[2]
 }
 const apiServer = getHost();

// 前後Server不同，指定Server
//const apiServer = "https://localhost:44308";

//#region fetch api
function fetchGet(uri) {
    return new Promise((resolve, reject) => {
        fetch(`${apiServer}${uri}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            return res.json();
        }).then((res) => {
            resolve(res);
        }).catch((e) => {
            reject(e);
        });
    });
};
function fetchPost(uri, value) {
    return new Promise((resolve, reject) => {
        fetch(`${apiServer}${uri}`, {
            method: 'POST',
            body: JSON.stringify(value),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            return res.json();
        }).then((res) => {
            resolve(res);
        }).catch((e) => {
            reject(e);
        });
    });
};
function fetchPut(uri, value) {
    return new Promise((resolve, reject) => {
        fetch(`${apiServer}${uri}`, {
            method: 'PUT',
            body: JSON.stringify(value),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            return res;
        }).then((res) => {
            resolve(res); //回傳NoContent
        }).catch((e) => {
            reject(e);
        });
    });
};
function fetchDelete(uri) {
    return new Promise((resolve, reject) => {
        fetch(`${apiServer}${uri}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            return res;
        }).then((res) => {
            resolve(res); //回傳NoContent
        }).catch((e) => {
            reject(e);
        });
    });
};
function fetchPostMul(uri, value) {
    return new Promise((resolve, reject) => {
        fetch(`${apiServer}${uri}`, {
            method: 'POST',
            body: value, //fetch傳遞form data，不用特別設定headers下的Content-Type
        }).then((res) => {
            return res.json();
        }).then((res) => {
            resolve(res);
        }).catch((e) => {
            reject(e);
        });
    });
};
//#endregion

//#region Api Service
class SocialService {
    static getCodes(code) {
        return fetchGet(`/api/Social/GetCodeTable/${code}`);
    }
    static uploadImage(data) {
        return fetchPostMul(`/api/Social/UploadImage`, data);
    }
    static postSocialReport(data) {
        return fetchPost(`/api/Social/PostSocialReport`, data);
    }
}
class ArticleService {
    static getArticlesWithKeyword(boardSort, page, order, searchValue) {
        return fetchGet(`/api/ArticleTables/${boardSort}/${page}/${order}/${searchValue}`);
    }
    static getArticles(boardSort, page, order) {
        return fetchGet(`/api/ArticleTables/${boardSort}/${page}/${order}`);
    }
    // static getArticles(boardSort, page) {
    //     return fetchGet(`/api/ArticleTables/${boardSort}/${page}`);
    // }
    static postArticle(data) {
        return fetchPost(`/api/ArticleTables`, data);
    }
    static putArticle(id, data) {
        return fetchPut(`/api/ArticleTables/${id}`, data);
    }
    static deleteArticle(id) {
        return fetchDelete(`/api/ArticleTables/${id}`);
    }
}
class ArticleSocialService {
    static getMyArticlesWithKeyword(articleAuthorID, page, order, searchValue) {
        return fetchGet(`/api/ArticleSocial/GetMyArticles/${articleAuthorID}/${page}/${order}/${searchValue}`);
    }
    static getMyArticles(articleAuthorID, page, order) {
        return fetchGet(`/api/ArticleSocial/GetMyArticles/${articleAuthorID}/${page}/${order}`);
    }
    // static getMyArticles(articleAuthorID, page) {
    //     return fetchGet(`/api/ArticleSocial/${articleAuthorID}/${page}`);
    // }
}
class ArticleLikeService {
    static postArticleLike(data) {
        return fetchPost(`/api/ArticleLikeTables`, data);
    }
    static deleteArticleLike(id) {
        return fetchDelete(`/api/ArticleLikeTables/${id}`);
    }
}
class ReplyService {
    static getReplies(id) {
        return fetchGet(`/api/ReplyTables/${id}`);
    }
    static postReply(data) {
        return fetchPost(`/api/ReplyTables`, data);
    }
    static deleteReply(id) {
        return fetchDelete(`/api/ReplyTables/${id}`);
    }
}
class ReplyLikeService {
    static postReplyLike(data) {
        return fetchPost(`/api/ReplyLikeTables`, data);
    }
    static deleteReplyLike(id) {
        return fetchDelete(`/api/ReplyLikeTables/${id}`);
    }
}
//#endregion


//#region Model Schemas

// setup Model Schemas
function isUndefined(obj) {
    return obj == undefined;
}
function initialNum(value) {
    return isUndefined(value) ? 0 : value;
}
function initialStr(value) {
    return isUndefined(value) ? "" : value;
}
function initialDate(value) {
    return isUndefined(value) ? new Date() : value;
}
function initialBool(value) {
    return isUndefined(value) ? new false : value;
}

class ArticleTable {
    constructor(data) {
        this.ArticleId = initialNum(data.ArticleId);
        this.ArticleBoardC = initialStr(data.ArticleBoardC);
        this.ArticleAuthor = initialNum(data.ArticleAuthor);
        this.ArticleTitle = initialStr(data.ArticleTitle);
        this.ArticleReplyCount = initialNum(data.ArticleReplyCount);
        this.ArticleLikesCount = initialNum(data.ArticleLikesCount);
        this.ArticleBuildTime = initialDate(data.ArticleBuildTime);
        this.ArticleLastEdit = initialDate(data.ArticleLastEdit);
        this.ArticleContent = initialStr(data.ArticleContent);
    }
}
class ArticleLikeTable {
    constructor(data) {
        this.articleLikeId = initialNum(data.articleLikeId);
        this.articleId = initialNum(data.articleId);
        this.memberId = initialNum(data.memberId);
    }
}
class ArticlePicTable {
    constructor(data) {
        this.ArtclePicId = initialNum(data.ArtclePicId);
        this.ArticleId = initialNum(data.ArticleId);
        this.ArticlePicPath = initialStr(data.ArticlePicPath);
    }
}
class ReplyTable {
    constructor(data) {
        this.ReplyId = initialNum(data.ReplyId);
        this.ArticleId = initialNum(data.ArticleId);
        this.MemberId = initialNum(data.MemberId);
        this.ReplyContent = initialStr(data.ReplyContent);
        this.ReplyBuildTime = initialDate(data.ReplyBuildTime);
        this.ReplyLastEdit = initialDate(data.ReplyLastEdit);
        this.ReplyLikesCount = initialNum(data.ReplyLikesCount);
    }
}
class ReplyLikeTable {
    constructor(data) {
        this.ReplyLikeId = initialNum(data.ReplyLikeId);
        this.ReplyId = initialNum(data.ReplyId);
        this.MemberId = initialNum(data.MemberId);
    }
}
class ReportTable {
    constructor(data) {
        this.ReportId = initialNum(data.ReportId);
        this.ReportBuilder = initialNum(data.ReportBuilder);
        this.ReportTarget = initialNum(data.ReportTarget);
        this.ReportItem = initialNum(data.ReportItem);
        this.ReportPlaceC = initialStr(data.ReportPlaceC);
        this.ReportReasonC = initialStr(data.ReportReasonC);
        this.ReportContent = initialStr(data.ReportContent);
        this.ReportBuildTime = initialDate(data.ReportBuildTime);
        this.ReportCheckTime = initialDate(data.ReportCheckTime);
        this.ManagerId = initialNum(data.ManagerId);
        this.ReportResult = initialBool(data.ReportResult);
    }
}
//#endregion