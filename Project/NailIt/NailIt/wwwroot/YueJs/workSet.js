function setRemoveNail() {
  cancelbtn.style.visibility = "visible";
  removeNail1.readOnly = false;
  removeNail2.readOnly = false;
  removeNail3.readOnly = false;
  removeNail4.readOnly = false;
  console.log(removeNail4.readonly);
}
function itemSetPage() {
  contentdiv.innerHTML = `<div id="innerTitle">美甲師功能＞工作項目設定</div>
	<div
	  id="removeNaildiv"
	  class="tag"
	  style="border-bottom: solid black 2px"
	  onclick="removeNailPage()"
	>
	  卸甲設定
	</div>
	<div id="itemSetdiv" class="tag" onclick="itemSetPage();">項目設定</div>
	<hr style="border-color: black; margin-top: 0%" />

	<input
	  type="button"
	  style="
		border: 0cm;
		width: 14%;
		margin-left: 1%;
		margin-top: 1%;
		background-color: #ff6733;
		color: white;
	  "
	  value="新增項目"
	/>
	<input
	  type="button"
	  style="
		border: 0cm;
		width: 14%;
		margin-left: 1%;
		margin-top: 1%;
		color: antiquewhite;
		background-color: black;
	  "
	  value="刪除項目"
	/>
	<br /><br />
	<table>
	  <tr>
		<th style="width: 50px"></th>
		<th style="width: 100px">施作部位</th>
		<th style="width: 300px">項目名稱</th>
		<th style="width: 150px">預估金額</th>
		<th style="width: 100px">訂金</th>
		<th style="width: 150px"></th>
	  </tr>
	  <tr style="height: 60px; background-color: aliceblue">
		<td>&nbsp&nbsp&nbsp&nbsp<input type="checkbox" /></td>
		<td>
		  <input
			id="setItemInput1"
			type="text"
			value="手"
			style="
			  width: 60%;
			  background-color: aliceblue;
			  border-radius: 4px;
			  border: 0px;
			"
			readonly
		  />
		</td>
		<td>
		  <input
			id="setItemInput2"
			type="text"
			value="凝膠單色"
			style="
			  width: 80%;
			  background-color: aliceblue;
			  border-radius: 4px;
			  border: 0px;
			"
			readonly
		  />
		</td>
		<td>
		  <input
			id="setItemInput3"
			type="text"
			value="500"
			style="
			  width: 80%;
			  background-color: aliceblue;
			  border-radius: 4px;
			  border: 0px;
			"
			readonly
		  />
		</td>
		<td>
		  <input
			id="setItemInput4"
			type="text"
			value="100"
			style="
			  width: 80%;
			  background-color: aliceblue;
			  border-radius: 4px;
			  border: 0px;
			"
			readonly
		  />
		</td>
		<td>
		  <input
			id="setItemInput5"
			type="button"
			value="編輯"
			style="
			  border: 0cm;
			  width: 60%;
			  color: antiquewhite;
			  background-color: black;
			"
			onclick="setItemBtn()"
		  />
		</td>
	  </tr>
	  <tr style="height: 60px; background-color: lightgray">
		<td>&nbsp&nbsp&nbsp&nbsp<input type="checkbox" /></td>
		<td>
		  <select
			style="background-color: lightgray; border: 0px"
			disabled="true"
		  >
			<option value="hand">手</option>
			<option value="leg">腳</option>
		  </select>
		</td>
		<td>YOASOBImyWife</td>
		<td>500</td>
		<td>100</td>
		<td>
		  <input
			type="button"
			value="編輯"
			style="
			  border: 0cm;
			  width: 60%;
			  color: antiquewhite;
			  background-color: black;
			"
		  />
		</td>
	  </tr>
	</table>`;
  itemSetdiv.style.borderBottom = "solid black 2px";
  removeNaildiv.style.borderBottom = "solid black 0px";
}
function removeNailPage() {
  contentdiv.innerHTML = `<div id="innerTitle">美甲師功能＞工作項目設定</div>
				<div
					class="tag"
					style="border-bottom: solid black 2px"
					onclick="removeNailPage()"
				>
					卸甲設定
				</div>
				<div class="tag" onclick="itemSetPage();">項目設定</div>
				<hr style="border-color: black; margin-top: 0%" />
				<br />
				<div id="innerContent" class="innerContent">
					<table style="margin-left: 4%">
						<tr style="font-size: 20px">
							<th style="width: 300px; height: 70px">&nbsp &nbsp卸甲項目</th>
							<th style="width: 300px">預估價格</th>
						</tr>
						<tr style="background-color: lightgray">
							<td style="height: 50px">&nbsp &nbsp不用卸甲</td>
							<td>
								<input
									id="removeNail1"
									type="text"
									value="0"
									readonly
									style="
										border-radius: 4px;
										background-color: lightgray;
										border: 0ex;
									"
								/>
							</td>
						</tr>
						<tr style="background-color: aliceblue">
							<td style="height: 50px">&nbsp &nbsp去指甲油</td>
							<td>
								<input
									id="removeNail2"
									type="text"
									value="50"
									readonly
									style="
										border-radius: 4px;
										background-color: aliceblue;
										border: 0ex;
									"
								/>
							</td>
						</tr>
						<tr style="background-color: lightgray">
							<td style="height: 50px">&nbsp &nbsp本店卸甲</td>
							<td>
								<input
									id="removeNail3"
									type="text"
									value="0"
									readonly
									style="
										border-radius: 4px;
										background-color: lightgray;
										border: 0ex;
									"
								/>
							</td>
						</tr>
						<tr style="background-color: aliceblue">
							<td style="height: 50px">&nbsp &nbsp他店卸甲</td>
							<td>
								<input
									id="removeNail4"
									type="text"
									style="
										border-radius: 4px;
										background-color: aliceblue;
										border: 0ex;
									"
									value="100"
									readonly
								/>
							</td>
						</tr>
					</table>
					<input
						id="cancelbtn"
						type="button"
						value="取消"
						style="
							border: 0cm;
							width: 18%;
							margin-top: 5%;
							margin-left: 45%;
							color: antiquewhite;
							background-color: black;
							width: 18%;
							visibility: hidden;
						"
					/>
					<input
						type="button"
						value="修改"
						style="
							border: 0cm;
							width: 18%;
							margin-top: 5%;
							margin-left: 4%;
							background-color: #ff6733;
							color: white;
						"
						onclick="setRemoveNail()"
					/>
				</div>`;
  removeNaildiv.style.borderBottom = "solid black 2px";
  itemSetdiv.style.borderBottom = "solid black 0px";
}
function setItemBtn() {
  for (var i = 1; i < 5; i++) {
    var x = document.getElementById("setItemInput" + i);
    x.readOnly = false;
  }
  setItemInput5.value = "確定";
  setItemInput5.style.backgroundColor = "#ff6733";
  setItemInput5.onclick = "setItemCheck()";
}
function setItemCheck() {
  setItemInput5.value = "編輯";
  setItemInput5.style.backgroundColor = "black";
}
