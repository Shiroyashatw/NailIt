
var mydata = new Vue({
    el: "#mydata",
    data: {
        //審核
        report: [{}],
        //[{"reportId":1,"reportBuilder":1,"reportTarget":2,"reportItem":111012801,"reportPlaceC":"D3","reportReasonC":"G2","reportContent":"邪惡","reportBuildTime":"2023-01-18 20:28","reportCheckTime":"","managerId":null,"reportResult":null,"codeUseIn":"D3","codeRepresent":"設計師主頁","memberName":"田美麗","managerName":null}]
        reportput: [{ "reportResult": true, "reportId": "", "reportCheckTime": "", "managerId": "1" }],
        repertget: [{ "dateS": "1900-01-01", "dateE": "3000-01-01", "reportP": "X0", "reportR": true,"reportRN":"nu"}],
        reportnum: "", reportpage: "",
        onereport: [{}],
        syscode: [{}],
        reportmodel: "",
        AAA: [],
        //通知
        notice: [{}],
        //{ "noticeId": 1, "noticeScope": 2, "noticeTitle": "聖誕節快樂！", "noticeContent": "祝全體會員聖誕節快樂！", "noticeBuildTime": "2023-01-25T11:44:59.453", "noticePushTime": "2023-01-25T11:44:59.453", "noticeState": true },
        noticenum: "", noticepage: "",
    },
 

})

//GET審核資料表
$.ajax({
    type: "get",
    url: "/api/ReportTables",
    success: function (e) {
        mydata.report = e;
        console.log(e);

        //< !--審核狀態NULL=待審核, TRUE = 審核通過, FLASE = 審核不通-- >
        for (let i = 0; i < e.length; i++) {
            if (e[i].reportResult == 1) {
                mydata.report[i].reportResult = "審核通過";
                mydata.AAA[i] = false;

            } else if (e[i].reportResult == 0) {
                mydata.report[i].reportResult = "審核不通過";
                mydata.AAA[i] = false;

            } else {
                mydata.report[i].reportResult = "待審核";
                mydata.AAA[i] = true;
            }

        };

        //審核總項目 跟 審核頁數
        mydata.reportnum = e.length;
        if (mydata.reportnum >= 5) {
            mydata.reportpage = Math.ceil(mydata.reportnum / 5)
        } else {
            mydata.reportpage = 1
        };

    }

})

