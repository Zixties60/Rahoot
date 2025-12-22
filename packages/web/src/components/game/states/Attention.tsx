import { PlayerStatusDataMap } from "@rahoot/common/types/game/status"
import Image from "next/image"
import projector from "@rahoot/web/assets/projector-screen.png"

type Props = {
  data: PlayerStatusDataMap["WAIT"]
}

const Attention = ({ data: { text } }: Props) => (
  <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
    <Image alt="icon" src={projector} width={200} height={200} />
    <h2 className="mt-5 text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
      {text}
    </h2>
  </section>
)

export default Attention
