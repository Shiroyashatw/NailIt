var mydata2 = new Vue({
    el: "#mydata2",
    data: {
        city: [{}],
        region: [{ "ZipCode": "", "AreaName": "" }],
        cityselected: null,
        regionselected:"",
        cityname:"",
        regionname: "",
        namesearch: "",
        color: [{}],
        tag: [{}],
        tagname:""
    }
})
//獲得所有標籤
$.ajax({
    type: "get",
    async: false,
    url: "/api/TagTable",
    success: function (e) {
        console.log(e);
        mydata2.tag = e;
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
        for (var i = 0; i < e.length; i++) {
            if (e[i].colorCss == "#FFFFFF") {
                /*$(".colcir")[i].css({"background-color" : "yellow"});*/
            }
        }
        //"{backgroundColor:color[key].colorCss}"
        //$("div").css(("background-color" : "yellow", "font-size" : "200%"J);
    }
})

//獲得所有城市
$.ajax({
    type: "get",
    url: "CityCountyData.json",
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
$("#city").on("change", function () {
    $("#region").empty();
    $.ajax({
        type: "get",
        url: "CityCountyData.json",
        async: false,
        success: function (e) {
            console.log(e);
            mydata2.city = e;
            console.log(mydata2.cityselected);

            if (mydata2.cityselected == "pickone") {
                $('#region').append($('<option>', {
                    text: "縣市未選取"
                }));
            } else if (mydata2.cityselected != null) {
                console.log(mydata2.cityselected);

                for (var key in mydata2.city[mydata2.cityselected].AreaList) {
                    console.log(e[mydata2.cityselected].AreaList[key].AreaName)

                    $('#region').append($('<option>', {
                        value: [key],
                        text: e[mydata2.cityselected].AreaList[key].AreaName
                    }));
                    //mydata2.cityname = e[mydata2.cityselected].AreaList[key].AreaName;
                    //console.log(mydata2.cityname);
                }
            }
        }
    });

    mydata2.cityname = mydata2.city[mydata2.cityselected].CityName;
    console.log(mydata2.cityname);
});


$("#region").on("change", function () {
    console.log(mydata2.regionselected);
    //regionname
    mydata2.regionname = mydata2.city[mydata2.cityselected].AreaList[mydata2.regionselected].AreaName;
    console.log(mydata2.regionname);
})






