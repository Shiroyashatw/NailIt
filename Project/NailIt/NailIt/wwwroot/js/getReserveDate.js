var MID; // 設計師ID

var getUrlString = location.href;
var url = new URL(getUrlString);
// 讀取網址 抓取後面 demoSet ID 進行設定
var dsetID = url.searchParams.get('id');

function ajaxcall() {
    $.ajax({
        url: "api/product/" + dsetID,
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

function getReserveDate() {
    // console.log(id); // 1
    // onsole.log(typeof(id)); // string
    $('#reservebtn, .lastMonth, .nextMonth').on('click', function () {
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
                // var Today = new Date();
                // var Todayymd = `${Today.getFullYear()}-${(Today.getMonth()+1)}-${Today.getDate()}`
                
                for (i = 0; i < res.length; i++) {
                    // 讀取出 可預約日期 被轉化 可預約時間格式
                    var ptime = res[i]['p']['planStartTime']
                    year = ptime.substr(0, 4)
                    month = parseInt(ptime.substr(5, 2))
                    date = parseInt(ptime.substr(8, 2))
                    ymd = `${year}-${month}-${date}`
                    time = ptime.substr(11, 5)
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
                console.log("這是" + dateid);

                // 拿到今天日期
                var today = new Date()
                // 轉換 年月日小時
                var todayy = today.getFullYear();
                var todaym = today.getMonth() + 1;
                var todayd = today.getDate();
                var todayh = today.getHours();
                console.log(typeof(todaym));
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
                    console.log(typeof(hour));
                    if (dateid == ymd) {
                        if(month < todaym){
                            $('#radio').append(`<label class="col-4"><input  type="radio" name="planId" value="${pID}" disabled><span class="round button">${time}</span></label>`)
                            
                        }
                        else if (month <= todaym && date < todayd) {
                            $('#radio').append(`<label class="col-4"><input class="btnnotclick" type="radio" name="planId" value="${pID}" disabled><span class="round button">${time}</span></label>`)
                            
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

