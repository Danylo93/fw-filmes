import { MediaDetailsData } from "@/types/tmdb/parsed";

const Status = ({
  isEnded,
  isReleased,
}: Pick<MediaDetailsData, "isEnded" | "isReleased">) => (
  <span className="rounded-md border-2 px-2 uppercase text-white/70">
    {isEnded ? "Encerrado" : isReleased ? "No ar" : "Em breve"}
  </span>
);

export default Status;
