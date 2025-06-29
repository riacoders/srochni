import { gapi } from 'gapi-script'
import { useEffect, useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { api_default } from '../services/api.service'

const cacheExpiration = 15 * 1000

const fetchData = async (setLoading, setData, setCache, setLastFetchTime) => {
	const now = Date.now()
	try {
		const response = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: import.meta.env.VITE_APP_SHEETS_ID,
			range: api_default.table5,
			key: import.meta.env.VITE_APP_API_KEY,
		})
		const range = response.result.values
		if (range && range.length > 0) {
			const data = {
				jami: range[0][0],
				aholi: range[0][1],
				ulgurji: range[0][2],
				balans: range[0][3],
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

const Table5 = () => {
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
	}, [lastFetchTime]) // Only run the effect when lastFetchTime changes

	return (
		<div className='DataCard'>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className='tree glass-card'>
					<div className='tree-node'>
						<div className='node-label big-label'>
							Jami hisoblagichlar soni (dona)
						</div>
						<div className='node-value green-value'>{data.jami}</div>
					</div>
					<div className='tree-branch'>
						<div className='tree-node'>
							<div className='tree-branch'>
								<div className='tree-node'>
									<div className='node-label'>Aholi</div>
									<div className='progressbar-box'>
										<CircularProgressbar
											value={data.aholi}
											maxValue={data.jami}
											text={data.aholi}
											styles={buildStyles({
												pathColor: 'blue',
												textColor: '#fff',
												trailColor: '#d6d6d6',
												backgroundColor: '#3e98c7',
											})}
										/>
									</div>
								</div>
								<div className='tree-node'>
									<div className='node-label'>Ulgurji</div>
									<div className='progressbar-box'>
										<CircularProgressbar
											value={data.ulgurji}
											maxValue={data.jami}
											text={data.ulgurji}
											styles={buildStyles({
												pathColor: 'blue',
												textColor: '#fff',
												trailColor: '#d6d6d6',
												backgroundColor: '#3e98c7',
											})}
										/>
									</div>
								</div>
								<div className='tree-node'>
									<div className='node-label'>Balans</div>
									<div className='progressbar-box'>
										<CircularProgressbar
											value={data.balans}
											maxValue={data.jami}
											text={data.balans}
											styles={buildStyles({
												pathColor: 'blue',
												textColor: '#fff',
												trailColor: '#d6d6d6',
												backgroundColor: '#3e98c7',
											})}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Table5
