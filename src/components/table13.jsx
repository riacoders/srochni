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

const Table13 = () => {
	const [data, setData] = useState(null)
	const [cache, setCache] = useState(null)
	const [lastFetchTime, setLastFetchTime] = useState(0)
	const [loading, setLoading] = useState(true)
	const [apiObj, setAPiObj] = useState(api_default.table13)

	useEffect(() => {
		const interval = setInterval(() => {
			setAPiObj(api_default.table13)
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
				<div style={{ display: 'flex', gap: '5px' }}>
					<div className='section-hj glass-card'>
						<div className='title-hj'>
							"Navoiy viloyatida o‘rnatilgan quyosh panellari to‘g‘risida
							MA’LUMOT"
						</div>
						<div className='item-hj' style={{ flexDirection: 'row' }}>
							<div className='label-hj'>Hudud nomi</div>
							<div className='value-hj'>{data.val1}</div>
						</div>
						<hr />
						<h4>Reja</h4>
						<div className='m-col-row' style={{ marginTop: '5px' }}>
							<div className='item-hj' style={{ flexDirection: 'column' }}>
								<div className='label-hj'>soni</div>
								<div className='value-hj'>{data.val2}</div>
							</div>
							<div className='item-hj' style={{ flexDirection: 'column' }}>
								<div className='label-hj'>quvvati (MVt)</div>
								<div className='value-hj'>{data.val3}</div>
							</div>
						</div>
						<hr />
						<h4>Amalda</h4>
						<div className='m-col-row'>
							<div className='item-hj' style={{ flexDirection: 'column' }}>
								<div className='label-hj'>soni</div>
								<div className='value-hj'>{data.val4}</div>
							</div>
							<div className='item-hj' style={{ flexDirection: 'column' }}>
								<div className='label-hj'>quvvati (MVt)</div>
								<div className='value-hj'>{data.val5}</div>
							</div>
						</div>
						<hr />
						<h4>foiz</h4>
						<div className='item-hj' style={{ flexDirection: 'row' }}>
							<div className='label-hj'>quvvatga nis.</div>
							<div className='value-hj'>{data.val6}</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Table13
