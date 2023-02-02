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
        colors:[],
        colorstyle:[],
        tag: [{}],

    }
})
//獲得所有標籤
$.ajax({
    type: "get",
    async: false,
    url: "/api/TagTable",
    success: function (e) {
        console.log(e);
        for (let i = 0; i < 10; i++) {
            mydata2.tag.push(e[i]);
        }
        mydata2.tag.shift();
        console.log(mydata2.tag);
    }
})

//獲得所有顏色
$.ajax({
    type: "get",

    url: "/api/ColorTables2",
    success: function (e) {
        console.log(e);

        for (color in e) {
            mydata2.colors.push(e[color]);
            mydata2.colorstyle.push({ backgroundColor: e[color].colorCss });

        }
        
        mydata2.colorstyle[4] = ({ backgroundColor: "#F2F2F2", border: 'gray solid 1pt', color: 'black' });
        mydata2.colorstyle[12] = ({ backgroundImage: 'linear-gradient(to right, #ed6ea0 0%, #ec8c69 100%)' });
        mydata2.colorstyle[13] = ({ backgroundColor: "#FFFFFF", border: 'gray solid 1pt', color: 'black' });
        //"{backgroundColor:color[key].colorCss}"
        //$("div").css(("background-color" : "yellow", "font-size" : "200%"J);
        //style = "background-color:#FFFFFF;border:solid gray 1px;color: black;"
    }
});

//document.getElementById("13").style.border = "solid gray 1px";


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
                $('#region')[0].attr("selected", "true");
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






