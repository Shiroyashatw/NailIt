var mydata3 = new Vue({
    el: "#mydata3",
    data: {
        myID: "", pswd: "",
        login: { myID: "", pswd: "" },
        

    }
})

function plzlogin() {
    console.log(mydata3.myID)
    mydata3.login.myID = mydata3.myID;
    mydata3.login.pswd = mydata3.pswd;
    $.ajax({
        type: "post",
        async: false,
        url: "/api/Letmeinqq",
        contentType: "application/json",
        data: JSON.stringify(mydata3.login),
        success: function (e) {
            /*window.location = "/TanTanLib/html/backstage.html"*/
            mydata3.name = e;
            console.log(e);
            //var tabcontent;
            //tabcontent = document.getElementsByClassName("tabcontent");
            //for (var i = 0; i < tabcontent.length; i++) {
            //    tabcontent[i].style.display = "none";
            //}
            //tabcontent[1].style.display = "block";

        }

    });
}