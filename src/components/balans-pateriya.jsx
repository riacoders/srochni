import { gapi } from 'gapi-script'
import { useEffect, useState } from 'react'
import { api_default } from '../services/api.service'

const cacheExpiration = 15 * 1000

const fetchData = async (
	setLoading,
	setObj,
	cache,
	apiObj,
	setCache,
	setLastFetchTime,
	lastFetchTime
) => {
	const now = Date.now()
	if (cache && now - lastFetchTime < cacheExpiration) {
		console.log('Returning cached data')
		setObj(cache)
		setLoading(false)
		return
	}

	try {
		const response = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: import.meta.env.VITE_APP_SHEETS_ID,
			range: apiObj,
			key: import.meta.env.VITE_APP_API_KEY,
		})
		const newData = response.result.values
		if (newData && newData.length > 0) {
			const newDataObj = {
				val1: newData[0][0],
				val2: newData[0][1],
				val3: newData[0][2],
				val4: newData[0][3],
				val5: newData[0][4],
				val6: newData[0][5],
				val7: newData[0][6],
				val8: newData[0][7],
			}
			setObj(newDataObj)
			setCache(newDataObj)
			setLoading(false)
			setLastFetchTime(now)
		}
	} catch (error) {
		console.log('Error fetching data: ', error)
	}
}

const BalansPateriya = () => {
	const [obj, setObj] = useState({})
	const [cache, setCache] = useState(null)
	const [loading, setLoading] = useState(true)
	const [lastFetchTime, setLastFetchTime] = useState(0)
	const [apiObj, setAPiObj] = useState(api_default.balansPateriya)

	useEffect(() => {
		const interval = setInterval(() => {
			setAPiObj(api_default.balansPateriya)
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		function initClient() {
			gapi.client
				.init({
					apiKey: import.meta.env.VITE_APP_API_KEY,
					discoveryDocs: [
						'https://sheets.googleapis.com/$discovery/rest?version=v4',
					],
				})
				.then(() => {
					fetchData(
						setLoading,
						setObj,
						cache,
						apiObj,
						setCache,
						setLastFetchTime,
						lastFetchTime
					)
				})
		}

		gapi.load('client', initClient)
	}, [cache, lastFetchTime, apiObj])

	return (
		<div className='DataCard'>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div
					className='table-container glass-card'
					style={{ flexDirection: 'column', gap: '10px' }}
				>
					<h2 className='i-title'>Elektr energiyasi balansi</h2>
					<table className='navoiy-table'>
						<thead>
							<tr>
								<th>Hudud nomi</th>
								<th>Kirib kelgan elektr energiyasi</th>
								<th>Normativ yuqolish</th>
								<th>Foydali iste'mol</th>
								<th>Amaldagi hisob kitob</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{obj.val1}</td>
								<td>{obj.val2}</td>
								<td>{obj.val3}</td>
								<td>{obj.val4}</td>
								<td>{obj.val5}</td>
							</tr>
						</tbody>
					</table>
					<div style={{ fontSize: '12px' }}>shundan</div>
					<table className='navoiy-table'>
						<thead>
							<tr>
								<th>yuridik</th>
								<th>aholi</th>
								<th>farqi</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{obj.val6}</td>
								<td>{obj.val7}</td>
								<td>{obj.val8}</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}

export default BalansPateriya
