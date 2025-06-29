import { useEffect, useState, useCallback } from 'react'
import { gapi } from 'gapi-script'
import { api_default } from '../services/api.service'

const cacheExpiration = 15 * 1000

const fetchData = async (setters, lastFetchTime) => {
	const now = Date.now()

	const {
		setLoading,
		setData,
		setCache,
		setEndData,
		setEndCache,
		setHrsData,
		setHrsCache,
		setObjData,
		setObjCachedData,
		setLastFetchTime,
	} = setters

	try {
		const fetchSheetData = async range => {
			const response = await gapi.client.sheets.spreadsheets.values.get({
				spreadsheetId: import.meta.env.VITE_APP_SHEETS_ID,
				range,
				key: import.meta.env.VITE_APP_API_KEY,
			})
			return response.result.values
		}

		const newResponse = (await fetchSheetData(api_default.dataCard)).map(
			row => ({
				name: row[0],
				hourly: row[1],
				hempty: row[2],
				daily: row[3],
				monthly: parseFloat(row[4]),
			})
		)
		setCache(newResponse)
		setData(newResponse)

		const newEndResponse = (await fetchSheetData(api_default.dataCardEnd)).map(
			row => ({
				name: row[0],
				hourly: row[1],
				hempty: row[2],
				daily: row[3],
				monthly: parseFloat(row[4]),
			})
		)
		setEndCache(newEndResponse)
		setEndData(newEndResponse)

		const hourlyRes = await fetchSheetData(api_default.dataCardHourly)
		if (hourlyRes && hourlyRes.length > 0) {
			setHrsCache(hourlyRes[0])
			setHrsData(hourlyRes[0])
		}

		const newDataRes = await fetchSheetData(api_default.dataCardHrs)
		if (newDataRes && newDataRes.length > 0) {
			const newObjData = {
				name: newDataRes[0][0],
				hourly: newDataRes[0][1],
				hempty: newDataRes[0][2],
				daily: newDataRes[0][3],
				monthly: newDataRes[0][4],
				namedText: newDataRes[1][0],
				objval1: newDataRes[1][1],
				objval2: newDataRes[1][2],
				objval3: newDataRes[1][3],
				objval4: newDataRes[1][4],
			}
			setObjData(newObjData)
			setObjCachedData(newObjData)
		} else {
			setObjData(setObjCachedData)
		}

		setLastFetchTime(now)
		setLoading(false)
	} catch (error) {
		console.log('Error fetching data: ', error)
		setLoading(false)
	}
}

const DataCard = () => {
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState([])
	const [cache, setCache] = useState(null)
	const [endData, setEndData] = useState([])
	const [endCache, setEndCache] = useState(null)
	const [hrsData, setHrsData] = useState([])
	const [hrsCache, setHrsCache] = useState(null)
	const [objData, setObjData] = useState([])
	const [objCachedData, setObjCachedData] = useState(null)
	const [lastFetchTime, setLastFetchTime] = useState(0)
	const [allTime, setAllTime] = useState(0)
	const [allConnect, setAllConnect] = useState(0)
	const [mData, setMData] = useState(0)

	const initClient = useCallback(() => {
		gapi.client
			.init({
				apiKey: import.meta.env.VITE_APP_API_KEY,
				discoveryDocs: [
					'https://sheets.googleapis.com/$discovery/rest?version=v4',
				],
			})
			.then(() => {
				fetchData(
					{
						setLoading,
						setData,
						setCache,
						setEndData,
						setEndCache,
						setHrsData,
						setHrsCache,
						setObjData,
						setObjCachedData,
						setLastFetchTime,
					},
					lastFetchTime
				)
			})
	}, [lastFetchTime])

	useEffect(() => {
		const now = Date.now()
		if (cache && now - lastFetchTime < cacheExpiration) {
			console.log('Returning cached data')
			setData(cache)
			setLoading(false)
			return
		}
		gapi.load('client', initClient)
	}, [lastFetchTime, cache, initClient])

	useEffect(() => {
		const currentTime = new Date().getHours()
		let ssums = 0
		for (let i = 0; i <= currentTime; i++) {
			ssums += parseFloat(hrsData[i] || 0)
		}

		const interval = setInterval(() => {
			const now = new Date()
			const sec = now.getSeconds()
			const sums = hrsData.reduce((acc, hourData) => {
				return acc + (parseFloat(hourData || 0) * sec) / 3600000
			}, 0)
			setAllTime(ssums + sums)
			setMData(sums)

			if (hrsData.length > 0) {
				const currentHourData = parseFloat(hrsData[currentTime] || 0) / 3600000
				setAllConnect(currentHourData * sec)
			}
		}, 1000)

		return () => clearInterval(interval)
	}, [hrsData, allTime, allConnect])

	return (
		<div className='DataCard'>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className='table-container glass-card'>
					<table className='navoiy-table' style={{ width: '100%' }}>
						<tbody>
							<tr className='datacard-table-title'>
								<td>{objData.name}</td>
								<td>{objData.hourly}</td>
								<td style={{ display: 'none' }}>{objData.hempty}</td>
								<td>{objData.daily}</td>
								<td>{objData.monthly}</td>
							</tr>
							<tr>
								<td>{objData.namedText}</td>
								<td>{parseFloat(hrsData[new Date().getHours()]).toFixed(2)}</td>
								<td style={{ display: 'none' }}>{objData.objval2}</td>
								<td>{(allTime + allConnect).toFixed(2)}</td>
								<td>
									{(parseFloat(objData.objval4) + parseFloat(mData)).toFixed(2)}
								</td>
							</tr>
							{data.map((row, index) => (
								<tr key={index}>
									<td>{row.name}</td>
									<td>
										{(
											(row.hempty *
												parseFloat(hrsData[new Date().getHours()])) /
											100
										).toFixed(2)}
									</td>
									<td style={{ display: 'none' }}>{row.hempty}</td>
									<td>
										{(
											(allTime * row.hempty) / 100 +
											(allConnect * row.hempty) / 100
										).toFixed(2)}
									</td>
									<td>
										{(
											row.monthly +
											(parseFloat(mData) * parseFloat(row.hempty)) / 100
										).toFixed(2)}
									</td>
								</tr>
							))}
							{endData.map((row, index) => (
								<tr key={index}>
									<td>{row.name}</td>
									<td>
										{(
											(row.hempty *
												parseFloat(hrsData[new Date().getHours()])) /
											100
										).toFixed(2)}
									</td>
									<td style={{ display: 'none' }}>{row.hempty}</td>
									<td>
										{(
											(allTime * row.hempty) / 100 +
											(allConnect * row.hempty) / 100
										).toFixed(2)}
									</td>
									<td>
										{(
											row.monthly +
											(parseFloat(mData) * parseFloat(row.hempty)) / 100
										).toFixed(2)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}

export default DataCard
