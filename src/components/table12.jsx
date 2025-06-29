import { gapi } from 'gapi-script'
import { useEffect, useState } from 'react'
import { api_default } from '../services/api.service'

const cacheExpiration = 15 * 1000

const fetchData = async (setLoading, setData, setCache, setLastFetchTime) => {
	const now = Date.now()
	try {
		const response = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: import.meta.env.VITE_APP_SHEETS_ID,
			range: api_default.table12,
			key: import.meta.env.VITE_APP_API_KEY,
		})
		const range = response.result.values
		if (range && range.length > 0) {
			const data = {
				val1: range[0][0],
				val2: range[0][1],
				val3: range[0][2],
				val4: range[0][3],
			}
			setData(data)
			setCache(data)
			setLastFetchTime(now)
		}
	} catch (error) {
		console.log('Error fetching data: ', error)
	} finally {
		setLoading(false)
	}
}

const initClient = (setLoading, setData, setCache, setLastFetchTime) => {
	gapi.client
		.init({
			apiKey: import.meta.env.VITE_APP_API_KEY,
			discoveryDocs: [
				'https://sheets.googleapis.com/$discovery/rest?version=v4',
			],
		})
		.then(() => {
			fetchData(setLoading, setData, setCache, setLastFetchTime)
		})
}

const Table12 = () => {
	const [data, setData] = useState(null)
	const [cache, setCache] = useState(null)
	const [lastFetchTime, setLastFetchTime] = useState(0)
	const [loading, setLoading] = useState(true)

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
					style={{ flexDirection: 'column', gap: '5px' }}
				>
					<h2 className='i-title'>Aniqlangan noqonuniy holatlar</h2>
					<table className='navoiy-table'>
						<thead>
							<tr>
								<th>Hududlar nomi</th>
								<th>Soni (dona)</th>
								<th>kVt.soat</th>
								<th>So'm</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{data.val1}</td>
								<td>{data.val2}</td>
								<td>{data.val3}</td>
								<td>{data.val4}</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}

export default Table12
