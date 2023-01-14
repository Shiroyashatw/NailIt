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