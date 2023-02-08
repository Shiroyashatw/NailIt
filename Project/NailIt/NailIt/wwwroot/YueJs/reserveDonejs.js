﻿
async function reserveDoneSendGet() {
	tedDiv.style.display = "none";
	contentdiv.style.display = "block";
	await YueloginCheck();
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};


	fetch("https://localhost:44308/api/YueCommentTables/" + nowMember + "/" + "A6" + "/", requestOptions)
		.then(response => response.text())
		.then(function (result) {
			myResult = result;
			reserveDone();
		})
		.catch(error => console.log('error', error));
}



function reserveDone(search=false) {
	doneData = JSON.parse(myResult);
	contentdiv.innerHTML = `<div id="innerTitle">美甲師功能＞訂單管理</div>
				<br /><br />
				<label style="margin-bottom: 1%"
					>評論建立時間&nbsp&nbsp&nbsp&nbsp&nbsp</label
				>
				<input  id="searchStart" type="date" />
				<label for="">&nbsp&nbsp&nbsp&nbsp至&nbsp&nbsp&nbsp</label>
				<input id="searchEnd" type="date" />
				<img src="../YuePic/big.jpg" width="26px" style="margin-left: 4%"  onclick="reserveDone(true)" />
				<br />
				<div
					id="removeNaildiv"
					class="tag"
					
					onclick="reserveCheckSendGet()"
				>
					預約確認
				</div>
				<div  class="tag" onclick="reserveCompleteSendGet()">進行中</div>
				<div  class="tag" onclick="reserveCancelSendGet()">已取消</div>
				<div  class="tag" onclick="reserveScoreSendGet()">待評中</div>
				<div  class="tag" onclick="reserveDoneSendGet() "style="border-bottom: solid black 2px">已評價</div>
				<hr style="border-color: black; margin-top: 0%" />
				`+ doneLoop(search);
	searchStart.value = mySearchStart;
	searchEnd.value = mySearchEnd;
}

function doneLoop(search=false) {
	if (doneData.length == 0) return `<br /><span style="padding-left:5%">目前無已評價訂單</span>`;
	var i = 0;
	var answer = "";
	var thisOrderTime = ""
	for (var x of doneData) {
		if (search) {
			if (searchStart.value == "" || searchEnd.value == "") {
				let myDate = new Date();
				let myMonth = myDate.getMonth() + 1;
				searchStart.value = "1999-01-01";
				searchEnd.value = myDate.getFullYear() + "-" + (myMonth.length > 1 ? myMonth : "0" + myMonth) + "-" + myDate.getDate();
			}
			mySearchStart = searchStart.value;
			mySearchEnd = searchEnd.value;
			if (x.order_AcceptTime < searchStart.value || x.order_AcceptTime > searchEnd.value.substring(0, 8) + (Number(searchEnd.value.substring(8)) + 1)) {
				i++;
				continue;
			}
		}
		var maniTo = "../YipLib/NailDesign.html?id=" + x.manicurist_ID;
		var picTo = x.order_Type == 0 ? maniTo : "../YipLib/product.html?=" + x.order_item;
		thisOrderId = (x.order_ID + 100000000).toString().substring(1);
		thisOrderTime = x.comment_BuildTime.substring(0, 10) + " " + x.comment_BuildTime.substring(11, 19);
		answer += `<div class="doneDiv">
					<div><span style="padding-left:2%;margin-top:10%">`+ x.manicurist_SalonName +`</span></div>`+countStar(i)+`
				    <br />
					<div style="margin-left:2%">`+ x.comment_Content+`</div>
					<span style="padding-left:2%;margin-top:10%;font-size:10px">評價時間：`+ thisOrderTime + `</span>
					<div class="row" style="background-color:lightgray;width:96%;padding-top:2%;margin-left:2%;margin-bottom:2%">
					<div style="margin-left: 3%; display: inline-block; width: 20% ;height:110px">
						<img src="../YipLib/`+ x.order_Cover + `"width="90%" height="90%" style="margin-left: 3%" onclick="javascript:location.href='` + maniTo +`'"/>
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%"  onclick="javascript:location.href='`+ picTo +`'"><b>`+ x.order_ItemName + `</b></span>
						<br />
						<span style="color: gray">`+ x.demoSet_Content + `</span>
						<br />
						
					</div>
					<div
						style="
							margin-left: 3%;
							text-align: right;
							display: inline-block;
							width: 30%;
						"
					>
						<a
							style="color:red"
							class="reserveDetail"
							href="#"
							onclick="reportComplete(`+ i +`)"
							>檢舉訂單</a><br /><br />
						<a
							class="reserveDetail"
							href="#"
							onclick="getDoneDetail(`+ i +`)"
							>訂單詳情</a><br /><br />
					</div>
				</div></div>`

	i++;
	}
	return answer;
}
function countStar(i)
{
	var myScore = doneData[i].comment_Score;
	console.log(myScore);
	var answer = `<div style="font-size:20px; margin-left:2% ;width:300px; display:inline-block">`;
	for (var j = 0; j < myScore; j++)
	{
		answer += `<span class="fa fa-star" style="color:gold;"></span>`;
	}
	for (var j = myScore + 1; j < 6; j++)
	{
		answer += `<span  class="fa fa-star-o"></span>`;
	}
	answer += "</div>";
	console.log(answer);
	return answer;
}

