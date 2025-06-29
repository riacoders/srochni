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
				val3: range[0][2],
				val4: range[0][3],
				val5: range[0][4],
				val6: range[0][5],
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

const initClient = async (
	setLoading,
	setData,
	apiObj,
	setCache,
	setLastFetchTime
) => {
	try {
		await gapi.client.init({
			apiKey: import.meta.env.VITE_APP_API_KEY,
			discoveryDocs: [
				'https://sheets.googleapis.com/$discovery/rest?version=v4',
			],
		})
		fetchData(setLoading, setData, apiObj, setCache, setLastFetchTime)
	} catch (error) {
		console.log('Error initializing client: ', error)
		setLoading(false)
	}
}

const Table7 = () => {
	const [data, setData] = useState(null)
	const [cache, setCache] = useState(null)
	const [lastFetchTime, setLastFetchTime] = useState(0)
	const [loading, setLoading] = useState(true)
	const [apiObj, setAPiObj] = useState(api_default.table7)

	useEffect(() => {
		const interval = setInterval(() => {
			setAPiObj(api_default.table7)
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
		<div className='DataCard'>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className='horizontal-chart glass-card'>
					<h4 style={{ marginBottom: '5px' }}>
						Tuzilgan brigadalar va ularga biriktirilgan maxsus texnikalar
					</h4>
					<div className='item'>
						<span className='label'>Tashkil etilgan brigadalar</span>
						<span className='value'>{data.val1}</span>
					</div>
					<div className='item'>
						<span className='label'>Jami hodimlar</span>
						<span className='value'>{data.val2}</span>
					</div>
					<div className='item'>
						<span className='label'>Injener texnik xodimlar</span>
						<span className='value'>{data.val3}</span>
					</div>
					<div className='item'>
						<span className='label'>Elektrmontyor xodimlar</span>
						<span className='value'>{data.val4}</span>
					</div>
					<div className='item'>
						<span className='label'>Brigadalar uchun avtomashina</span>
						<span className='value'>{data.val5}</span>
					</div>
					<div className='item'>
						<span className='label'>Maxsus texnika</span>
						<span className='value'>{data.val6}</span>
					</div>
				</div>
			)}
		</div>
	)
}

export default Table7
