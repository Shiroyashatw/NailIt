function ajaxcall() {
        $.ajax({
            url: "api/product/1",
            method: 'GET',
            dataType: 'json',
            async: true,

            success: res => {
                
                // 帶入 a 標籤 裡面文字 設計師工作室
                console.log(Ores);
                var Ores = res[0]['o']
                var Demosetres = res[0]['demoset']

                $('#topmanicuristSalonName').text(Ores['manicuristSalonName'])

                $('#topdemosetName').text(Demosetres['demoSetName'])
                $('#productName').text(Demosetres['demoSetName'])
                $('#demoSetPrice').text("預估價格:" + Demosetres['demoSetPrice'])
                $('#demoSetContent').text(Demosetres['demoSetContent'])

                $('#botmanicuristSalonName').text("店家/設計師名稱:" + Ores['manicuristSalonName'])
                $('#botphone').text("電話:" + Ores['manicuristSalonPhone'])
                $('#botadress').text("地址:" + Ores['manicuristAddress'])
                $('#botdemoSetDeposit').text("訂金:NT$" + Demosetres['demoSetDeposit'])

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