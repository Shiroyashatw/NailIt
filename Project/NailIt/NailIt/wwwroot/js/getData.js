// 全域變數
var MID; // 設計師ID
var DSETID // 作品集ID

// 讀取當前網址 
var getUrlString = location.href;
var url = new URL(getUrlString);


// 根據前面網址抓取 撈後面參數資料 demoSet ID 進行設定
DSETID = url.searchParams.get('id');


// 抓取施作部位的Val 後續去資料庫撈值 施作項目 以及 造型
var OpartC = $('select[name="OrderPartC"]')
var OpartCval
// 施作項目
var OrderItem = $('select[name="OrderItem"]')
// 施作名稱
var OrderItemName = $('select[name="OrderItemName"]')
// 讀取基本資料 設計師資料 demoset資料 demo資料 再顯示在畫面上
function getbasicinfo() {
    $.ajax({
        url: "api/product/" + DSETID,
        method: 'GET',
        dataType: 'json',
        async: true,

        success: res => {

            // 帶入 a 標籤 裡面文字 設計師工作室
            var Ores = res[0]['o']
            var Demosetres = res[0]['demoset']

            var demoSetPartCtext = ''
            var demoSetPartC = Demosetres['demoSetPartC']

            $('input[name="ManicuristId"]').val(Ores['manicuristId']);

            // 施作部位判定
            if (demoSetPartC == "C0") {
                demoSetPartCtext = "手"
                $('select[name="OrderPartC"]').append(new Option(demoSetPartCtext, demoSetPartC));
            }
            else if (demoSetPartC == "C1") {
                demoSetPartCtext = "腳"
                $('select[name="OrderPartC"]').append(new Option(demoSetPartCtext, demoSetPartC));
            }
            else {
                demoSetPartCtext = "手、腳"
                $('select[name="OrderPartC"]').append(new Option("手", "C0"));
                $('select[name="OrderPartC"]').append(new Option("腳", "C1"));
            }

            $('.demoSetPartC').text("服務項目:" + demoSetPartCtext)

            $('select[name="OrderItem"]').append(new Option("固定項目", Demosetres['demoSetId']));
            $('select[name="OrderItemName"]').append(new Option(Demosetres['demoSetName'], Demosetres['demoSetName']));

            $('#topmanicuristSalonName').text(Ores['manicuristSalonName'])

            $('#topdemosetName').text(Demosetres['demoSetName'])
            $('#productName').text(Demosetres['demoSetName'])
            $('#demoSetPrice').text("預估價格:" + Demosetres['demoSetPrice'])
            $('#demoSetContent').text(Demosetres['demoSetContent'])

            $('#botmanicuristSalonName').text("店家/設計師名稱:" + Ores['manicuristSalonName'])
            $('.botphone').text("電話:" + Ores['manicuristSalonPhone'])
            $('#botadress').text("地址:" + Ores['manicuristAddress'])
            $('.demoSetPrice').text("預估金額:" + Demosetres['demoSetPrice']);
            $('input[name="OrderPrice"]').val(Demosetres['demoSetPrice']);
            $('.demoSetDeposit').text("訂金:NT$" + Demosetres['demoSetDeposit'])
            $('input[name="OrderDeposit"]').val(Demosetres['demoSetDeposit']);
            // 放入圖片
            $('#show_big_photo').attr("src", res[0]['demo']['demoPic'])
            var demo1 = res[0]['demo']['demoPic']
            for (var i = 0; i < res.length; i++) {
                $('.photocontainer').append(`<div class="smallphoto"><img onclick="getsrc(this)" src="${res[i]['demo']['demoPic']}" alt=""></div>`)
            }

            $('.product-tag').append(`<a href="#">${Demosetres['demoSetTag1']}</a>`)
            $('.product-tag').append(`<a href="#">${Demosetres['demoSetTag2']}</a>`)
            $('.product-tag').append(`<a href="#">${Demosetres['demoSetTag3']}</a>`)
            $('.product-tag').append(`<a href="#">${Demosetres['demoSetTag4']}</a>`)

            //console.log(demo)
            //console.log(res)
            //console.log(leg)
            //console.log(JSON.stringify(res))
            //console.log(res[0]['demoset'])
            //console.log(res[0]['demoset']['demoSetName'])
        },
        error: err => {
            console.log("無法讀取" + err)
        },
    })
}

