const districts = {
	kiziltepinskiy: {
		name: 'Qiziltepa',
		info: 'Information about District 1',
	},
	karmaninskiy: {
		name: 'Karmana tumani',
		info: 'Information about District 2',
	},
	tamdimskiy: {
		name: 'Tomdi tumani',
		info: 'Information about District 3',
	},
	nuratinskiy: {
		name: 'Nurota tumani',
		info: 'Information about District 4',
	},
	uchkudukskiy: {
		name: 'Uchquduq tumani',
		info: 'Information about District 5',
	},
	hatirchinskiy: {
		name: 'Xatirchi tumani',
		info: 'Information about District 6',
	},
	kanimehskiy: {
		name: 'Konimex tumani',
		info: 'Information about District 7',
	},
	gazgan: {
		name: "G'azg'on shaharchasi",
		info: 'Information about District 8',
	},
	navbahorskiy: {
		name: 'Navbahor tumani',
		info: 'Information about District 9',
	},
	zarafshanskiy: {
		name: 'Zarafshon shahri',
		info: 'Information about District 10',
	},
	// Add more district information here
}
export default districts

// import { gapi } from 'gapi-script'

// function fetchDistrictsData() {
// 	const apiKey = 'AIzaSyANdcSG2yr_08Y8FcU2QiiuzlxMob0qw8s'
// 	const spreadsheetId = '1Si4SOvYCV4_9VdrKZr7b93tL8EXd4QvnNbSgvqHgt0Y'
// 	const range = 'Sheet1!A1:C1'
// 	const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`

// 	fetch(url)
// 		.then(response => response.json())
// 		.then(data => {
// 			const values = data.values

// 			if (values && values.length > 0) {
// 				const newDistricts = {
// 					val1: values[0][0],
// 					val2: values[0][1],
// 					val3: values[0][2],
// 				}

// 				const districts = {
// 					kiziltepinskiy: {
// 						name: 'Qiziltepa',
// 						info: `${newDistricts.val1} | ${newDistricts.val2} | ${newDistricts.val3}`,
// 					},
// 					karmaninskiy: {
// 						name: 'Karmana tumani',
// 						info: `${newDistricts.val1} | ${newDistricts.val2} | ${newDistricts.val3}`,
// 					},
// 					tamdimskiy: {
// 						name: 'Tomdi tumani',
// 						info: `${newDistricts.val1} | ${newDistricts.val2} | ${newDistricts.val3}`,
// 					},
// 					nuratinskiy: {
// 						name: 'Nurota tumani',
// 						info: `${newDistricts.val1} | ${newDistricts.val2} | ${newDistricts.val3}`,
// 					},
// 					uchkudukskiy: {
// 						name: 'Uchquduq tumani',
// 						info: `${newDistricts.val1} | ${newDistricts.val2} | ${newDistricts.val3}`,
// 					},
// 					hatirchinskiy: {
// 						name: 'Xatirchi tumani',
// 						info: `${newDistricts.val1} | ${newDistricts.val2} | ${newDistricts.val3}`,
// 					},
// 					kanimehskiy: {
// 						name: 'Konimex tumani',
// 						info: `${newDistricts.val1} | ${newDistricts.val2} | ${newDistricts.val3}`,
// 					},
// 					gazgan: {
// 						name: "G'azg'on shaharchasi",
// 						info: `${newDistricts.val1} | ${newDistricts.val2} | ${newDistricts.val3}`,
// 					},
// 					navbahorskiy: {
// 						name: 'Navbahor tumani',
// 						info: `${newDistricts.val1} | ${newDistricts.val2} | ${newDistricts.val3}`,
// 					},
// 				}

// 				console.log(districts)
// 			} else {
// 				console.log('No data found.')
// 			}
// 		})
// 		.catch(error => {
// 			console.error('Error fetching data from Google Sheets API:', error)
// 		})
// }

// // Load the Google API client library and initialize the client
// function loadClient() {
// 	const script = document.createElement('script')
// 	script.src = 'https://apis.google.com/js/api.js'
// 	script.onload = () => {
// 		gapi.load('client', fetchDistrictsData)
// 	}
// 	document.body.appendChild(script)
// }

// loadClient()
