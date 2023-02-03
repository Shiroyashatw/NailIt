var nowMember;
var nowAccount;
var nowNickName;
var daMember;
async function YueloginCheck() {
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};

	await fetch("/api/LoginCheck", requestOptions)
		.then(response => response.text())
		.then(result => daMember = JSON.parse(result)[0])
		.catch(error => console.log('error', error));
	nowMember = daMember.memberId;
	
	nowAccount = daMember.memberAccount;
	nowNickName = daMember.memberNickname;
}