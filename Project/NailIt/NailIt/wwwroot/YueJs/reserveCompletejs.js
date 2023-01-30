var myCompleteResult;//get到的資料轉換前
var completeData;
function reserveCompleteSendGet() {

	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};


	fetch("https://localhost:44308/api/YueOrderTables/"+2+"/"+"A1"+"/", requestOptions)
		.then(response => response.text())
		.then(function (result) {
			myCompleteResult = result;
			reserveComplete();
		})
		.catch(error => console.log('error', error));
}




function reserveComplete(search = false) {
	completeData = JSON.parse(myCompleteResult);
	contentdiv.innerHTML = `<div id="innerTitle">美甲師功能＞訂單管理</div>
				<br /><br />
				<label style="margin-bottom: 1%"
					>訂單成立時間&nbsp&nbsp&nbsp&nbsp&nbsp</label
				>
				<input  id="searchStart" type="date" />
				<label for="">&nbsp&nbsp&nbsp&nbsp至&nbsp&nbsp&nbsp</label>
				<input  id="searchEnd" type="date" />
				<img src="./YuePic/big.jpg" width="26px" style="margin-left: 4%" onclick="reserveComplete(true)" />
				<br />
				<div
					id="removeNaildiv"
					class="tag"
					onclick="reserveCheckSendGet()"
				>
					預約確認
				</div>
				<div id="itemSetdiv" style="border-bottom: solid black 2px" class="tag" onclick="reserveCompleteSendGet()">進行中</div>
				<div id="itemSetdiv" class="tag" onclick="reserveCancelSendGet()">已取消</div>
				<div id="itemSetdiv" class="tag" onclick="reserveScoreSendGet()">待評中</div>
				<div id="itemSetdiv" class="tag" onclick="reserveDoneSendGet()">已評價</div>
				<hr style="border-color: black; margin-top: 0%" />
				
				`+ completeLoop(search);
	searchStart.value = mySearchStart;
	searchEnd.value = mySearchEnd;
}
function completeLoop(search=false) {
	if (completeData.length == 0) return `<br /><span style="padding-left:5%">目前無進行中訂單</span>`;
	var i = 0;
	var thisOrderId = "";
	var answer = "";
	for (var x of completeData) {
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
		thisOrderId = (x.order_ID + 100000000).toString().substring(1);
		thisStartTime = x.plan_StartTime.substring(0, 10) + " " + x.plan_StartTime.substring(11, 19);
		answer += `<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 20%; height:170px">
						<img src="`+ x.order_Cover +`"  width="90%" height="90%" style="margin-left: 3%" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%"><b>`+ x.order_ItemName+`</b></span>
						<br />
						<span style="color: gray">`+ x.demoSet_Content+`</span>
						<br /><br />
						<span>訂單編號：`+ thisOrderId +`</span>
						<br />
						<span>預約客戶：`+ x.member_Nickname +`</span>
						<br />
						<span>施作時間：`+ thisStartTime +`</span>
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
						<span> <b> 訂金：NT$`+ x.order_Deposit+` </b> </span>
						<br /><br />
						<a
							class="reserveDetail"
							href="#"
							onclick="getCompleteDetail(`+ i +`,'see')"
							>訂單詳情</a>
						<br /><br />
						<input
							style="
								border: 0cm;
								width: 40%;
								background-color: #ff6733;
								color: white;
							"
							onclick="getCompleteDetail(`+i+`,'yes')"
							type="button"
							value="完成"
						/>
					</div>
				</div>`
	i++
	}
	return answer;
}

function getCompleteDetail(i, str) {
	var x = completeData[i];
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
				<input id="reserveCompleteYes"type="button" style="
								border: 0cm;
								width: 25%;
								background-color: #ff6733;
								color: white;
								right:3%;
								bottom:3%;
								position:absolute;
							" 
								onclick="reserveCompleteSendPut(`+ x.order_ID + `,'A2')"
								value="完成訂單" />
				<input
							id="reserveCompleteback"
							style="
								border: 0cm;
								width: 25%;
								color: antiquewhite;
								background-color: black;
								right:30%;
								bottom:3%;
								position:absolute;
							"
							onclick="closeInfoModal()"
							type="button"
							value="返回"
						/>
			</div>`;
	if (str == "see") {
		reserveCompleteYes.style.visibility = "hidden";
		reserveCompleteback.style.right = "3%";
	}
	infoModal.showModal();
}

function reserveCompleteSendPut(id, state) {
	console.log(id);
	var raw = "";
	var requestOptions = {
		method: 'PUT',
		body: raw,
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/YueOrderTables/" + id + "/" + state + "/", requestOptions)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));

	setTimeout(() => {
		reserveCompleteSendGet();
	}, 300)
	closeInfoModal();
	toastr.success("訂單已完成");
}
	