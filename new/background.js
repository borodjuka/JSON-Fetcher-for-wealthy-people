chrome.browserAction.onClicked.addListener(downloadLeistungsPlan);

async function downloadLeistungsPlan(){
	fetchData()
	.then(rawData => transform(rawData))
	.then(newData => download(newData));	
}


async function fetchData(){
	const patientFetchURL =
	"https://app.meinpflegedienst.com/leistungsplJSON.htm?_dc=1545232705642&command=list&aktiv=J&mappe=&abc=&page=1&start=0&limit=500";

	let patientResponse = await fetch(patientFetchURL);
	let rawPatientData = await patientResponse.json();

	for (const patient of rawPatientData.rows) {
		let taskFetchURL = `https://app.meinpflegedienst.com/leistungsplJSON.htm?_dc=1545234001992&command=listPositionenWithArt&leistungplKopf=${
			patient.nr
		}&art=K&mappe=&page=1&start=0&limit=500`;
		
		const tasksForPatientResponse = await fetch(taskFetchURL);
		patient.tasks = await tasksForPatientResponse.json();		
	  }
	
	return rawPatientData;
}

async function transform(rawData){
	return rawData.rows.map(patient => {
		return {
			id: patient.pat,
			scheduleId: patient.nr,
			name: patient.patName,
			birthDate: patient.patGebDatum,
			tasks : patient.tasks.rows.map(task => {
					return {
						taskId: task.nr,
						scheduleId: task.kopf,
						careType: task.art,
						repetitionFrequency: task.rythmusFormated,
						description: task.name,
						visitPeriod: task.besuchName,
						rhythm: [
							isNaN(parseInt(task.mo)) ? 0 : parseInt(task.mo),
							isNaN(parseInt(task.di)) ? 0 : parseInt(task.di),
							isNaN(parseInt(task.mi)) ? 0 : parseInt(task.mi),
							isNaN(parseInt(task.do)) ? 0 : parseInt(task.do),
							isNaN(parseInt(task.fr)) ? 0 : parseInt(task.fr),
							isNaN(parseInt(task.sa)) ? 0 : parseInt(task.sa),
							isNaN(parseInt(task.so)) ? 0 : parseInt(task.so)
						]
					};					
				})
			};				
	  });	  
}

function download(newData){
	var blob = new Blob([JSON.stringify(newData)], {type: 'text/json'})
	chrome.downloads.download({
		url: window.URL.createObjectURL(blob),
		filename:"data.json"});
}




