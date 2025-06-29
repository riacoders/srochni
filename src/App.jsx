import { useEffect, useRef, useState } from 'react'
import districts from './data/data'
import SvgData from './components/svg-data'
import fabric from './assets/manufacturing-plant.png'
import { gapi } from 'gapi-script'
import Loader from './components/loader'
import { api_default } from './services/api.service'
import {
	DataCard,
	DailyIn,
	Table5,
	Table6,
	Table7,
	Table9,
	Table10,
	Askues,
	Askue,
	Table11,
	Table12,
	BalansPateriya,
	YangiQurilish,
	Table13,
	RegionsCard,
} from './components/export.services'

const App = () => {
	const [tooltipContent, setTooltipContent] = useState('')
	const [tooltipStyle, setTooltipStyle] = useState({ display: 'none' })
	const tooltipRef = useRef(null)

	const handleMouseOver = event => {
		const district = districts[event.target.id]
		if (district) {
			setTooltipContent(`<strong>${district.name}</strong>`)
			setTooltipStyle({
				display: 'block',
				left: `${event.pageX + 10}px`,
				top: `${event.pageY + 10}px`,
			})
		}
	}

	const handleMouseMove = event => {
		if (tooltipStyle.display === 'block') {
			setTooltipStyle({
				display: 'block',
				left: `${event.pageX + 10}px`,
				top: `${event.pageY + 10}px`,
			})
		}
	}

	const handleMouseOut = () => {
		setTooltipStyle({ display: 'none' })
	}

	useEffect(() => {
		const map = document.getElementById('navoiy-map')
		const tooltip = tooltipRef.current

		const handleMouseOver = event => {
			const district = districts[event.target.id]
			if (district && tooltip) {
				tooltip.innerHTML = `<strong>${district.name}</strong><br>`
				tooltip.style.display = 'block'
			}
		}

		const handleMouseMove = event => {
			if (tooltip && tooltip.style.display === 'block') {
				tooltip.style.left = `${event.pageX - 430}px`
				tooltip.style.top = `${event.pageY - 40}px`
			}
		}

		const handleMouseOut = () => {
			if (tooltip) {
				tooltip.style.display = 'none'
			}
		}

		if (map) {
			map.addEventListener('mouseover', handleMouseOver)
			map.addEventListener('mousemove', handleMouseMove)
			map.addEventListener('mouseout', handleMouseOut)
		}

		return () => {
			if (map) {
				map.removeEventListener('mouseover', handleMouseOver)
				map.removeEventListener('mousemove', handleMouseMove)
				map.removeEventListener('mouseout', handleMouseOut)
			}
		}
	}, [districts])

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		function initClient() {
			gapi.client
				.init({
					apiKey: import.meta.env.VITE_APP_API_KEY,
					discoveryDocs: [
						'https://sheets.googleapis.com/$discovery/rest?version=v4',
					],
				})
				.then(() => {
					return gapi.client.sheets.spreadsheets.values.get({
						spreadsheetId: import.meta.env.VITE_APP_SHEETS_ID,
						range: api_default.dataCard,
					})
				})
				.then(() => {
					setLoading(false)
				})
				.catch(error => {
					console.error('Error initializing Google API client:', error)
				})
		}

		gapi.load('client', initClient)
	}, [])

	return (
		<>
			<div style={loading ? { display: 'block' } : { display: 'none' }}>
				<Loader />
			</div>
			<div
				style={!loading ? { display: 'block' } : { display: 'none' }}
				className='container'
			>
				<div className='back-image'></div>
				<div className='data-visualizer'>
					<div className='left-side '>
						<DataCard />
						<RegionsCard />
						<BalansPateriya />
						<DailyIn />
						<div className='m-col-row'>
							<Table10 />
							<Table13 />
						</div>
					</div>
					<div className='map-container'>
						<div className='data-map glass-card'>
							<SvgData
								onMouseOver={handleMouseOver}
								onMouseMove={handleMouseMove}
								onMouseOut={handleMouseOut}
							/>
							<div id='tooltip' className='tooltip' ref={tooltipRef}>
								{tooltipContent}
							</div>
							<img
								className='fabric-image'
								src={fabric}
								alt='fabric'
								width={'200px'}
							/>
						</div>
						<div className='middle-col'>
							<div className='m-col-row'>
								<Table5 />
								<Askues />
							</div>
							<Askue />
							<Table12 />
						</div>
					</div>
					<div className='right-side '>
						<Table11 />
						<Table9 />
						<YangiQurilish />
						<div className='m-col-row'>
							<Table6 />
							<Table7 />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default App
