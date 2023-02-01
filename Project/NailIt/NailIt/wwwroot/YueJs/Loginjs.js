preDo();


function preDo() {
	clickEye();
}


function clickEye() {
	if (pwInput.type === "password") {
		pwInput.type = "text";
		pwEye.src = "./YuePic/eyeopen.jpg";
	} else {
		toastr.success("開始處理");
		pwInput.type = "password";
		pwEye.src = "./YuePic/eyeclose.jpg";
	}
}

function login() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify([accountInput.value, pwInput.value]);
	var requestOptions = {
		method: 'PUT',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/YueMember/", requestOptions)
		.then(response => response.text())
		.then(function (result) {
			if ("noAC" == result)
				toastr.warning("無此帳號，請確認您輸入的帳號是否正確");
			else if ("wrongPW" == result)
				toastr.warning("密碼錯誤了呦");
			else
				toastr.success("登入成功");
		}
			).catch(error => console.log('error', error));

}
