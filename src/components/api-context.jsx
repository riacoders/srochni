import React, { createContext, useContext } from 'react'
import { api_default } from '../services/api.service'

const ApiContext = createContext()

const ApiProvider = ({ children }) => {
	const apiDefault = {
		askue: api_default.askue,
	}

	return (
		<ApiContext.Provider value={{ apiDefault }}>{children}</ApiContext.Provider>
	)
}

export { ApiContext, ApiProvider }
