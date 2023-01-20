
var mydata = new Vue({
    el: "#mydata",
    data: {
        report: [{}],
        //[{"reportId":1,"reportBuilder":1,"reportTarget":2,"reportItem":111012801,"reportPlaceC":"D3","reportReasonC":"G2","reportContent":"邪惡","reportBuildTime":"2023-01-18 20:28","reportCheckTime":"","managerId":null,"reportResult":null,"codeUseIn":"D3","codeRepresent":"設計師主頁","memberName":"田美麗","managerName":null}]
        reportput: [{ "reportResult": true, "reportId": "", "reportCheckTime": "", "managerId": "1" }],
        repertget: [{ "dateS": "2023-01-01", "dateE":"2023-01-09","reportP":"D3","reportR":null}],
        reportnum: "", reportpage: "",
        onereport: [{}],
        syscode: [{}],
        reportmodel: "",
        AAA: [],
        
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
//repertget: [{ "dateS": "2023-01-01", "dateE": "2023-01-09", "reportP": "D3", "reportR": true }],
    //var urlresult = mydata.repertget[0].reportP;  //成功
    //var urlresult = mydata.repertget[0].reportR; //null各種傳各種不行
    var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE;
    
    
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

}



//GET單一審核資料
function reviewreport(e) {
    mydata.reportmodel = e.value;
    //console.log(e);
    console.log(e.value);
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


////試圖想篩選
//function seaselrep() {

//    console.log($("#datestart").val())
//    console.log($("#dateend").val())
//    console.log($("#reptype").val())
//    console.log($("#repres").val())

//}







