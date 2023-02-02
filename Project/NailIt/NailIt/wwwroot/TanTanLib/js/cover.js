var mydata2 = new Vue({
    el: "#mydata2",
    data: {
        city: [{}],
        region: [{ "ZipCode": "","AreaName":""}],
        cityselected: null,
        namesearch: "",
        color: [{}]
    }
})
//獲得所有顏色

$.ajax({
    type: "get",
    async: false,
    url: "/api/ColorTables2",
    success: function (e) {
        console.log(e);
        mydata2.color = e;


    }
})

//獲得所有城市
$.ajax({
    type: "get",
    url: "CityCountyData.json",
    async: false,
    success: function (e) {
        console.log(e);
        mydata2.city = e;
        for (let key in e) {
            $('#city').append($('<option>', {
                value: key,
                text: e[key].CityName
            }));
        

        }
    }

})
//獲得所有區域
$("#city").click(function () {
    $("#region").empty();
    $.ajax({
        type: "get",
        url: "CityCountyData.json",
        async: false,
        success: function (e) {
            console.log(e);
            
            mydata2.city = e;
            console.log(mydata2.cityselected);
            
            if (mydata2.cityselected != null) {
                console.log(mydata2.cityselected);
                
                for (var key in mydata2.city[mydata2.cityselected].AreaList) {
                    console.log(e[mydata2.cityselected].AreaList[key].AreaName)
                    
                    $('#region').append($('<option>', {
                        value: e[mydata2.cityselected].AreaList[key].ZipCode,
                        text: e[mydata2.cityselected].AreaList[key].AreaName
                    }));
                }

            }
        }
    })
});

//$("#searchButton").click(function () {
//    $("#searchB").prop("href","YiPLib/fliter.html?search=聖誕節")
//    //"/YiPLib/fliter.html?search=mydata2.namesearch"
//})






