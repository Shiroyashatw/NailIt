var bb = new Vue({
    el: "#allevaluate",
    data:{
        evaluatelist: [],
        evainsertlist: [{
            "commentBuilder": 1, "commentTarget": 2, "commentScore": false, "commentContent": "",
            "commentType": 0, "commentBuildTime": "2023-01-23T15:00:00", "commentOrderId": 7
        }],
        evafinlist: [],
        historyinglist: [],
        historyfinlist:[]
}
})
$.ajax({
    type: "get",
    url: "/api/OrderTED/1",
    success: function (e) {

        for (var i = 0; i < e.length; i++) {
            if (e[i].demoSetCover == null) {
                e[i].demoSetCover = e[i].manicuristPic;
            }
            e[i].orderOrderTime = e[i].orderOrderTime.replace('T', ' ');

            e[i].orderId = (e[i].orderId).toString().padStart(8, '0');
            if (e[i].orderPartC == 'C0') {
                e[i].orderPartC = "手";
            } else if (e[i].orderPartC == 'C1') {
                e[i].orderPartC = "腳";
            } else if (e[i].orderPartC == 'C2') {
                e[i].orderPartC = "手、腳";
            }
            if (e[i].orderRemovalC == 'B0') {
                e[i].orderRemovalC = "不用卸甲"
            } else if (e[i].orderRemovalC == 'B1') {
                e[i].orderRemovalC = '去指卸甲'
            } else if (e[i].orderRemovalC == 'B2') {
                e[i].orderRemovalC = '本店卸甲'
            } else if (e[i].orderRemovalC == 'B3') {
                e[i].orderRemovalC = '他店卸甲'
            }
            if (e[i].orderStateC == "A4") {
                e[i].orderCompleteTime = e[i].orderCompleteTime.replace('T', ' ');
                (bb.evaluatelist).push(e[i]);
            }
        }
    }
})
function Getevashowdetail(e) {
    var n = e.id.length;
    $("#salonname-evaing").text(bb.evaluatelist[(e.id).substr(7, n - 7)].manicuristSalonName);
    $("#number-evaing").text(bb.evaluatelist[(e.id).substr(7, n - 7)].orderId);
    $("#date-evaing").text(bb.evaluatelist[(e.id).substr(7, n - 7)].orderOrderTime);
    $("#enddate-evaing").text(bb.evaluatelist[(e.id).substr(7, n - 7)].orderCompleteTime);
    $("#part-evaing").text(bb.evaluatelist[(e.id).substr(7, n - 7)].orderPartC);
    $("#remove-evaing").text(bb.evaluatelist[(e.id).substr(7, n - 7)].orderRemovalC);
    $("#item-evaing").text(bb.evaluatelist[(e.id).substr(7, n - 7)].orderItemName);
    $("#pay-evaing").text('NT$' + bb.evaluatelist[(e.id).substr(7, n - 7)].orderPrice);
    $("#rent-evaing").text('NT$' + bb.evaluatelist[(e.id).substr(7, n - 7)].orderDeposit);
}
//新增評論
function evainsertbtn(e) {
    bb.evainsertlist[0].commentBuilder = bb.evaluatelist[e.value].memberId;
    bb.evainsertlist[0].commentTarget = bb.evaluatelist[e.value].manicuristId;
    var idd = "#commontext" + e.value;
    bb.evainsertlist[0].commentContent = $(idd).val();
    var origorderid = bb.evaluatelist[e.value].orderId;
    var num = 0;
    for (var i = 0; i < origorderid.length; i++) {
        if (origorderid[i].indexOf('0') < 0) {
            num = i;
            break;
        }
    }
    bb.evainsertlist[0].commentOrderId = parseInt((bb.evaluatelist[e.value].orderId).substr(num, origorderid.length - num));
    console.log(bb.evainsertlist[0]);
    if (confirm('是否確定要新增評論?') == true) {
        $.ajax({
            type: "POST",
            url: "/api/CommentTed",
            contentType: "application/json",
            /*  data: JSON.stringify(bb.evainsertlist[0]),*/
            data: JSON.stringify({
                "commentBuilder": bb.evainsertlist[0].commentBuilder,
                "commentTarget": bb.evainsertlist[0].commentTarget,
                "commentScore": bb.evainsertlist[0].commentScore,
                "commentContent": bb.evainsertlist[0].commentContent,
                "commentType": false,
                "commentBuildTime": "2023-01-23T15:00:00",
                "commentOrderId": bb.evainsertlist[0].commentOrderId
            }),
            success: function () {
                $.ajax({
                    type: "put",
                    url: "/api/Putcomment/" + bb.evainsertlist[0].commentOrderId,
                    contentType: "application/json",
                    data: JSON.stringify(""),
                    success: function () {

                    }
                })
                alert("新增評論成功");
                window.location = "/tedLb/tedmember.html";
            }
        })
    }
}
//會員本身完成的評論
$.ajax({
    type: "get",
    url: "/api/EvaTEDControllers/1",
    success: function (e) {

        for (var i = 0; i < e.length; i++) {
            if (e[i].demoSetCover == null) {
                e[i].demoSetCover = e[i].manicuristPic;
            }
            e[i].orderOrderTime = e[i].orderOrderTime.replace('T', ' ');

            e[i].orderId = (e[i].orderId).toString().padStart(8, '0');
            if (e[i].orderPartC == 'C0') {
                e[i].orderPartC = "手";
            } else if (e[i].orderPartC == 'C1') {
                e[i].orderPartC = "腳";
            } else if (e[i].orderPartC == 'C2') {
                e[i].orderPartC = "手、腳";
            }
            if (e[i].orderRemovalC == 'B0') {
                e[i].orderRemovalC = "不用卸甲"
            } else if (e[i].orderRemovalC == 'B1') {
                e[i].orderRemovalC = '去指卸甲'
            } else if (e[i].orderRemovalC == 'B2') {
                e[i].orderRemovalC = '本店卸甲'
            } else if (e[i].orderRemovalC == 'B3') {
                e[i].orderRemovalC = '他店卸甲'
            }
            
            if (e[i].orderStateC == 'A5') {
                e[i].orderCompleteTime = e[i].orderCompleteTime.replace('T', ' ');
                e[i].commentBuildTime = e[i].commentBuildTime.replace('T', ' ');
                e[i].commentScore = (e[i].commentScore) * 20 +'%';
                (bb.evafinlist).push(e[i]);
            }
        }
    }
})

