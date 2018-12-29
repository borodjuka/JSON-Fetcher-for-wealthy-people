document.getElementById("fetchBtn").addEventListener("click", fetchJSON);
document.getElementById("fetchBtn").ondblclick = (e) => {
	e.preventDefault();
};

async function fetchPatient(url) {
	let result = [];
	const response = await fetch(url);
	const data = await response.json();
	const patients = data.rows;
	patients.forEach((patient) => {
		const newPatient = {
			id: patient.pat,
			scheduleId: patient.nr,
			name: patient.patName,
			birthDate: patient.patGebDatum
		};
		result.push(newPatient);
	});
	return result;
}
async function fetchTask(url) {
	const response = await fetch(url);
	const data = await response.json();
	return data.rows;
}
function parseTasks(tasks, data) {
	tasks.forEach((t) => {
		let newTask = {
			taskId: t.nr,
			scheduleId: t.kopf,
			careType: t.art,
			repetitionFrequency: t.rythmusFormated,
			description: t.name,
			visitPeriod: t.besuchName,
			rhythm: [
				isNaN(parseInt(t.mo)) ? 0 : parseInt(t.mo),
				isNaN(parseInt(t.di)) ? 0 : parseInt(t.di),
				isNaN(parseInt(t.mi)) ? 0 : parseInt(t.mi),
				isNaN(parseInt(t.do)) ? 0 : parseInt(t.do),
				isNaN(parseInt(t.fr)) ? 0 : parseInt(t.fr),
				isNaN(parseInt(t.sa)) ? 0 : parseInt(t.sa),
				isNaN(parseInt(t.so)) ? 0 : parseInt(t.so)
			]
		};
		data.tasks.push(newTask);
	});
}
function downloadData(obj) {
	const data =
		"text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
	const p = document.createElement("p");
	p.innerHTML =
		'<a href="data:' + data + '" download="data.json">download JSON</a>';
	p.childNodes[0].click();
}
async function fetchJSON(e) {
	let data = {
		patients: [],
		tasks: []
	};
	const patientFetchURL =
		"https://app.meinpflegedienst.com/leistungsplJSON.htm?_dc=1545232705642&command=list&aktiv=J&mappe=&abc=&page=1&start=0&limit=500";
	data.patients = await fetchPatient(patientFetchURL);
	for (let i = 0; i < data.patients.length; i++) {
		let taskFetchURL = `https://app.meinpflegedienst.com/leistungsplJSON.htm?_dc=1545234001992&command=listPositionenWithArt&leistungplKopf=${
			data.patients[i].scheduleId
		}&art=K&mappe=&page=1&start=0&limit=500`;
		console.log(taskFetchURL);
		let tasks = await fetchTask(taskFetchURL);
		parseTasks(tasks, data);
		taskFetchURL = `https://app.meinpflegedienst.com/leistungsplJSON.htm?_dc=1545234001992&command=listPositionenWithArt&leistungplKopf=${
			data.patients[i].scheduleId
		}&art=P&mappe=&page=1&start=0&limit=500`;
		console.log(taskFetchURL);
		tasks = await fetchTask(taskFetchURL);
		parseTasks(tasks, data);
	}
	downloadData(data);
}