function getDoneDetail(i)
{
	var x = doneData[i];
	var thisOrderId = "";
	var thisOrderTime = "";
	var thisStartTime = "";
	thisOrderId = (x.order_ID + 100000000).toString().substring(1);
	thisOrderTime = x.order_OrderTime.substring(0, 10) + " " + x.order_OrderTime.substring(11, 19);
	thisStartTime = x.plan_StartTime.substring(0, 10) + " " + x.plan_StartTime.substring(11, 19);


	infoModal.innerHTML = `<div>
                <h5>已完成訂單詳請</h5> 
				<image id="Xpng" src="../YuePic/X.png" style="heigh:8%;width:8%;position:absolute;right:2%;top:2%" onclick="closeInfoModal()"></image>
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
				<span class="detailItem">預約時間：`+ thisOrderTime + `</span>
				<br />
				<span class="detailItem">預估價格：`+ x.order_Price + `</span>
				<br />
				<span class="detailItem">訂金：`+ x.order_Deposit + `</span>
				<input
							id="reserveCheckback"
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
	infoModal.style.width = "30%";
	infoModal.style.height = "62%";
	infoModal.showModal();
}

function reportDone(i)
{
	infoModal.innerHTML = `<span>檢舉事由</span> 
<select id="reportReason">
	<option value="K0">不準時</option>
	<option value="K1">反悔</option>
</select><br /><br/ ><span>檢舉詳情描述(最多兩百字)</span><br/ >
<textarea id="reportContent" style="width:95%;height:60%"></textarea><br />
<input
							style="
								border: 0cm;
								width: 28%;
								color: antiquewhite;
								background-color: black;
								margin-top:2%;
								margin-right: 7%;
								margin-left:30%;
							"
							type="button"
							value="取消"
						onclick="closeInfoModal()";
						/>
						<input
							style="
								border: 0cm;
								width: 28%;
								background-color: #ff6733;
								color: white;
							"
							type="button"
							value="預約確認"
							onclick="doneSendReport(`+ i + `)";
						/>`;
	infoModal.style.width = "37%";
	infoModal.style.height = "51%";
	infoModal.showModal();
}

async function completeSendReport(i) {
	var x = completeData[i];
	console.log(x);

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({
		"ReportBuilder": nowMember,
		"ReportTarget": x.member_ID,
		"ReportItem": x.order_ID,
		"ReportPlaceC": "D2",
		"ReportReasonC": reportReason.value,
		"ReportContent": reportContent.value,
		"ReportBuildTime": "1999-01-01",
		"ReportCheckTime": null,
		"ManagerId": null,
		"ReportResult": null,
	});


	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};


	await fetch("https://localhost:44308/api/YueReportTables/", requestOptions)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
	toastr.success("已成功送出檢舉");
	reserveDoneSendGet();
	closeInfoModal();

}