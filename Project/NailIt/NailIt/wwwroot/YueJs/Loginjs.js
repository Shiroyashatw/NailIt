preDo();

function preDo() {
	clickEye();

}


function clickEye() {
	if (pwInput.type === "password") {
		pwInput.type = "text";
		pwEye.src = "./YuePic/eyeopen.jpg";
	} else {
		pwInput.type = "password";
		pwEye.src = "./YuePic/eyeclose.jpg";
	}
}

function login() {
	console.log("AAAAA");
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({
		"tuple":("SDSDSDSD","SDSDSDSD")
	});

	var requestOptions = {
		method: 'PUT',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/Member/", requestOptions)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));

}