//GET條件審核資料
function seaselrep() {
    //repertget: [{ "dateS": "1900-01-01", "dateE": "3000-01-01", "reportP": "1", "reportR": true,"reportRN":""}],
    var dataS = $("#datestart").val();
    var dataE = $("#dateend").val();
    var reportP = $("#reptype").val();
    var reportR = $("#repres").val();
    var reportRN = "nu";
    console.log(dataS);
    console.log(dataE);
    console.log(reportP);
    console.log(reportR);
    console.log(reportRN);
    

    if (reportR == "0") {
        mydata.repertget[0].reportR = false;
        mydata.repertget[0].reportRN = "nuu";
    } else if (reportR == "1") {
        mydata.repertget[0].reportR = true;
        mydata.repertget[0].reportRN = "nuu";
    } else if (reportR =="NULL") { 
        mydata.repertget[0].reportRN = "wait";
        reportRN = "wait";
    }

    console.log(mydata.repertget[0].reportRN)
    //[HttpGet("condition/{dateS}/{dateE}")]
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}")]
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}")]
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}/{reportRN}")]

    //沒條件
    if (dataS == "" && dataE == "" && reportP == "" && reportR =="" && reportRN == "nu") {

        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;

    }

    //1.a.有檢舉時間 | 檢舉類型 | 審核狀態 、 b.有檢舉時間|檢舉類型 、 c.有檢舉時間|審核狀態、 d.有檢舉時間

    ////1-a.有檢舉時間 | 檢舉類型 | 審核狀態
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}")]  2023-01-01/2023-01-23/D0/true
    if (dataS.length > 0 && dataE.length > 0 && reportP.length > 1 && reportR.length ==1) {
        mydata.repertget[0].dateS = dataS;
        mydata.repertget[0].dateE = dataE;
        mydata.repertget[0].reportP = reportP;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;

    }
    //XX
    ////[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}/{reportRN}")] ----2023-01-01/2023-01-23/D0/true/null
    if (dataS.length > 0 && dataE.length > 0 && reportP.length > 1 && reportRN.length > 3) {
        mydata.repertget[0].dateS = dataS;
        mydata.repertget[0].dateE = dataE;
        mydata.repertget[0].reportP = reportP;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;

    }
    ////1-b.有檢舉時間|檢舉類型
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}")]   2023-01-01/2023-01-23/D0
    if (dataS.length > 0 && dataE.length > 0 && reportP.length > 1 && reportR.length == 0) {
        mydata.repertget[0].dateS = dataS;
        mydata.repertget[0].dateE = dataE;
        mydata.repertget[0].reportP = reportP;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }

    ////1-c.有檢舉時間|審核狀態  XX
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}/{reportRN}")]  ---reportP 不在乎 //2023-01-01/2023-01-23/1/true/null
    if (dataS.length > 0 && dataE.length > 0 && reportP.length == 1 && reportR.length > 1 && reportRN.length > 3) {
        mydata.repertget[0].dateS = dataS;
        mydata.repertget[0].dateE = dataE;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}")]  ---reportP 不在乎   2023-01-01/2023-01-23/D0/true
    else if (dataS.length > 0 && dataE.length > 0 && reportP.length == 1 && reportR.length > 2) {
        mydata.repertget[0].dateS = dataS;
        mydata.repertget[0].dateE = dataE;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR;

    }
    ////1-d.有檢舉時間
    //[HttpGet("condition/{dateS}/{dateE}")]        2023-01-01/2023-01-23
    if (dataS.length > 0 && dataE.length > 0) {
        mydata.repertget[0].dateS = dataS;
        mydata.repertget[0].dateE = dataE;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }


    //2.a.有檢舉類型|審核狀態 b.有檢舉類型
    ////1-a.有檢舉類型|審核狀態
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}")]    1900-01-01/3000-01-01/D0/true
    if (dataS.length > 0 && dataE.length > 0 && reportP.length > 0 && reportR.length == 1) {
        mydata.repertget[0].reportP = reportP;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }
    //XX
    ////[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}/{reportRN}")] ----reportR 不在乎  1900-01-01/3000-01-01/D0/true/null
    if (dataS.length > 0 && dataE.length > 0 && reportP.length > 0 && reportRN.length > 3) {
        mydata.repertget[0].reportP = reportP;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }
    ////1-b.有檢舉類型
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}")]   1900-01-01/3000-01-01/D0
    if (reportP.length > 0) {
        mydata.repertget[0].reportP = reportP;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }

    //3.有審核狀態
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}")]   1900-01-01/3000-01-01/1/true
    if (reportR.length == 1) {
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }
    //XX
    ////[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}/{reportRN}")] ----reportR 不在乎 1900-01-01/3000-01-01/1/true/null
    if (reportR.length > 1) {
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }


    console.log(urlresult);

$.ajax({
    type: "get",
    url: "/api/ReportTables/condition/" + urlresult,
    //url: "api/ReportTables/condition/{dateS}/{dateE}/{reportP}/{reportR}",
    //url:  mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR,
    success: function (e) {
        //把資料填回去
        mydata.report = e;
        console.log(e);

        for (let i = 0; i < e.length; i++) {
            if (e[i].reportResult == 1) {
                mydata.report[i].reportResult = "審核通過";
                mydata.AAA[i] = false;

            } else if (e[i].reportResult == 0) {
                mydata.report[i].reportResult = "審核不通過";
                mydata.AAA[i] = false;

            } else {
                mydata.report[i].reportResult = "待審核";
                mydata.AAA[i] = true;
            }

        };

        mydata.reportnum = e.length;
        if (mydata.reportnum >= 5) {
            mydata.reportpage = Math.ceil(mydata.reportnum / 5)
        } else {
            mydata.reportpage = 1
        };



    }

})

    mydata.repertget[0].dateS = "1900-01-01";
    mydata.repertget[0].dateE = "3000-01-01";
    mydata.repertget[0].reportP = "X0";
    mydata.repertget[0].reportR = true;
    mydata.repertget[0].reportRN = "nu";
}

