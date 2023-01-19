var doneData;
function reserveDoneSendGet() {
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};


	fetch("https://localhost:44308/api/YueCommentTables/" + 2 + "/" + "A6" + "/", requestOptions)
		.then(response => response.text())
		.then(result => reserveDone(result))
		.catch(error => console.log('error', error));
}



function reserveDone(result) {
	doneData = JSON.parse(result);
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
				<div  class="tag" onclick="reserveCompleteSendGet()">進行中</div>
				<div  class="tag" onclick="reserveCancelSendGet()">已取消</div>
				<div  class="tag" onclick="reserveScoreSendGet()">待評中</div>
				<div  class="tag" onclick="reserveDoneSendGet() "style="border-bottom: solid black 2px">已評價</div>
				<hr style="border-color: black; margin-top: 0%" />
				`+ doneLoop(doneData);
}

function doneLoop(doneData) {
	var i = 0;
	var thisOrderId = "";
	var answer = "";
	var thisOrderTime = ""
	for (var x of doneData) {
		thisOrderId = (x.order_ID + 100000000).toString().substring(1);
		thisOrderTime = x.order_CancelTime.substring(0, 10) + " " + x.order_CancelTime.substring(11, 19);
		answer += `<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 20% ;height:170px">
						<img src="`+ x.order_Cover +`"width="90%" height="90%" style="margin-left: 3%" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%"><b>`+ x.order_ItemName + `</b></span>
						<br />
						<span style="color: gray">`+ x.demoSet_Content + `</span>
						<br /><br /><br />
						<span>訂單編號：`+ thisOrderId + `</span>
						<br />
						<span>完成時間：`+ thisOrderTime + `</span>
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
						<br /><br /><br />
					</div>
				</div>`

	}
	return answer;
}
