
function completeReserve() {
	contentdiv.innerHTML = `<div id="innerTitle">美甲師功能＞訂單管理</div>
				<br /><br />
				<label style="margin-bottom: 1%"
					>訂單成立時間&nbsp&nbsp&nbsp&nbsp&nbsp</label
				>
				<input type="date" />
				<label for="">&nbsp&nbsp&nbsp&nbsp至&nbsp&nbsp&nbsp</label>
				<input type="date" />
				<img src="./big.jpg" width="26px" style="margin-left: 4%" />
				<br />
				<div
					id="removeNaildiv"
					class="tag"
					onclick="reserveCheck()"
				>
					預約確認
				</div>
				<div id="itemSetdiv" style="border-bottom: solid black 2px" class="tag" onclick="completeReserve()">進行中</div>
				<div id="itemSetdiv" class="tag" onclick="cancelReserve() ">已取消</div>
				<div id="itemSetdiv" class="tag" onclick="scoreReserve()">待評中</div>
				<div id="itemSetdiv" class="tag" onclick="">已評價</div>
				<hr style="border-color: black; margin-top: 0%" />
				<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 20%">
						<img src="./wife1.jpg" width="90%" style="margin-left: 3%" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%"><b>YOASOBI超可愛風</b></span>
						<br />
						<span style="color: gray">我腦婆熱烈預定中!!!</span>
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
								background-color: #ff6733;
								color: white;
							"
							type="button"
							value="完成"
						/>
					</div>
				</div>
				<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 20%">
						<img src="./wife1.jpg" width="90%" style="margin-left: 3%" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%"><b>兩個YOASOBI雙倍可愛</b></span>
						<br />
						<span style="color: gray">我腦婆熱烈預定中!!!</span>
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
								background-color: #ff6733;
								color: white;
							"
							type="button"
							value="完成"
						/>
					</div>
				</div>`;
}

function cancelReserve() {
	contentdiv.innerHTML = `<div id="innerTitle">美甲師功能＞訂單管理</div>
				<br /><br />
				<label style="margin-bottom: 1%"
					>訂單成立時間&nbsp&nbsp&nbsp&nbsp&nbsp</label
				>
				<input type="date" />
				<label for="">&nbsp&nbsp&nbsp&nbsp至&nbsp&nbsp&nbsp</label>
				<input type="date" />
				<img src="./big.jpg" width="26px" style="margin-left: 4%" />
				<br />
				<div
					id="removeNaildiv"
					class="tag"
					
					onclick="reserveCheck()"
				>
					預約確認
				</div>
				<div id="itemSetdiv" class="tag" onclick="completeReserve()">進行中</div>
				<div id="itemSetdiv" class="tag"style="border-bottom: solid black 2px"  onclick="cancelReserve()">已取消</div>
				<div id="itemSetdiv" class="tag" onclick="scoreReserve()">待評中</div>
				<div id="itemSetdiv" class="tag" onclick="">已評價</div>
				<hr style="border-color: black; margin-top: 0%" />
				<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 20%">
						<img src="./wife1.jpg" width="90%" style="margin-left: 3%" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%"><b>YOASOBI超可愛風</b></span>
						<br />
						<span style="color: gray">我腦婆熱烈預定中!!!</span>
						<br />
						<br />
						<span>訂單編號：00000001</span>
						<br />
						<span>取消時間：2023/1/6 12:20:34</span>
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
						
					</div>
				</div>
				<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 20%">
						<img src="./wife1.jpg" width="90%" style="margin-left: 3%" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%"><b>兩個YOASOBI雙倍可愛</b></span>
						<br />
						<span style="color: gray">我腦婆熱烈預定中!!!</span>
						<br />
						<br />
						<span>訂單編號：00000001</span>
						<br />
						<span>取消時間：2023/1/6 12:20:34</span>
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
						
					</div>
				</div>`;
}
function scoreReserve() {
	contentdiv.innerHTML = `<div id="innerTitle">美甲師功能＞訂單管理</div>
				<br /><br />
				<label style="margin-bottom: 1%"
					>訂單成立時間&nbsp&nbsp&nbsp&nbsp&nbsp</label
				>
				<input type="date" />
				<label for="">&nbsp&nbsp&nbsp&nbsp至&nbsp&nbsp&nbsp</label>
				<input type="date" />
				<img src="./big.jpg" width="26px" style="margin-left: 4%" />
				<br />
				<div
					id="removeNaildiv"
					class="tag"
					
					onclick="reserveCheck()"
				>
					預約確認
				</div>
				<div id="itemSetdiv" class="tag" onclick="completeReserve()">進行中</div>
				<div id="itemSetdiv" class="tag"  onclick="cancelReserve()">已取消</div>
				<div id="itemSetdiv" class="tag" style="border-bottom: solid black 2px" onclick="scoreReserve()">待評中</div>
				<div id="itemSetdiv" class="tag" onclick="">已評價</div>
				<hr style="border-color: black; margin-top: 0%" />
				<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 20%">
						<img src="./wife1.jpg" width="90%" style="margin-left: 3%" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%"><b>YOASOBI超可愛風</b></span>
						<br />
						<span style="color: gray">我腦婆熱烈預定中!!!</span>
						<br />
						<br />
						<span>訂單編號：00000001</span>
						<br />
						<span>取消時間：2023/1/6 12:20:34</span>
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
								background-color: #ff6733;
								color: white;
							"
                            onclick="showDialog()"
							type="button"
							value="去評價"
						/>
					</div>
				</div>
				<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 20%">
						<img src="./wife1.jpg" width="90%" style="margin-left: 3%" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%"><b>兩個YOASOBI雙倍可愛</b></span>
						<br />
						<span style="color: gray">我腦婆熱烈預定中!!!</span>
						<br />
						<br />
						<span>訂單編號：00000001</span>
						<br />
						<span>取消時間：2023/1/6 12:20:34</span>
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
								background-color: #ff6733;
								color: white;
							"
							type="button"
							value="去評價"
                            onclick="showDialog()"
						/>
					</div>
				</div>`;
}

function showDialog() {
	infoModal.innerHTML = `<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 20%">
						<img src="./wife1.jpg" width="90%" style="margin-left: 3%" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%"><b>兩個YOASOBI雙倍可愛</b></span>
						<br />
						<span style="color: gray">我腦婆熱烈預定中!!!</span>
						<br />
						<span >訂單編號：00000001</span>
						<br />
						<span>預約時間：2023/1/6 12:20:34</span>
                        <br />
						<span>完成時間：2023/1/6 12:20:34</span>
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
						<br /><br />
						
					</div>
                    <div style="font-size:25px; margin-left:4% ;width:300px;background-color: red;">
                    <span class="fa fa-star-o"></span>
<span  class="fa fa-star-o" ></span>
<span class="fa fa-star-o"></span>
<span class="fa fa-star-o"></span>
<span class="fa fa-star-o"></span>
</div>
<br />
                    <textarea style=" margin-left:4%;margin-top:2%; height:100px;width:70%">
                    </textarea>
                    <input type="button" value="確定">`;
	infoModal.showModal();
}