function evafinbtnshow(e) {
    var x = (e.id).substr(10, e.id.length - 10);
    $("#salonname-evafin").text(bb.evafinlist[x].manicuristSalonName);
    $("#number-evafin").text(bb.evafinlist[x].orderId);
    $("#date-evafin").text(bb.evafinlist[x].orderOrderTime);
    $("#enddate-evafin").text(bb.evafinlist[x].orderCompleteTime);
    $("#part-evafin").text(bb.evafinlist[x].orderPartC);
    $("#remove-evafin").text(bb.evafinlist[x].orderRemovalC);
    $("#item-evafin").text(bb.evafinlist[x].orderItemName);
    $("#pay-evafin").text('NT$' + bb.evafinlist[x].orderPrice);
    $("#rent-evafin").text('NT$' + bb.evafinlist[x].orderDeposit);
}
$.ajax({
    type: "get",
    url: "/api/Commenting/1",
    success: function (e) {
        for (var i = 0; i < e.length; i++) {
            if (e[i].demoSetCover == null) {
                e[i].demoSetCover = e[i].manicuristPic;
            }
            e[i].orderOrderTime = e[i].orderOrderTime.replace('T', ' ');

            e[i].orderId = (e[i].orderId).toString().padStart(8, '0');
            if (e[i].orderPartC == 'C0') {
                e[i].orderPartC = "手";
            } else if (e[i].orderPartC == 'C1') {
                e[i].orderPartC = "腳";
            } else if (e[i].orderPartC == 'C2') {
                e[i].orderPartC = "手、腳";
            }
            if (e[i].orderRemovalC == 'B0') {
                e[i].orderRemovalC = "不用卸甲"
            } else if (e[i].orderRemovalC == 'B1') {
                e[i].orderRemovalC = '去指卸甲'
            } else if (e[i].orderRemovalC == 'B2') {
                e[i].orderRemovalC = '本店卸甲'
            } else if (e[i].orderRemovalC == 'B3') {
                e[i].orderRemovalC = '他店卸甲'
            }
            if (e[i].orderStateC == 'A4') {
                e[i].orderCompleteTime = e[i].orderCompleteTime.replace('T', ' ');
                (bb.historyinglist).push(e[i]);
            }
        }
    }
})
$.ajax({
    type: "get",
    url: "/api/commentnotice/1",
    success: function (e) {
        for (var i = 0; i < e.length; i++) {
            if (e[i].demoSetCover == null) {
                e[i].demoSetCover = e[i].manicuristPic;
            }
            e[i].orderOrderTime = e[i].orderOrderTime.replace('T', ' ');

            e[i].orderId = (e[i].orderId).toString().padStart(8, '0');
            if (e[i].orderPartC == 'C0') {
                e[i].orderPartC = "手";
            } else if (e[i].orderPartC == 'C1') {
                e[i].orderPartC = "腳";
            } else if (e[i].orderPartC == 'C2') {
                e[i].orderPartC = "手、腳";
            }
            if (e[i].orderRemovalC == 'B0') {
                e[i].orderRemovalC = "不用卸甲"
            } else if (e[i].orderRemovalC == 'B1') {
                e[i].orderRemovalC = '去指卸甲'
            } else if (e[i].orderRemovalC == 'B2') {
                e[i].orderRemovalC = '本店卸甲'
            } else if (e[i].orderRemovalC == 'B3') {
                e[i].orderRemovalC = '他店卸甲'
            }
        if (e[i].orderStateC == 'A5') {
                e[i].orderCompleteTime = e[i].orderCompleteTime.replace('T', ' ');
                e[i].commentBuildTime = e[i].commentBuildTime.replace('T', ' ');
                e[i].commentScore = (e[i].commentScore) * 20 + '%';
            (bb.historyfinlist).push(e[i]); 
            }
        }
    }
})
function noticeingbtn(e) {
    var x = (e.id).substr(9, e.id.length - 9);
    $("#salonname-noticeing").text(bb.historyinglist[x].manicuristSalonName);
    $("#number-noticeing").text(bb.historyinglist[x].orderId);
    $("#date-noticeing").text(bb.historyinglist[x].orderOrderTime);
    $("#enddate-noticeing").text(bb.historyinglist[x].orderCompleteTime);
    $("#part-noticeing").text(bb.historyinglist[x].orderPartC);
    $("#remove-noticeing").text(bb.historyinglist[x].orderRemovalC);
    $("#item-noticeing").text(bb.historyinglist[x].orderItemName);
    $("#pay-noticeing").text('NT$' + bb.historyinglist[x].orderPrice);
    $("#rent-noticeing").text('NT$' + bb.historyinglist[x].orderDeposit);
}
function noticefinbtn(e) {
    var x = (e.id).substr(9, e.id.length - 9);
    $("#salonname-noticefin").text("會員:"+bb.historyfinlist[x].memberName);
    $("#number-noticefin").text(bb.historyfinlist[x].orderId);
    $("#date-noticefin").text(bb.historyfinlist[x].orderOrderTime);
    $("#enddate-noticefin").text(bb.historyfinlist[x].orderCompleteTime);
    $("#part-noticefin").text(bb.historyfinlist[x].orderPartC);
    $("#remove-noticefin").text(bb.historyfinlist[x].orderRemovalC);
    $("#item-noticefin").text(bb.historyfinlist[x].orderItemName);
    $("#pay-noticefin").text('NT$' + bb.historyfinlist[x].orderPrice);
    $("#rent-noticefin").text('NT$' + bb.historyfinlist[x].orderDeposit);
}