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
			range: api_default.regionsCard,
			key: import.meta.env.VITE_APP_API_KEY,
		})
		const newDistricts = response.result.values.map(row => ({
			name: row[0],
			value: row[1],
		}))
		setCache(newDistricts)
		setLastFetchTime(now)
		setData(newDistricts)
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		setLoading(false)
	}
}

function RegionsCard() {
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState([])
	const [cache, setCache] = useState(null)
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
	}, [])

	return (
		<div className='RegionsCard DataCard'>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div
					className='table-container glass-card'
					style={{ flexDirection: 'column' }}
				>
					<h4 style={{ textAlign: 'left', marginBottom: '10px' }}>
						Viloyatga kirib kelishi{' '}
					</h4>
					<table className='navoiy-table'>
						<tbody>
							{data.map((row, index) => (
								<tr key={index}>
									<td>{row.name}</td>
									<td>{row.value}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}

export default RegionsCard
