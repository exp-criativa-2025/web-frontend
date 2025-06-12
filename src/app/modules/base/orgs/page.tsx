/* eslint-disable @next/next/no-img-element */
"use client"
import { useOrg } from '@/app/providers/OrgProvider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface TOrg {
	name: string
	image_url?: string
	id: string
	description?: string
	admins: string[]

}

export default function Orgs() {
	const [currentPage, setCurrentPage] = useState(1);
	const [orgs, setOrgs] = useState<Array<TOrg> | null>(null);
	const itemsPerPage = 8;

	const { setCurrentOrg, setShowState, addButton } = useOrg()

	const totalItems = orgs?.length ?? 16;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;


	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	useEffect(() => {
		setOrgs([{
			name: "test",
			image_url: "https://media.tenor.com/Ol7PciW7zQIAAAAC/calabreso-calma-calabreso.gif",
			id: "1",
			description: "oii nos dê diheiro 🙈🙈🙈",
			admins: [
				'oii',
				'tchauuu'
			]

		}] as TOrg[])
	}, [])


	useEffect(() => {
		setShowState(true)
	}, [setShowState])


	if (!orgs) return <p>loading...</p>

	return (
		<>
			<div className="flex flex-col items-center justify-evenly">
				{addButton && (
					<Button variant={"default"} onClick={() => console.log("implement")}>
						Add
					</Button>
				)}
				<div className="grid grid-cols-4 gap-4 p-6 w-full max-w-7xl ">
					{
						// Array.from({ length: 16 })
						orgs && orgs
							.slice(startIndex, endIndex)
							.map((org, index) => (
								<Link
									key={index}
									href={`/orgs/${startIndex + index}`}
									onClick={() => setCurrentOrg(org)}
									className="block bg-white dark:bg-slate-900 rounded-lg shadow-md hover:shadow-lg dark:border-gray-200 border-gray-600 border transition-all duration-300 overflow-hidden "
								>
									<div className="h-40 overflow-hidden relative">
										<img
											src={org.image_url ?? `https://source.unsplash.com/random/300x200`}
											alt={`Organization ${startIndex + index + 1}`}
											sizes="(max-width: 768px) 100vw, 300px"
											className="object-cover"
										/>
									</div>
									<div className="p-4  border-0">
										<h3 className="font-semibold text-lg mb-1">{org.name ?? `Organization ${startIndex + index + 1}`}</h3>
										<p className="text-gray-600 dark:text-gray-200 text-sm">{org.description ?? "no description found"}</p>
									</div>
								</Link>
							))}
				</div>

				{/* Pagination Controls */}
				<div className="flex gap-2 my-4">
					<button
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
					>
						Previous
					</button>
					{Array.from({ length: totalPages }).map((_, index) => (
						<button
							key={index}
							onClick={() => handlePageChange(index + 1)}
							className={`px-4 py-2 rounded ${currentPage === index + 1
								? 'bg-blue-500 text-white'
								: 'bg-gray-200'
								}`}
						>
							{index + 1}
						</button>
					))}
					<button
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
					>
						Next
					</button>
				</div>
			</div>
		</>
	)
}