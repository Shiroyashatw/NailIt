

var mydata = new Vue({
    el: "#mydata",
    data: {
        report: [{}],
        reportnum: "", reportpage: "",
        //selectreport: [{ "redatestart": 1, "redateend": null, "reptype": null, "repres": null }],
        onereport: [{}],
        syscode: [{}],
        reportmodel:"",

    }
    //methods: {
    //    reviewreport: function (e) {
    //        console.log(e);
    //    }

    //}
    //methods: {
    //    seaselrep: function (){
    //        mydata.selectreport[0].redatestart = $("#datestart").val();
    //        mydata.selectreport[0].redatestart = $("#dateend").val();
    //        mydata.selectreport[0].redatestart = $("#reptype").val();
    //        mydata.selectreport[0].redatestart = $("#repres").val();
            
    //    }
    //},
   
   
})

//function seaselrep() {

//    console.log($("#datestart").val())
//    console.log($("#dateend").val())
//    console.log($("#reptype").val())
//    console.log($("#repres").val())

//}

//let selrepData = [];

//let selrepData = new Vue({
//    el: '#reptype',
//    data: reptypeData,

    
//})



//GET審核資料
$.ajax({
    type: "get",
    url: "/api/ReportTables",
    success: function (e) {
        mydata.report = e;

        //< !--審核狀態NULL=待審核, TRUE = 審核通過, FLASE = 審核不通-- >
        for (let i = 0; i < e.length; i++) {
            if (e[i].reportResult == 1) {
                mydata.report[i].reportResult = "審核通過";
            } else if (e[i].reportResult == 0) {
                mydata.report[i].reportResult = "審核不通過"
            } else {
                mydata.report[i].reportResult = "待審核"
            }

        };
        //審核總項目 跟 審核頁數
        mydata.reportnum = e.length;
        if (mydata.reportnum >= 5) {
            mydata.reportpage = Math.ceil(mydata.reportnum / 5)
        } else {
            mydata.reportpage = 1
        }
    }
    
})

function reviewreport(e) {
    mydata.reportmodel=e.value;
    $.ajax({
        type: "get",
        url: "/api/ReportTables/" + mydata.reportmodel,
        success: function (e) {
            mydata.onereport = e;
            console.log(e);
            //< !--審核狀態NULL=待審核, TRUE = 審核通過, FLASE = 審核不通-- >
            //for (let i = 0; i < e.length; i++) {
            //    if (reportResult == 1) {
            //        reportResult = "審核通過";
            //    } else if (reportResult == 0) {
            //        reportResult = "審核不通過"
            //    } else {
            //        reportResult = "待審核"
            //    }

            //};

        }
    })

};
        
        //console.log(e);
    //function seaselrep() {

//    console.log($("#datestart").val())
//    console.log($("#dateend").val())
//    console.log($("#reptype").val())
//    console.log($("#repres").val())

//}
    

//GET審核資料


//GET 代號資料表
$.ajax({
    type: "get",
    url: "/api/CodeTables",
    success: function (e) {
        mydata.syscode = e;
        //console.log(e);
    }
})




