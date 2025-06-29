import { gapi } from 'gapi-script'
import { useEffect, useState } from 'react'
import { api_default } from '../services/api.service'

const cacheExpiration = 15 * 1000

const fetchData = async (setLoading, setData, setCache, setLastFetchTime) => {
	const now = Date.now()
	try {
		const response = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: import.meta.env.VITE_APP_SHEETS_ID,
			range: api_default.table11,
			key: import.meta.env.VITE_APP_API_KEY,
		})
		const newResponse = response.result.values.map(col => ({
			val1: col[0],
			val2: col[1],
			val3: col[2],
			val4: col[3],
		}))
		setCache(newResponse)
		setLastFetchTime(now)
		setData(newResponse)
		setLoading(false)
	} catch (error) {
		console.log('Error fetching data: ', error)
		setLoading(true)
	}
}
const initClient = (setLoading, setData, apiObj, setCache, setLastFetchTime) => {
	gapi.client
		.init({
			apiKey: import.meta.env.VITE_APP_API_KEY,
			discoveryDocs: [
				'https://sheets.googleapis.com/$discovery/rest?version=v4',
			],
		})
		.then(() => {
			fetchData(setLoading, setData, apiObj, setCache, setLastFetchTime)
		})
}

const Table11 = () => {
	const [data, setData] = useState(null)
	const [cache, setCache] = useState(null)
	const [lastFetchTime, setLastFetchTime] = useState(0)
	const [loading, setLoading] = useState(true)
	const [apiObj, setAPiObj] = useState(api_default.table7)

	useEffect(() => {
		const interval = setInterval(() => {
			setAPiObj(api_default.table11)
		}, 1000)

		return () => clearInterval(interval)
	}, [apiObj])

	useEffect(() => {
		const now = Date.now()
		if (cache && now - lastFetchTime < cacheExpiration) {
			console.log('Returning cached data')
			setData(cache)
			setLoading(false)
			return
		}
		gapi.load('client', () =>
			initClient(setLoading, setData, setCache, setLastFetchTime)
		)
	}, [lastFetchTime])
	return (
		<div className='DataCard'>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div
					className='table-container glass-card'
					style={{ flexDirection: 'column', gap: '10px' }}
				>
					<h2 className='i-title'>Elektr uzatish tarmoqlari</h2>
					<table className='navoiy-table'>
						<thead>
							<tr>
								<th>"Elektr tarmoqlari nomi"</th>
								<th>Jami 0,4-110 kV elektr uzatish tarmog‘i (km)</th>
								<th>Jami 35-110 kVli PS (soni)</th>
								<th>TP soni (dona)</th>
							</tr>
						</thead>
						<tbody>
							{data.map((col, index) => (
								<tr key={index}>
									<td>{col.val1}</td>
									<td>{col.val2}</td>
									<td>{col.val3}</td>
									<td>{col.val4}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}

export default Table11
