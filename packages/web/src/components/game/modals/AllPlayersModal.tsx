import { Close } from "@mui/icons-material"
import { Player } from "@rahoot/common/types/game"
import Avatar from "@rahoot/web/components/Avatar"
import Button from "@rahoot/web/components/Button"
import clsx from "clsx"
import { useRef } from "react"

type Props = {
  players: Player[]
  onClose: () => void
}

const AllPlayersModal = ({ players, onClose }: Props) => {
  const tableRef = useRef(null)

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points)

  // Fallback for CSV if excel lib not desired or for simple CSV
  const handleExportCsv = () => {
    const headers = ["Rank", "Username", "Points"]
    const rows = sortedPlayers.map((p, i) => [i + 1, p.username, p.points])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "rahoot_results.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gray-50 p-4">
          <h2 className="text-2xl font-bold text-gray-800">All Players</h2>
          <Button onClick={onClose} className="">
            <Close />
          </Button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4">
          <table ref={tableRef} className="w-full">
            <thead>
              <tr className="border-b text-left text-sm font-semibold text-gray-500">
                <th className="pb-2 pl-2">Rank</th>
                <th className="pb-2">Player</th>
                <th className="pr-2 pb-2 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, index) => {
                const rank = index + 1
                let rowClass = "border-b last:border-0 hover:bg-gray-50"
                let rankBadge = (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600">
                    {rank}
                  </span>
                )

                if (rank === 1) {
                  rowClass =
                    "bg-yellow-50 border-b border-yellow-100 last:border-0 hover:bg-yellow-100"
                  rankBadge = (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 font-bold text-white shadow-sm ring-2 ring-amber-200">
                      1
                    </span>
                  )
                } else if (rank === 2) {
                  rowClass =
                    "bg-slate-50 border-b border-slate-100 last:border-0 hover:bg-slate-100"
                  rankBadge = (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-400 font-bold text-white shadow-sm ring-2 ring-slate-200">
                      2
                    </span>
                  )
                } else if (rank === 3) {
                  rowClass =
                    "bg-orange-50 border-b border-orange-100 last:border-0 hover:bg-orange-100"
                  rankBadge = (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-700 font-bold text-white shadow-sm ring-2 ring-amber-500">
                      3
                    </span>
                  )
                }

                return (
                  <tr
                    key={player.id}
                    className={clsx("transition-colors", rowClass)}
                  >
                    <td className="py-3 pl-2">{rankBadge}</td>
                    <td className="py-3 font-semibold text-gray-800">
                      <div className="flex flex-row items-center gap-2">
                        <Avatar id={player.avatarId} className="h-8 w-8" />
                        <span>{player.username}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-2 text-right font-bold text-gray-700">
                      {player.points}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t bg-gray-50 p-4">
          <Button onClick={handleExportCsv} className="bg-green-500!">
            Export to CSV
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AllPlayersModal
