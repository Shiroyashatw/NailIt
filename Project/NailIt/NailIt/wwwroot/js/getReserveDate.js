function getReserveDate() {
    $('#reservebtn, .lastMonth, .nextMonth').on('click', function () {
        $.ajax({
            url: "api/product/reserve",
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
            },
            error: err => {
                console.log(err)
            },
        });
    })
}

function getReserveTime() {
    $('.date').on('click', function () {
        // 可以讀到對應 button ID
        // alert($(this).attr('id'));
        $.ajax({
            url: "api/product/reserve",
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
                var dateid = $(this).attr('id')
                $('#radio').empty()
                for (i = 0; i < res.length; i++) {
                    // 讀取出 可預約日期 被轉化 可預約時間格式
                    var ptime = res[i]['p']['planStartTime']
                    year = ptime.substr(0, 4)
                    month = parseInt(ptime.substr(5, 2))
                    date = parseInt(ptime.substr(8, 2))
                    ymd = `${year}-${month}-${date}`
                    time = ptime.substr(11, 5)
                    if (dateid == ymd) {
                        $('#radio').append(`<label class="col-4"><input type="radio" name="planStartTime" value="${ptime}"><span class="round button">${time}</span></label>`)
                    }
                }
            },
            error: err => {
                console.log(err)
            },
        });
    })
}

