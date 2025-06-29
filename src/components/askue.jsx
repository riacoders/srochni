import { gapi } from 'gapi-script'
import { useEffect, useState } from 'react'
import { api_default } from '../services/api.service'

const cacheExpiration = 15 * 1000

const fetchData = async (
	setLoading,
	setData,
	cache,
	apiObj,
	setCache,
	lastFetchTime,
	setLastFetchTime
) => {
	const now = Date.now()
	if (cache && now - lastFetchTime < cacheExpiration) {
		console.log('Returned cached data')
		setData(cache)
		setLoading(false)
		return
	}
	try {
		const response = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: import.meta.env.VITE_APP_SHEETS_ID,
			range: apiObj,
			key: import.meta.env.VITE_APP_API_KEY,
		})
		const newData = response.result.values
		if (newData && newData.length > 0) {
			const newArrData = {
				val1: newData[0][0],
				val2: newData[0][1],
				val3: newData[0][2],
			}
			setCache(newArrData)
			setData(newArrData)
			setLastFetchTime(now)
		}
	} catch (error) {
		console.log('Error fetching data from Sheets API: ', error)
	} finally {
		setLoading(false)
	}
}

const Askue = () => {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [cache, setCache] = useState(null)
	const [lastFetchTime, setLastFetchTime] = useState(0)
	const [apiObj, setAPiObj] = useState(api_default.askue)

	setInterval(() => {
		setAPiObj(api_default.askue)
	}, 1000)

	useEffect(() => {
		const initClient = () => {
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
						apiObj,
						setCache,
						lastFetchTime,
						setLastFetchTime
					)
				})
				.catch(error => {
					console.log('Error initializing Google API client: ', error)
				})
		}

		gapi.load('client', initClient)
	}, [cache, lastFetchTime, data, apiObj])

	return (
		<div className='DataCard glass-card'>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div>
					<h2 className='i-title'>
						"ASKUE" dasturida ko‘rsatkichlari shubha uyg‘otayotgan
						hisoblagichlarni o‘rganish natijalari
					</h2>
					<div className='i-repair-chart'>
						<div className='i-section'>
							<div className='i-data'>
								<div className='i-row'>
									<span>Hudud</span>
									<span className='i-value'>{data?.val1}</span>
								</div>
								<div className='i-row'>
									<span>Shubhali bo‘lgan hisoblagichlar soni oy boshida</span>
									<span className='i-value'>{data?.val2}</span>
								</div>
								<div className='i-row'>
									<span>Hisobot kunida qoldiq</span>
									<span className='i-value'>{data?.val3}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Askue
