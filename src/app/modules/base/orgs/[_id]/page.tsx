'use client'

import { useOrg } from "@/app/providers/OrgProvider"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { TOrg } from "../page"
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts"
import { Badge } from "@/components/ui/badge"

interface ChartData {
	name: string
	value: number
}

// Sample chart data for the dashboard
const sampleChartData: ChartData[] = [
	{ name: 'Jan', value: 400 },
	{ name: 'Feb', value: 300 },
	{ name: 'Mar', value: 200 },
	{ name: 'Apr', value: 278 },
	{ name: 'May', value: 189 },
	{ name: 'Jun', value: 239 },
];

export default function Org() {
	const { currentOrg, setCurrentOrg } = useOrg()
	const params = useParams<{ id: string }>()
	const cached_org = localStorage.getItem(`sinep_org_${params.id}`)

	useEffect(() => {
		localStorage.setItem(`sinep_org_${params.id}`, JSON.stringify(currentOrg))
	}, [currentOrg, params.id])

	if (!currentOrg && cached_org) {
		console.log(cached_org)
		setCurrentOrg(JSON.parse(cached_org) as TOrg)
	}

	if (currentOrg) {
		return (
			<div className="w-full min-h-full flex flex-col items-center justify-center p-2 rounded-4xl">
				<div className="relative w-full h-48 overflow-hidden flex items-center justify-start border-red-500 border-2 rounded-t-2xl">
					<img src={currentOrg.image_url ?? '/academic-donations.png'} alt="Banner" className="w-full h-full object-cover" />
					<div className="bg-black/60 absolute inset-0 z-10" />
					<p className="absolute z-20 p-6 text-white text-2xl font-medium">
						{currentOrg.name}
					</p>
				</div>
				<ResizablePanelGroup direction="horizontal" className="rounded-b-2xl gap-2 pt-1">
					{/* Left Panel: Dashboard with Recharts and Organization Info */}
					<ResizablePanel minSize={10} defaultSize={70}>
						<div className="p-4">
							<h2 className="text-xl font-semibold mb-4">Fluxo de doeações</h2>
							<div className="h-48">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={sampleChartData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
									</LineChart>
								</ResponsiveContainer>
							</div>
						</div>
					</ResizablePanel>
					{/* Right Panel: Additional content / details (if needed) */}
					<ResizableHandle />
					<ResizablePanel minSize={10}>
						<div className="p-4 flex-col gap-2">
							<h2 className="text-xl font-semibold mb-4">Detalhes sobre a organização:</h2>
							<div className="mt-6">
								<p className="my-2">Nome: <Badge variant='secondary' >{currentOrg.name}</Badge></p>
								{currentOrg.description && (
									<p className="mb-1"><p className="font-medium">Description:</p> {currentOrg.description}</p>
								)}
							</div>
							{/* Replace with actual administrators data if available */}
							<p className="my-2">
								Administradores:
								{currentOrg.admins.map((admin: string) => (
									<Badge variant='outline' key={admin}>
										{admin}
									</Badge>
								))}
							</p>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		)
	}

	return null
}