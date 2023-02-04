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
		JSON.parse(myresult)[0]
		nowMember = daMember.memberId;
		nowAccount = daMember.memberAccount;
		nowNickName = daMember.memberNickname;
	}
}