//GET單一審核資料
function reviewreport(e) {
    mydata.reportmodel = e.value;
    //console.log(e);
    //console.log(e.value);
    $.ajax({
        type: "get",
        url: "/api/ReportTables/" + mydata.reportmodel,
        success: function (e) {
            mydata.onereport = e;

        }
    })

};

//GET單一審核資料
function reviewreport1(e) {
    //console.log(e.value)
    mydata.reportmodel = e.value;

    $.ajax({
        type: "get",
        url: "/api/ReportTables/" + mydata.reportmodel,
        success: function (e) {
            mydata.onereport = e;
            //< !--審核狀態NULL=待審核, TRUE = 審核通過, FLASE = 審核不通-- >
            if (mydata.onereport[0].reportResult == true) {
                mydata.onereport[0].reportResult = "審核通過";
            } else if (e.reportResult == false) {
                mydata.onereport[0].reportResult = "審核不通過"
            } else {
                mydata.onereport[0].reportResult = "待審核"
            }
        }
    })

};

//為了PUT的function
function BackVal(e) {
    console.log(e);
    console.log(e.value);
    if (e.value = "true") {
        mydata.reportput[0].reportResult = true;
    } else if (e.value = "false") {
        mydata.reportput[0].reportResult = false;
    }
}

//PUT單一審核資料
function changereviewreport(e) {

    var now = new Date().toISOString(); //待改進 要加八小時 台灣時間
    console.log(now);
    mydata.reportput[0].reportId = mydata.reportmodel;
    mydata.reportput[0].reportCheckTime = now; 
    mydata.reportput[0].managerId = 9;  
    console.log(mydata.reportput[0]);
    $.ajax({
        type: "put",
        url: "/api/ReportTables/" + mydata.reportmodel,
        contentType: "application/json",
        data: JSON.stringify(mydata.reportput[0]),
        success: function () {
            window.location = "/TanTanLib/html/backstage.html"
        }

    })

}

//GET 代號資料表
$.ajax({
    type: "get",
    url: "/api/CodeTables",
    success: function (e) {
        mydata.syscode = e;
        //console.log(e);
    }
})


//GET系統通知資料表
$.ajax({
    type: "get",
    url: "/api/NoticeTables",
    success: function (e) {
        mydata.notice = e;
        console.log(e);

        ////< !--通知狀態NULL=待審核, TRUE = 審核通過, FLASE = 審核不通-- >
        for (let i = 0; i < e.length; i++) {
            if (e[i].noticeState == true) {
                mydata.notice[i].noticeState = "已通知";

            } else if (e[i].noticeState == false) {
                mydata.notice[i].noticeState = "未通知";

            }

        };
        ////< !--通知狀態NULL=待審核, TRUE = 審核通過, FLASE = 審核不通-- >
        for (let i = 0; i < e.length; i++) {
            if (e[i].noticeScope == 0) {
                mydata.notice[i].noticeScope = "一般會員";

            } else if (e[i].noticeScope == 1) {
                mydata.notice[i].noticeScope = "店家 / 美甲師";

            } else if (e[i].noticeScope == 2) {
                mydata.notice[i].noticeScope = "全體";
            }

        };

        ////審核總項目 跟 審核頁數
        mydata.noticenum = e.length;
        if (mydata.noticenum >= 5) {
            mydata.noticepage = Math.ceil(mydata.noticenum / 5)
        } else {
            mydata.noticepage = 1
        };

    }

})