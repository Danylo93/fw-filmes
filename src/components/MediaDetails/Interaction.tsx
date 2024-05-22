import Tooltip from "@/components/Tooltip";
import { MediaType } from "@/types/general";
import { fetcher } from "@/utils/util";
import React from "react";
import useSWR from "swr";
import cn from "classnames";
import { useSession, signIn } from "next-auth/react";

type Props = {
  mediaId: number;
  mediaType: `${MediaType}`;
  trailerUrl?: string | null;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Interaction = ({
  mediaId,
  mediaType,
  trailerUrl,
  setIsModalOpen,
}: Props) => {
  const { data: session, status } = useSession();

  const { data, mutate, error } = useSWR<{
    mediaId: number;
    mediaType: string;
    isInFavorites: boolean;
    isInWatchlist: boolean;
  }>(
    session
      ? `/api/user-state?mediaType=${mediaType}&mediaId=${mediaId}`
      : null,
    fetcher
  );

  const isLoading = (session && !data && !error) || status === "loading";

  const isInFavorites = data?.isInFavorites;
  const isInWatchlist = data?.isInWatchlist;

  const optimisticToggleItem = async (itemType: "favorites" | "watchlist") => {
    if (!session) {
      signIn();
      return;
    }

    const optimisticData =
      itemType === "favorites"
        ? { ...data!, isInFavorites: !isInFavorites }
        : { ...data!, isInWatchlist: !isInWatchlist };

    const request = async () => {
      const method = (itemType === "favorites" ? isInFavorites : isInWatchlist)
        ? "DELETE"
        : "PUT";

      const response = await fetch(`/api/${itemType}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mediaType, mediaId }),
      });

      return response.ok ? optimisticData : data!;
    };

    try {
      await mutate(request(), {
        optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex items-center gap-x-4">
      {trailerUrl ? (
        <Tooltip title="Assistir Trailer">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-full p-2 ring-1 ring-white/70 transition hover:ring-2 hover:ring-movieViolet"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="h-5 w-5 scale-125"
              viewBox="0 0 16 16"
            >
              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
            </svg>
          </button>
        </Tooltip>
      ) : null}

      <Tooltip
        title={
          !session
            ? "Faça login para adicionar esta mídia aos seus favoritos"
            : isInFavorites
            ? "Remover dos favoritos"
            : "Adicionar aos favoritos"
        }
      >
        <button
          onClick={() => optimisticToggleItem("favorites")}
          className={cn(
            "inline-flex items-center justify-center rounded-full p-2 ring-1 ring-white/70 transition",
            {
              "hover:ring-2 hover:ring-movieViolet": session,
            }
          )}
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="h-5 w-5 scale-125"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 13.8c-.2 0-.3-.1-.4-.2C5.1 11.6 3 9.8 1.8 7.7.6 6-.2 4.3.3 2.5c.6-1.9 2.3-3 4.3-3 1.1 0 2.2.4 3 1.2C8 1.1 8.9 1 9.8 1.3c1 .3 1.9 1 2.5 2 .7 1 .9 2.1.5 3.3-.4 1.2-1.4 2.7-2.9 4.2l-.2.2c-.2.2-.3.2-.5.2h-.2z"
              className={isInFavorites ? "fill-movieRed" : "fill-current"}
            />
          </svg>
        </button>
      </Tooltip>

      <Tooltip
        title={
          !session
            ? "Faça login para adicionar esta mídia à sua lista de reprodução"
            : isInWatchlist
            ? "Remover da lista de reprodução"
            : "Adicionar à lista de reprodução"
        }
      >
        <button
          onClick={() => optimisticToggleItem("watchlist")}
          className={cn(
            "inline-flex items-center justify-center rounded-full p-2 ring-1 ring-white/70 transition",
            {
              "hover:ring-2 hover:ring-movieViolet": session,
            }
          )}
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="h-5 w-5 scale-125"
            viewBox="0 0 16 16"
          >
            <path
              d="M2 2v12h12V2H2zm11 11H3V3h10v10z"
              className={isInWatchlist ? "fill-movieGreen" : "fill-current"}
            />
          </svg>
        </button>
      </Tooltip>
    </div>
  );
};

export default Interaction;