// 設定可點選預約日期
function getReserveDate() {
    // console.log(id); // 1
    // onsole.log(typeof(id)); // string
    $('#reservebtn, .lastMonth, .nextMonth,#Sendbtn').on('click', function () {
        // 讀取的設計師ID傳回設定
        MID = $("input[name='ManicuristId']").attr('value')
        $.ajax({
            url: `api/product/${MID}/reserve`,
            method: 'GET',
            dataType: 'json',
            data: '',
            async: true,

            success: res => {

                // 2023-01-10T09:00:00
                // 重新組合 年月日
                // console.log(res.length)
                var year
                var month
                var date
                var ymd
                var time

                for (i = 0; i < res.length; i++) {
                    // 讀取出 可預約日期 被轉化 可預約時間格式
                    var ptime = res[i]['p']['planStartTime']
                    year = ptime.substr(0, 4)
                    month = parseInt(ptime.substr(5, 2))
                    date = parseInt(ptime.substr(8, 2))
                    ymd = `${year}-${month}-${date}`
                    time = ptime.substr(11, 5)
                    // 讀到有在資料庫中可預約的日期時 取消不能點選的class
                    $('#' + ymd).removeClass('btnnotclick')
                    // if(ymd == Todayymd){
                    //     $('#radio').append(`<label class="col-4"><input type="radio" name="planStartTime" value="${ptime}"><span class="round button">${time}</span></label>`)
                    // }
                }
                getReserveTime()
            },
            error: err => {
                console.log(err)
            },
        });
    })
}

// 設定可點選預約時間
function getReserveTime() {
    $('.date').on('click', function () {
        $.ajax({
            url: `api/product/${MID}/reserve`,
            method: 'GET',
            dataType: 'json',
            data: '',
            async: true,

            success: res => {
                // 2023-01-10T09:00:00
                // 重新組合 年月日
                // console.log(res.length)
                var year
                var month
                var date
                var ymd
                var time
                var hour
                // var dateid = $(this).attr('id')
                var dateid = $(this).attr('id')
                // console.log("這是" + dateid);

                // 拿到今天日期
                var today = new Date()
                // 轉換 年月日小時
                var todayy = today.getFullYear();
                var todaym = today.getMonth() + 1;
                var todayd = today.getDate();
                var todayh = today.getHours();

                $('#radio').empty()
                for (i = 0; i < res.length; i++) {
                    // 讀取出 可預約日期 被轉化 可預約時間格式
                    var ptime = res[i]['p']['planStartTime']
                    var pID = res[i]['p']['planId']
                    year = ptime.substr(0, 4)
                    month = parseInt(ptime.substr(5, 2))
                    date = parseInt(ptime.substr(8, 2))
                    // ymd 是 SQL 取出可預約日期
                    ymd = `${year}-${month}-${date}`
                    time = ptime.substr(11, 5)
                    hour = parseInt(ptime.substr(11, 2))
                    // 當前點擊的 button id = 資料庫撈出 年月日時 顯示出可預約時間
                    if (dateid == ymd) {
                        if (month < todaym) {
                            $('#radio').append(`<label class="col-4"><input class="btnnotclick" type="radio" name="planId" value="${pID}" disabled><span class="round button">${time}</span></label>`)

                        }
                        else if (month <= todaym && date < todayd) {
                            $('#radio').append(`<label class="col-4"><input class="btnnotclick" type="radio" name="planId" value="${pID}" disabled><span class="round button btnnotclick">${time}</span></label>`)

                        }
                        else if (month <= todaym && date <= todayd && hour < todayh) {
                            $('#radio').append(`<label class="col-4"><input class="btnnotclick" type="radio" name="planId" value="${pID}" disabled><span class="round button">${time}</span></label>`)
                        }
                        else {
                            $('#radio').append(`<label class="col-4"><input type="radio" name="planId" value="${pID}"><span class="round button">${time}</span></label>`)
                        }
                    }
                }
            },
            error: err => {
                console.log(err)
            },
        });
    });
}

