
sendGetAPI();

function sendGetAPI() {
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/OrderTables/2", requestOptions)
		.then(response => response.text())
		.then(result => reserveCheck(result))
		.catch(error => console.log('error', error));
}

//function reserveCheck() {
//	contentdiv.innerHTML = `
				
//				<div class="row" style="margin-top: 3%">
//					<div style="margin-left: 3%; display: inline-block; width: 20%">
//						<img src="./YuePic/wife1.jpg" width="90%" style="margin-left: 3%" />
//					</div>
//					<div style="margin-left: 2%; display: inline-block; width: 40%">
//						<span style="font-size: 120%"><b>兩個YOASOBI雙倍可愛</b></span>
//						<br />
//						<span style="color: gray">我腦婆熱烈預定中!!!</span>
//						<br />
//						<br />
//						<span>訂單編號：00000001</span>
//						<br />
//						<span>預約時間：2023/1/6 12:20:34</span>
//					</div>
//					<div
//						style="
//							margin-left: 3%;
//							text-align: right;
//							display: inline-block;
//							width: 30%;
//						"
//					>
//						<br />
//						<span> <b> 訂金：NT$200 </b> </span>
//						<br /><br /><br />
//						<input
//							style="
//								border: 0cm;
//								width: 40%;
//								color: antiquewhite;
//								background-color: black;
//								margin-right: 7%;
//							"
//							type="button"
//							value="取消"
//						/>
//						<input
//							style="
//								border: 0cm;
//								width: 40%;
//								background-color: #ff6733;
//								color: white;
//							"
//							type="button"
//							value="確認預約"
//						/>
//					</div>
//				</div>`;
//}
function reserveCheck(myData) {
	var goodData = JSON.parse(myData);
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
					style="border-bottom: solid black 2px"
					onclick="reserveCheck()"
				>
					預約確認
				</div>
				<div id="itemSetdiv" class="tag" onclick="completeReserve()">進行中</div>
				<div id="itemSetdiv" class="tag" onclick="cancelReserve()">已取消</div>
				<div id="itemSetdiv" class="tag" onclick="scoreReserve()">待評中</div>
				<div id="itemSetdiv" class="tag" onclick="">已評價</div>
				<hr style="border-color: black; margin-top: 0%" />`+
		        loop(goodData);
}

function loop(goodData) {
	
	var answer = "";
	for (var x of goodData) {
		console.log(x);
		answer +=`<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 20%">
						<img src="./YuePic/wife1.jpg" width="90%" style="margin-left: 3%" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%"><b>`+ x.orderItemName+`YOASOBI超可愛風</b></span>
						<br />
						<span style="color: gray">`+ x.OrderDescribe + `</span>
						<br />
						<br />
						<span>訂單編號：00000001</span>
						<br />
						<span>預約時間：2023/1/6 12:20:34</span>
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
						<span> <b> 訂金：NT$200 </b> </span>
						<br /><br /><br />
						<input
							style="
								border: 0cm;
								width: 40%;
								color: antiquewhite;
								background-color: black;
								margin-right: 7%;
							"
							type="button"
							value="取消"
						/>
						<input
							style="
								border: 0cm;
								width: 40%;
								background-color: #ff6733;
								color: white;
							"
							type="button"
							value="確認預約"
						/>
					</div>
				</div>`
	}
	return answer;
}