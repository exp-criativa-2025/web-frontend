"use client"

import { createContext, ReactNode, useContext, useState } from "react"

interface NewEntryType {
	showButton: boolean
	setShowState: (b: boolean) => void
	//change pra ter type safety
	entryType: string
	setEntryType: (e: string) => void
}

const NewEntryContext = createContext<NewEntryType | null>(null)

export const NewEntryProvider = ({ children }: { children: ReactNode }) => {
	const [showButton, setShowState] = useState<boolean>(false)
	const [entryType, setEntryType] = useState<string>("")

	return (
		<NewEntryContext.Provider value={{ showButton, entryType, setShowState, setEntryType }}>
			{children}
		</NewEntryContext.Provider>

	)
}

export const useEntry = () => {
	const ctx = useContext(NewEntryContext)
	if(!ctx){
			throw new Error("useEntry must be used in a NewEntryProvider")
	}
	return ctx
}