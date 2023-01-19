﻿var scoreData;
var nowStar;
var myComment;
function reserveScoreSendGet() {

	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/YueOrderTables/" + 2 + "/" + "A5" + "/", requestOptions)
		.then(response => response.text())
		.then(result => reserveScore(result))
		.catch(error => console.log('error', error));
}

function reserveScore(result)
{
	scoreData = JSON.parse(result);
	contentdiv.innerHTML = `<div id="innerTitle">美甲師功能＞訂單管理</div>
				<br /><br />
				<label style="margin-bottom: 1%"
					>訂單成立時間&nbsp&nbsp&nbsp&nbsp&nbsp</label
				>
				<input type="date" />
				<label for="">&nbsp&nbsp&nbsp&nbsp至&nbsp&nbsp&nbsp</label>
				<input type="date" />
				<img src="./YuePic/big.jpg" width="26px" style="margin-left: 4%" />
				<br />
				<div
					id="removeNaildiv"
					class="tag"
					
					onclick="reserveCheckSendGet()"
				>
					預約確認
				</div>
				<div id="itemSetdiv" class="tag" onclick="reserveCompleteSendGet()">進行中</div>
				<div id="itemSetdiv" class="tag"  onclick="reserveCancelSendGet()">已取消</div>
				<div id="itemSetdiv" class="tag" style="border-bottom: solid black 2px" onclick="reserveScoreSendGet()">待評中</div>
				<div id="itemSetdiv" class="tag" onclick="reserveDoneSendGet()">已評價</div>
				<hr style="border-color: black; margin-top: 0%" />`
		+ scoreLoop(scoreData);
}

function scoreLoop(scoreData)
{
	var i = 0;
	var thisOrderId = "";
	var answer = "";
	var thisOrderTime = "";
	for (var x of scoreData) {		
		thisOrderId = (x.order_ID + 100000000).toString().substring(1);
		thisStartTime = x.plan_StartTime.substring(0, 10) + " " + x.plan_StartTime.substring(11, 19);
		thisCompleteTime = x.order_CompleteTime.substring(0, 10) + " " + x.order_CompleteTime.substring(11, 19);
		answer += `<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 20%">
						<img src="`+ x.order_Cover + `" width="90%" style="margin-left: 3% ;height:170px;" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%"><b>`+ x.order_ItemName + `</b></span>
						<br />
						<span style="color: gray">`+ x.demoSet_Content + `</span>
						<br /><br />
						<span>訂單編號：`+ thisOrderId + `</span>
						<br />
						<span>施作時間：`+ thisStartTime + `</span>
						<br />
						<span>完成時間：`+ thisCompleteTime + `</span>
					</div>
					<div
						style="
							margin-left: 3%;
							text-align: right;
							display: inline-block;
							width: 30%;
						"
					>
						<br />
						<span> <b> 訂金：NT$`+ x.order_Deposit + ` </b> </span>
						<br /><br />
						<a
							class="reserveDetail"
							href="#"
							onclick="getScoreDetail(`+ i + `)"
							>訂單詳情</a>
						<br /><br />
						<input
							style="
								border: 0cm;
								width: 40%;
								background-color: #ff6733;
								color: white;
							"
                            onclick="reserveScoreGo(`+ i + `)"
							type="button"
							value="去評價"
						/>
					</div>
				</div>`;
	i++;
	}
	return answer;
}

function getScoreDetail(i)
{
	var x = scoreData[i];
	var thisOrderId = "";
	var thisOrderTime = "";
	var thisStartTime = "";
	var myTitle = "";
	thisOrderId = (x.order_ID + 100000000).toString().substring(1);
	thisOrderTime = x.order_AcceptTime.substring(0, 10) + " " + x.order_AcceptTime.substring(11, 19);
	thisStartTime = x.plan_StartTime.substring(0, 10) + " " + x.plan_StartTime.substring(11, 19);

	infoModal.innerHTML = `<div>
                <h5>完成訂單</h5> 
				<image id="Xpng" src="./YuePic/X.png" style="heigh:8%;width:8%;position:absolute;right:2%;top:2%" onclick="closeInfoModal()"></image>
                <hr />
                <span class="detailItem">施作項目：`+ x.order_ItemName + `</span>
				<br />
                <span class="detailItem">訂單編號：`+ thisOrderId + `</span>
				<br />
                <span class="detailItem">客戶：`+ x.member_Nickname + `</span>
				<br />
				<span class="detailItem">施作部位：`+ x.order_part + `</span>
				<br />
				<span class="detailItem">卸甲：`+ x.order_removal + `</span>
				<br />
				<span class="detailItem">施作時間：`+ thisStartTime + `</span>
				<br />
				<span class="detailItem">接受日期：`+ thisOrderTime + `</span>
				<br />
				<span class="detailItem">預估價格：`+ x.order_Price + `</span>
				<br />
				<span class="detailItem">訂金：`+ x.order_Deposit + `</span>
				<input
							id="reserveCompleteback"
							style="
								border: 0cm;
								width: 25%;
								color: antiquewhite;
								background-color: black;
								right:3%;
								bottom:3%;
								position:absolute;
							"
							onclick="closeInfoModal()"
							type="button"
							value="返回"
						/>
			</div>`;
	infoModal.showModal();
}

