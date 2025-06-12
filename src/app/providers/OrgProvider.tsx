"use client"

import React, { createContext, useContext, useState } from "react";
import { TOrg } from "@/app/modules/base/orgs/page";

interface OrgContextType {
	currentOrg: TOrg | null;
	setCurrentOrg: (org: TOrg | null) => void;

	addButton: boolean
	setShowState: (b: boolean) => void
	//change pra ter type safety
	entryType: string
	setEntryType: (e: string) => void
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export const OrgProvider = ({ children }: { children: React.ReactNode }) => {
	const [currentOrg, setCurrentOrg] = useState<TOrg | null>(null);
	const [showButton, setShowState] = useState<boolean>(false)
	const [entryType, setEntryType] = useState<string>("")
	return (
		<OrgContext.Provider value={{ currentOrg, setCurrentOrg, entryType, setEntryType, addButton: showButton, setShowState }}>
			{children}
		</OrgContext.Provider>
	);
};

export const useOrg = () => {
	const context = useContext(OrgContext);
	if (!context) {
		throw new Error("useOrg must be used within an OrgProvider");
	}
	return context;
};