// 傳送表單資料 商品頁面 預約送出
function postOrder() {
    // 加入時區 8小時
    var Tzdate = new Date(+new Date() + 8 * 3600 * 1000)
    // 轉換成 SQL datetime格式
    var Tztoday = Tzdate.toISOString().slice(0, 19) // .replace('T', ' ');

    $('#btnsend').on('click', function () {
        $('input[name="OrderOrderTime"]').val(Tztoday);
        $('input[name="OrderStateC"]').val("A0");

        var formdata = $('#form1').serializeArray();
        var returnArray = {}
        // var Yes = true
        for (var i = 0; i < formdata.length; i++) {
            returnArray[formdata[i]['name']] = formdata[i]['value'];
            if (formdata[i]['value'] == "true") {
                returnArray[formdata[i]['name']] = true;
            }
        }
        console.log(JSON.stringify(returnArray));
        // console.log(returnArray)
        // JSON datetime 格式
        // 2019-01-06T17:16:40
        // json bool 格式 true false
        $.ajax({
            url: "api/product",
            method: "POST",
            contentType: 'application/json',
            data: JSON.stringify(returnArray),

            success: res => {
                alert('訂單送出成功')
                Closeform()
            },
            error: err => {
                console.log("N")
            },
        });
    })
}

// 讀取設計師資料
function getManicuristData() {
    $.ajax({
        url: "api/product/MID/1",
        method: "GET",
        dataType: "json",
        async: true,

        success: res => {
            // 設計師表
            var Mres = res[0]
            $('input[name="ManicuristId"]').val(Mres['manicuristId']);

            // 施作部位直接加入
            $('select[name="OrderPartC"]').append(new Option("手", "C0"));
            $('select[name="OrderPartC"]').append(new Option("腳", "C1"));
        },
        error: res => {
            console.log("N")
        },
    })
}

function getOrderPartC() {


    $('#Sendbtn').on('click', function () {
        OpartCval = OpartC.val();
        $.ajax({
            url: `api/product/MID/service/${MID}/${OpartCval}`,
            method: "GET",
            dataType: "json",
            async: true,
            success: res => {
                // 先清空 施作項目 選項
                OrderItem.empty();
                OrderItem.append(new Option("固定項目", ""));
                // 循環帶入 該設計師ID有提供的 施作項目 服務
                for (i = 0; i < res.length; i++) {
                    var Sres = res[i]
                    OrderItem.append(new Option(Sres['serviceName'], Sres['serviceId']));
                }
                // 當施作項目 變更時 不是選擇固定項目的選項時 隱藏造型選項
                OrderItem.change(function () {
                    var itemName = OrderItem.find("option:selected").text();
                    if (OrderItem.val() != "") {
                        OrderItemName.hide();

                        OrderItemName.empty();

                        OrderItemName.append(new Option(itemName, itemName));
                    }
                    else {
                        OrderItemName.empty();
                        OrderItemName.show();
                    }
                })

                // OrderItemName.change(function(){
                //     console.log("SSS")
                // })
            },
            error: res => {

            }
        })
    })
    OpartC.change(function () {
        OpartCval = OpartC.val();
    })
}

function getDemosetData() {
    $('#Sendbtn').on('click', function () {
        OpartCval = OpartC.val();
        $.ajax({
            url: `api/product/MID/dset/${MID}/${OpartCval}`,
            method: "GET",
            dataType: "json",
            async: true,
            success: res => {
                console.log("S")
            },
            error: err => {
                console.log(err)
            },
        })
    })

}