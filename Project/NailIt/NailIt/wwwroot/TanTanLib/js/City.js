var mydata2 = new Vue({
    el: "#mydata2",
    data: {
        city: [{}],
        region: [{}],
        cityselected: null,
    }
})

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

$("#region").click(function () {

    $.ajax({
        type: "get",
        url: "CityCountyData.json",
        async: true,
        success: function (e) {
            console.log(e);
            mydata2.city = e;
            console.log(mydata2.cityselected);
            if (mydata2.cityselected != null) {
                console.log(mydata2.cityselected);

                for (var key in e[mydata2.cityselected].AreaList) {
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






