import Link from "next/link"
import { Home, Inbox, Settings } from "lucide-react"

export default function Navigation() {
  return (
    <nav className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Meerkat Helpdesk</h1>
      </div>
      <ul className="space-y-2 p-4">
        <li>
          <Link href="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/inbox" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
            <Inbox size={20} />
            <span>Inbox</span>
          </Link>
        </li>
        <li>
          <Link href="/settings" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

