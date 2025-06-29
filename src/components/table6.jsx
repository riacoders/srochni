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
			const resResults = {
				val1: range[0][0],
				val2: range[0][1],
				val3: range[0][2],
				val4: range[0][3],
				val5: range[0][4],
				val6: range[0][5],
				val7: range[0][6],
			}
			setData(resResults)
			setCache(resResults)
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

const Table6 = () => {
	const [data, setData] = useState(null)
	const [cache, setCache] = useState(null)
	const [lastFetchTime, setLastFetchTime] = useState(0)
	const [loading, setLoading] = useState(true)
	const [apiObj, setAPiObj] = useState(api_default.table6)

	useEffect(() => {
		const interval = setInterval(() => {
			setAPiObj(api_default.table6)
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
				<div className='pyramid glass-card'>
					<h4 style={{ marginBottom: '5px' }}>Zahira materiallar</h4>
					<div className='level'>
						<span>Jami TP va transformatorlar</span>
						<span style={{ textAlign: 'right' }} className='amount'>
							{data.val1} dona
						</span>
					</div>
					<div className='level'>
						<span>Transformator moyi</span>
						<span style={{ textAlign: 'right' }} className='amount'>
							{data.val2} tonna
						</span>
					</div>
					<div className='level'>
						<span>Kabel</span>
						<span className='amount'>{data.val3} km</span>
					</div>
					<div className='level'>
						<span>Sim</span>
						<span className='amount'>{data.val4} tonna</span>
					</div>
					<div className='level'>
						<span>Mufta</span>
						<span className='amount'>{data.val5} dona</span>
					</div>
					<div className='level'>
						<span>Tayanch</span>
						<span className='amount'>{data.val6} dona</span>
					</div>
					<div className='level'>
						<span>
							Boshqa materiallar (RLND-10, PK, PN, Avtomat, Izolyator,
							Nakonechnik, Rubilnik)
						</span>
						<span className='amount'>{data.val7} dona</span>
					</div>
				</div>
			)}
		</div>
	)
}

export default Table6
