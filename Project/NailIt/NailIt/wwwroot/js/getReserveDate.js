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
                var reymd = $('#' + ymd)
                for (i = 0; i < res.length; i++) {
                    year = res[i]['p']['planStartTime'].substr(0, 4)
                    month = parseInt(res[i]['p']['planStartTime'].substr(5, 2))
                    date = parseInt(res[i]['p']['planStartTime'].substr(8, 2))
                    ymd = `${year}-${month}-${date}`
                    time = res[i]['p']['planStartTime'].substr(11, 5)
                    $('#' + ymd).removeClass('btnnotclick')
                }
            },
            error: err => {
                console.log(err)
            },
        });
    })
}