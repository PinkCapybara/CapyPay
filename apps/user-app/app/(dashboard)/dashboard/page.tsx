"use client"
import { useSession } from "next-auth/react";

export default function Dashboard() {
    const session = useSession();

    return <div>
        Dashboard Page
        {JSON.stringify(session, null, 2)}
    </div>
}

