"use client"

import { useParams } from "next/navigation";

export default function Org() {
	const params = useParams<{ id: string }>();
	const id = Array.isArray(params.id) ? params.id[0] : params.id

	if (!id) {
		return (
			<>
				no id found
			</>
		)
	}

	return (
		<>
			goofy
			{params.id}
		</>
	)
}