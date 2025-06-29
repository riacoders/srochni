import { gapi } from 'gapi-script'
import { useEffect, useState } from 'react'
import { api_default } from '../services/api.service'

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
				val3: range[0][3],
				val4: range[0][4],
				val5: range[0][5],
				val6: range[0][7],
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

const Table9 = () => {
	const [data, setData] = useState(null)
	const [cache, setCache] = useState(null)
	const [lastFetchTime, setLastFetchTime] = useState(0)
	const [loading, setLoading] = useState(true)
	const [apiObj, setAPiObj] = useState(api_default.table9)

	useEffect(() => {
		const interval = setInterval(() => {
			setAPiObj(api_default.table9)
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
	}, [apiObj])

	return (
		<div className='DataCard glass-card'>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div>
					<h2 className='i-title'>Mukammal ta'mirlash</h2>
					<div className='i-repair-chart'>
						<div className='i-section'>
							<h3 className='i-subtitle'>
								0,4-110 kV elektr uzatish tarmoqlari (km)
							</h3>
							<div className='i-data'>
								<div className='i-row'>
									<span>Reja</span>
									<span className='i-value'>{data.val1}</span>
								</div>
								<div className='i-row'>
									<span>Amalda</span>
									<span className='i-value'>{data.val2}</span>
								</div>
								<div className='i-row'>
									<span>%</span>
									<span className='i-value'>{data.val3}</span>
								</div>
							</div>
						</div>
						<div className='i-section'>
							<h3 className='i-subtitle'>Transformator punktlar (dona)</h3>
							<div className='i-data'>
								<div className='i-row'>
									<span>Reja</span>
									<span className='i-value'>{data.val4}</span>
								</div>
								<div className='i-row'>
									<span>Amalda</span>
									<span className='i-value'>{data.val5}</span>
								</div>
								<div className='i-row'>
									<span>%</span>
									<span className='i-value'>{data.val6}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Table9
