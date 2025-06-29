import { gapi } from 'gapi-script'
import { useEffect, useState } from 'react'
import { api_default } from '../services/api.service'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'

const Askues = () => {
	const [obj, setObj] = useState([])

	useEffect(() => {
		function initClient() {
			gapi.client
				.init({
					apiKey: import.meta.env.VITE_APP_API_KEY,
					discoveryDocs: [
						'https://sheets.googleapis.com/$discovery/rest?version=v4',
					],
				})
				.then(function () {
					return gapi.client.sheets.spreadsheets.values.get({
						spreadsheetId: import.meta.env.VITE_APP_SHEETS_ID,
						range: api_default.askues,
					})
				})
				.then(function (response) {
					const range = response.result.values
					if (range && range.length > 0) {
						const newDistricts = {
							val1: range[0][0],
							val2: range[0][1],
							val3: range[0][2],
						}
						setObj(newDistricts)
					} else {
						setObj([])
					}
				})
		}

		gapi.load('client', initClient)
	}, [])
	return (
		<div className='DataCard'>
			<div>
				<div className='section-hj glass-card'>
					<div className='title-hj'>
						ASKUE tizimiga mos hisoblagich o'rnatilishi (dona)
					</div>
					<div
						className='item-hj'
						style={{ flexDirection: 'row', justifyContent: 'flex-start' }}
					>
						<div className='label-hj'>Hisoblagichlar soni - </div>
						<div className='value-hj'>{obj.val1}</div>
					</div>
					<div className='sec-hj-item'>
						<div className='item-hj'>
							<div className='label-hj'>ASKUE tizimiga mos hisoblagichlar</div>
							<div className='progressbar-box'>
								<CircularProgressbar
									value={obj.val2}
									maxValue={obj.val1}
									text={obj.val2}
									styles={buildStyles({
										pathColor: 'orange',
										textColor: '#fff',
										trailColor: '#d6d6d6',
										backgroundColor: '#3e98c7',
									})}
								/>
							</div>
						</div>
						<div className='item-hj'>
							<div className='label-hj'>Eski turdagi hisoblagichlar</div>
							<div className='progressbar-box'>
								<CircularProgressbar
									value={obj.val3}
									maxValue={obj.val1}
									text={obj.val3}
									styles={buildStyles({
										pathColor: 'orange',
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
	)
}

export default Askues
