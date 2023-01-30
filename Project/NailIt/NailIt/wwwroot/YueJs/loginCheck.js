var nowMember;

async function YueloginCheck() {
	var theId;
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};

	await fetch("https://localhost:44308/api/LoginCheck", requestOptions)
		.then(response => response.text())
		.then(result => theId = result)
		.catch(error => console.log('error', error));

	nowMember = theId;
}