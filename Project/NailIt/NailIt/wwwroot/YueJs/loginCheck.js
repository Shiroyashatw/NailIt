var nowMember;
var nowAccount;
var nowNickName;
var daMember;
async function YueloginCheck() {
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	var myresult;
	await fetch("/api/LoginCheck", requestOptions)
		.then(response => response.text())
		.then(result => myresult = result)
		.catch(error => console.log('error', error));
	if (myresult == "") {
		nowMember = -1;
		nowAccount = -1;
		nowNickName = "";
	}
	else {
		daMember=JSON.parse(myresult)[0]
		nowMember = daMember.memberId;
		nowAccount = daMember.memberAccount;
		nowNickName = daMember.memberNickname;
	}
	headChange();
}

function headChange() {
	if (nowMember != -1) {
		huiORreg.innerText = "會員中心";
		huiORreg.href = "https://localhost:44308/tedLb/tedmember.html#";
		loginORout.innerText = "登出";
		loginORout.addEventListener("click", YueLogout, true);
	}
	else {
		huiORreg.innerText = "註冊";
		huiORreg.href = "https://localhost:44308/YueRegister.html";
		loginORout.innerText = "登入";
		loginORout.href = "https://localhost:44308/Yuelogin.html";
	}
	console.log("E03");
}

async function YueLogout()
{
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	await fetch("/api/YueLogout", requestOptions)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
	location.href("https://localhost:44308/TanTanLib/html/cover.html");
}