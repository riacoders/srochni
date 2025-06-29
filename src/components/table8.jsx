// import { gapi } from 'gapi-script'
// import { useEffect, useState } from 'react'
// import { api_default } from '../services/api.service'

// const cacheExpiration = 15 * 1000

// const fetchData = async (
// 	setLoading,
// 	setData,
// 	setCache,
// 	apiObj,
// 	setLastFetchTime
// ) => {
// 	const now = Date.now()
// 	try {
// 		const response = await gapi.client.sheets.spreadsheets.values.get({
// 			spreadsheetId: import.meta.env.VITE_APP_SHEETS_ID,
// 			range: apiObj,
// 			key: import.meta.env.VITE_APP_API_KEY,
// 		})
// 		const range = response.result.values
// 		if (range && range.length > 0) {
// 			const data = {
// 				val1: range[0][0],
// 				val2: range[0][1],
// 				val3: range[0][2],
// 			}
// 			setData(data)
// 			setCache(data)
// 			setLastFetchTime(now)
// 		}
// 	} catch (error) {
// 		console.log('Error fetching data: ', error)
// 	} finally {
// 		setLoading(false)
// 	}
// }
// const initClient = (
// 	setLoading,
// 	setData,
// 	apiObj,
// 	setCache,
// 	setLastFetchTime
// ) => {
// 	gapi.client
// 		.init({
// 			apiKey: import.meta.env.VITE_APP_API_KEY,
// 			discoveryDocs: [
// 				'https://sheets.googleapis.com/$discovery/rest?version=v4',
// 			],
// 		})
// 		.then(() => {
// 			fetchData(setLoading, setData, apiObj, setCache, setLastFetchTime)
// 		})
// }

// const Table8 = () => {
// 	const [data, setData] = useState(null)
// 	const [cache, setCache] = useState(null)
// 	const [lastFetchTime, setLastFetchTime] = useState(0)
// 	const [loading, setLoading] = useState(true)
// 	const [apiObj, setAPiObj] = useState(api_default.table8)

// 	useEffect(() => {
// 		const interval = setInterval(() => {
// 			setAPiObj(api_default.table8)
// 		}, 1000)

// 		return () => clearInterval(interval)
// 	}, [])

// 	useEffect(() => {
// 		const now = Date.now()
// 		if (cache && now - lastFetchTime < cacheExpiration) {
// 			console.log('Returning cached data')
// 			setData(cache)
// 			setLoading(false)
// 			return
// 		}
// 		gapi.load('client', () =>
// 			initClient(setLoading, setData, setCache, setLastFetchTime)
// 		)
// 	}, [apiObj])

// 	return (
// 		<div className='DataCard'>
// 			{loading ? (
// 				<p>Loading...</p>
// 			) : (
// 				<div className='t-vertical-chart glass-card'>
// 					<div className='t-item'>
// 						<span className='t-label'>
// 							Жами 0,4-110 кВ электр узатиш тармоги (км)
// 						</span>
// 						<span className='t-value'>{data.val1}</span>
// 					</div>
// 					<div className='t-item'>
// 						<span className='t-label'>Жами 35-110 кВли ПС (сони)</span>
// 						<span className='t-value'>{data.val2}</span>
// 					</div>
// 					<div className='t-item'>
// 						<span className='t-label'>ТП сони (дона)</span>
// 						<span className='t-value'>{data.val3}</span>
// 					</div>
// 				</div>
// 			)}
// 		</div>
// 	)
// }

// export default Table8

const Table8 = () => {
	return <div>Table8</div>
}

export default Table8
