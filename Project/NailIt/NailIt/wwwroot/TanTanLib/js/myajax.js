
var mydata = new Vue({
    el: "#mydata",
    data: {
        report: [{}],
        reportput: [{"reportResult": "", "reportId":"1"}],
        reportnum: "", reportpage: "",
        onereport: [{}],
        syscode: [{}],
        reportmodel: "",
        AAA: [],
        revche:"NULL",
    },
 

})

//"reportresultime": "NULL"

//methods: {
//    seaselrep: function (){
//        mydata.selectreport[0].redatestart = $("#datestart").val();
//        mydata.selectreport[0].redatestart = $("#dateend").val();
//        mydata.selectreport[0].redatestart = $("#reptype").val();
//        mydata.selectreport[0].redatestart = $("#repres").val();

//    }
//},


//GET審核資料表
$.ajax({
    type: "get",
    url: "/api/ReportTables",
    success: function (e) {
        mydata.report = e;
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
//$.ajax({
//    type: "get",
//    url: "api/ReportTables/condition",
//    success: function (e) {
        

//    }
//})

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
        url: "/api/ReportTables/1" ,
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

//PUT單一審核資料
function changereviewreport(e) {

    //v2.只改兩筆
    /*var now = Date();*/
    console.log(e);

    mydata.reportput[0].reportResult = mydata.revche;
    console.log(mydata.revche);
    mydata.reportput[0].reportId = e.value;
    console.log(mydata.reportput[0]);
//url: "/api/ReportTables/" + mydata.reportmodel,

    $.ajax({
        type: "put",
        url: "/api/ReportTables/5",
        contentType: "application/json",
        data: JSON.stringify(mydata.reportput[0]),
        success: function (e) {
            alert("OK");
           
        },
        error: function () {
            alert("NO")

        }
    })
}
    ////v1.想把所有東西丟回去
    ////console.log(e.value)
    //mydata.reportmodel = e.value;
    ////console.log(mydata.revche);
    //mydata.report[mydata.reportmodel].reportResult = mydata.revche;
    //console.log(mydata.report[mydata.reportmodel].reportResult)
    //console.log(JSON.stringify(mydata.report[mydata.reportmodel]))
    //if (mydata.onereport[0].reportResult == "審核通過") {
    //    mydata.onereport[0].reportResult = true;
    //} else if (e.reportResult == "審核不通過") {
    //    mydata.onereport[0].reportResult = false
    //} else {
    //    mydata.onereport[0].reportResult = "NULL"
    //}

    //mydata.reportput[0].reportId
    //mydata.reportmodel = e.value
    //mydata.reportput[0].reportID = e.value;
    //mydata.reportput[0].reportresult = mydata.revche;
    ////mydata.reportput[0].reportresultime = now;
    //mydata.reportput[0].managerID = "0000";
    

    //console.log(JSON.stringify(mydata.reportput))


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