function reserveScoreGo(i)
{
	var x = scoreData[i];
	console.log(x);
	var thisOrderId = "";
	var thisCompleteTime = "";
	var thisStartTime = "";
	var myTitle = "";
	thisOrderId = (x.order_ID + 100000000).toString().substring(1);
	thisCompleteTime = x.order_CompleteTime.substring(0, 10) + " " + x.order_CompleteTime.substring(11, 19);
	thisStartTime = x.plan_StartTime.substring(0, 10) + " " + x.plan_StartTime.substring(11, 19);

	infoModal.innerHTML = `<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 30%">
						<img src="`+ x.order_Cover+`" width="100%" height="145px" style="margin-left: 3%" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 60%">
						<span style="font-size: 120%"><b>`+ x.order_ItemName+`</b></span>
						<br />
						<span style="color: gray">`+ x.demoSet_Content +`</span>
						<br />
						<span >客戶：`+ x.member_Nickname +`</span>
						<br />
						<span >訂單編號：`+thisOrderId+`</span>
						<br />
						<span>施作時間：`+ thisStartTime +`</span>
                        <br />
						<span>完成時間：`+ thisCompleteTime +`</span>
					</div>
					
                    <div style="font-size:25px; margin-left:4% ;width:300px; display:inline-block">
                    <span  id="star1" class="fa fa-star-o" onmouseover="starChange(`+1+`)" onclick="starSet(`+1+`)"></span>
					<span  id="star2" class="fa fa-star-o" onmouseover="starChange(`+ 2 + `)" onclick="starSet(` + 2 +`)"></span>
					<span  id="star3" class="fa fa-star-o" onmouseover="starChange(`+ 3 + `)" onclick="starSet(` + 3 +`)"></span>
					<span  id="star4" class="fa fa-star-o" onmouseover="starChange(`+ 4 + `)" onclick="starSet(` + 4 +`)"></span>
					<span  id="star5" class="fa fa-star-o" onmouseover="starChange(`+ 5 + `)" onclick="starSet(` + 5 +`)"></span>
					</div>
					<br />
                    <textarea  id= "textCommentContent"style=" margin-left:4%;margin-top:1%;margin-bottom:2%; height:120px;width:90%"></textarea>
                    <input type="button" style="
								border: 0cm;
								width: 20%;
								background-color: #ff6733;
								color: white;
								right:6%;
								bottom:3%;
								position:absolute;
							" 
								onclick="reserveScoreSendPost(`+ i+`)"		
								value="確定送出">
					<input
							style="
								border: 0cm;
								width: 20%;
								color: antiquewhite;
								background-color: black;
								right:30%;
								bottom:3%;
								position:absolute;
							"
							onclick="closeInfoModal()"
							type="button"
							value="返回"
						/>`;
	infoModal.style.width = "35%";
	infoModal.style.height = "55%";
	infoModal.showModal();
}

function starChange(i)
{
	var target;
	for (var x = 1; x <= i; x++)
	{
		target = document.getElementById("star" + x.toString())
		target.classList = "fa fa-star";
		target.style.color = "gold";	
	}
	for (var y = i+1; y <= 5; y++)
	{
		target = document.getElementById("star" + y.toString())
		target.classList = "fa fa-star-o";
		target.style.color = "black";	
	}
}

function starSet(i)
{
	var target;
	for (var x = 1; x <= i; x++) {
		target = document.getElementById("star" + x.toString());
		target.classList = "fa fa-star";
		target.style.color = "gold";
		target.onmouseover = "";
	}
	for (var y = i + 1; y <= 5; y++) {
		target = document.getElementById("star" + y.toString())
		target.classList = "fa fa-star-o";
		target.style.color = "black";
		target.onmouseover = "";
	}
	nowStar = i;
}

function reserveScoreSendPost(i)
{
	var postData = scoreData[i];
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({
		"CommentBuilder": postData.manicurist_ID,
		"CommentTarget": postData.member_ID,
		"CommentScore": nowStar,
		"CommentContent": textCommentContent.value,
		"CommentType": true,
		"CommentBuildTime": "2023-01-19T18:16:15",
		"comment_OrderID": postData.order_ID
	});
	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/YueCommentTables", requestOptions)
		.then(response => response.text())
		.then(function (result)
		{
			if (result=="true")
			{
				reserveScoreSendPut(postData.order_ID);
			} else
				console.log("出錯");
		})
		.catch(error => console.log('error', error));

}
function reserveScoreSendPut(thisOrderID)
{
	var raw = "";
	var requestOptions = {
		method: 'PUT',
		body: raw,
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/YueOrderTables/" + thisOrderID + "/A6/", requestOptions)
		.then(response => response.text())
		.then()
		.catch(error => console.log('error', error));

	setTimeout(() => {
		reserveScoreSendGet();
	}, 300)
	closeInfoModal();
	toastr.success("評論已完成");
}