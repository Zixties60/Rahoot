import Answers from "@rahoot/web/components/game/states/Answers"
import Leaderboard from "@rahoot/web/components/game/states/Leaderboard"
import PlayerResult from "@rahoot/web/components/game/states/PlayerResult"
import Podium from "@rahoot/web/components/game/states/Podium"
import Prepared from "@rahoot/web/components/game/states/Prepared"
import Question from "@rahoot/web/components/game/states/Question"
import Responses from "@rahoot/web/components/game/states/Responses"
import Result from "@rahoot/web/components/game/states/Result"
import Room from "@rahoot/web/components/game/states/Room"
import Start from "@rahoot/web/components/game/states/Start"
import Wait from "@rahoot/web/components/game/states/Wait"

import { STATUS } from "@rahoot/common/types/game/status"
import Circle from "@rahoot/web/components/icons/Circle"
import Rhombus from "@rahoot/web/components/icons/Rhombus"
import Square from "@rahoot/web/components/icons/Square"
import Triangle from "@rahoot/web/components/icons/Triangle"

export const ANSWERS_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-green-500",
]

export const ANSWERS_ICONS = [Triangle, Rhombus, Circle, Square]

export const GAME_STATES = {
  status: {
    name: STATUS.WAIT,
    data: { text: "Waiting for the players" },
  },
  question: {
    current: 1,
    total: null,
  },
}

export const GAME_STATE_COMPONENTS = {
  [STATUS.SELECT_ANSWER]: Answers,
  [STATUS.SHOW_QUESTION]: Question,
  [STATUS.WAIT]: Wait,
  [STATUS.SHOW_START]: Start,
  [STATUS.SHOW_RESULT]: Result,
  [STATUS.SHOW_PREPARED]: Prepared,
  [STATUS.FINISHED]: PlayerResult,
  [STATUS.GAME_FINISHED]: PlayerResult,
  [STATUS.SHOW_LEADERBOARD]: PlayerResult,
}

export const GAME_STATE_COMPONENTS_MANAGER = {
  ...GAME_STATE_COMPONENTS,
  [STATUS.SHOW_ROOM]: Room,
  [STATUS.SHOW_RESPONSES]: Responses,
  [STATUS.SHOW_LEADERBOARD]: Leaderboard,
  [STATUS.FINISHED]: Podium,
  [STATUS.GAME_FINISHED]: Podium,
}

export const MANAGER_SKIP_BTN = {
  [STATUS.SHOW_ROOM]: "Start Game",
  [STATUS.SHOW_START]: null,
  [STATUS.SHOW_PREPARED]: null,
  [STATUS.SHOW_QUESTION]: null,
  [STATUS.SELECT_ANSWER]: "Skip",
  [STATUS.SHOW_RESULT]: null,
  [STATUS.SHOW_RESPONSES]: "Next",
  [STATUS.SHOW_LEADERBOARD]: "Next",
  [STATUS.FINISHED]: null,
  [STATUS.GAME_FINISHED]: null,
  [STATUS.WAIT]: null,
}

export const SOUNDS = [
  "waitingRoomMusic",
  "answersMusic",
  "answersSound",
  "resultsResult",
  "showSound",
  "boumpSound",
  "podiumThree",
  "podiumSecond",
  "podiumFirst",
  "snearRoll",
]

export const THEME_CONFIG: Record<
  string,
  {
    primary: string
    secondary: string
    background: string
    onPrimary: string
    onSecondary: string
  }
> = {
  orange: {
    primary: "#ff9900",
    secondary: "#0066FF",
    background: "#ea580c",
    onPrimary: "#ffffff",
    onSecondary: "#ffffff",
  },
  blue: {
    primary: "#3b82f6",
    secondary: "#F6AF3B",
    background: "#2563eb",
    onPrimary: "#ffffff",
    onSecondary: "#ffffff",
  },
  pink: {
    primary: "#ec4899",
    secondary: "#48EC9B",
    background: "#db2777",
    onPrimary: "#ffffff",
    onSecondary: "#1a140b",
  },
  green: {
    primary: "#22c55e",
    secondary: "#C52289",
    background: "#16a34a",
    onPrimary: "#ffffff",
    onSecondary: "#ffffff",
  },
  purple: {
    primary: "#a855f7",
    secondary: "#A4F755",
    background: "#9333ea",
    onPrimary: "#ffffff",
    onSecondary: "#1a140b",
  },
}
