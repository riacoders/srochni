import { gapi } from 'gapi-script'
import { useEffect, useState } from 'react'
import { api_default } from '../services/api.service'

const cacheExpiration = 15 * 1000

const fetchData = async (
	setLoading,
	setData,
	cache,
	setCache,
	lastFetchTime,
	setLastFetchTime
) => {
	const now = Date.now()
	if (cache && now - lastFetchTime < cacheExpiration) {
		console.log('Returning cached data')
		setData(cache)
		setLoading(false)
		return
	}

	try {
		const response = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: import.meta.env.VITE_APP_SHEETS_ID,
			range: api_default.dailyIn,
			key: import.meta.env.VITE_APP_API_KEY,
		})
		const newResData = response.result.values.map(row => ({
			name: row[0],
			hourly: row[1],
			daily: row[2],
			monthly: row[3],
		}))
		setCache(newResData)
		setLastFetchTime(now)
		setData(newResData)
	} catch (error) {
		console.log('Error fetching data: ', error)
	} finally {
		setLoading(false)
	}
}

const DailyIn = () => {
	const [data, setData] = useState([])
	const [cache, setCache] = useState(null)
	const [loading, setLoading] = useState(true)
	const [lastFetchTime, setLastFetchTime] = useState(0)

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
						setData,
						cache,
						setCache,
						lastFetchTime,
						setLastFetchTime
					)
				})
		}

		gapi.load('client', initClient)
	}, []) // Removed dependencies to prevent unnecessary re-renders

	return (
		<div className='DataCard'>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div
					className='table-container glass-card'
					style={{ flexDirection: 'column', gap: '5px' }}
				>
					<h2 className='i-title'>Mablag‘ undirilishi darajasi (mln so'm)</h2>
					<table className='navoiy-table'>
						<thead>
							<tr>
								<th></th>
								<th>Hisobot kunidagi yetkazib berilgan tovar (mln so'm)</th>
								<th>Hisobot kunidagi undirilgan (mln so'm)</th>
								<th width='20%'>Farqi (mln so'm)</th>
							</tr>
						</thead>
						<tbody>
							{data.map((row, index) => (
								<tr key={index}>
									<td>{row.name}</td>
									<td>{row.hourly}</td>
									<td>{row.daily}</td>
									<td>{row.monthly}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}

export default DailyIn
