import { gapi } from 'gapi-script'
import { useEffect, useState } from 'react'
import { api_default } from '../services/api.service'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'

const cacheExpiration = 15 * 1000

const fetchData = async (
	setLoading,
	setData,
	apiObj,
	setCache,
	setLastFetchTime
) => {
	const now = Date.now()
	try {
		const response = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: import.meta.env.VITE_APP_SHEETS_ID,
			range: apiObj,
			key: import.meta.env.VITE_APP_API_KEY,
		})
		const range = response.result.values
		if (range && range.length > 0) {
			const data = {
				val1: range[0][0],
				val2: range[0][1],
				val3: range[0][2],
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

const initClient = (
	setLoading,
	setData,
	apiObj,
	setCache,
	setLastFetchTime
) => {
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

const Table10 = () => {
	const [data, setData] = useState(null)
	const [cache, setCache] = useState(null)
	const [lastFetchTime, setLastFetchTime] = useState(0)
	const [loading, setLoading] = useState(true)
	const [apiObj, setAPiObj] = useState(api_default.table10)

	useEffect(() => {
		const interval = setInterval(() => {
			setAPiObj(api_default.table10)
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		const now = Date.now()
		if (cache && now - lastFetchTime < cacheExpiration) {
			console.log('Returning cached data')
			setData(cache)
			setLoading(false)
			return
		}
		gapi.load('client', () =>
			initClient(setLoading, setData, apiObj, setCache, setLastFetchTime)
		)
	}, [apiObj, lastFetchTime])

	return (
		<div className='DataCard'>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className='section-hj glass-card'>
					<div className='title-hj'>Debetor (mln so‘m)</div>
					<div className='m-col-row'>
						<div className='item-hj' style={{ flexDirection: 'column' }}>
							<div className='label-hj'>Jami - </div>
							<div className='progressbar-box'>
								<CircularProgressbar
									value={data.val1}
									maxValue={data.val1}
									text={data.val1}
									styles={buildStyles({
										pathColor: 'yellow',
										textColor: '#fff',
										trailColor: '#ccc',
										backgroundColor: '#3e98c7',
									})}
								/>
							</div>
						</div>
						<div className='item-hj' style={{ flexDirection: 'column' }}>
							<div className='label-hj'>Yuridik - </div>
							<div className='progressbar-box'>
								<CircularProgressbar
									value={data.val2}
									maxValue={data.val1}
									text={data.val2}
									styles={buildStyles({
										pathColor: 'yellow',
										textColor: '#fff',
										trailColor: '#ccc',
										backgroundColor: '#3e98c7',
									})}
								/>
							</div>
						</div>
						<div className='item-hj' style={{ flexDirection: 'column' }}>
							<div className='label-hj'>Aholi - </div>
							<div className='progressbar-box'>
								<CircularProgressbar
									value={data.val3}
									maxValue={data.val1}
									text={data.val3}
									styles={buildStyles({
										pathColor: 'yellow',
										textColor: '#fff',
										trailColor: '#ccc',
										backgroundColor: '#3e98c7',
									})}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Table10
