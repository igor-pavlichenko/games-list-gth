import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

interface Game {
  name: string;
  image: string;
  genres: string;
  igdb_score: number;
  igdb_popularity: number;
}

const url =
  "https://assets.skilldnsproc.com/career/home-task/steamdb.small.json";

function App() {
  const [data, setData] = useState<Array<Game>>();
  const [genre, setGenre] = useState<string>();
  const [hoveredGame, setHoveredGame] = useState<Game>();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((json: Array<Game>) => {
        setData(json);
      });
  }, []);

  const genres = useMemo(() => {
    const uniqueGenres = new Set<string>();
    data?.forEach((item) => {
      item.genres.split(",").forEach((genre) => uniqueGenres.add(genre));
    });

    return [...uniqueGenres];
  }, [data]);

  const filteredGames = useMemo(() => {
    if (!genre) return data;

    return data?.filter((game) => {
      return game.genres.includes(genre);
    });
  }, [data, genre]);

  return (
    <div className="app">
      <h1>GTH exercise</h1>

      {/* use the modern dialog html element! */}
      <dialog ref={dialogRef}>
        {/* show game info */}
        <h2>{hoveredGame?.name}</h2>
        <p>Genres: {hoveredGame?.genres}</p>
        <p>Score: {hoveredGame?.igdb_score}</p>
        <p>Popularity: {hoveredGame?.igdb_popularity}</p>
        <button
          onClick={() => {
            dialogRef.current?.close();
            setHoveredGame(undefined);
          }}
        >
          close
        </button>
      </dialog>

      <select
        onChange={(event) => {
          setGenre(event.target.value);
        }}
      >
        {genres.map((genre) => (
          <option key={genre}>{genre}</option>
        ))}
      </select>

      <div className="container">
        {filteredGames?.map((game) => {
          // this is obviously terrible
          // if i had to implement it properly i would split both the dialog and the image into separate components
          // and pass them the setState and showModal/close functions
          // and all this timeout delay logic would be where it belongs instead of being part of this big messy App.tsx
          let timeout: number;
          function onMouseOver() {
            timeout = setTimeout(() => {
              dialogRef.current?.showModal();
              setHoveredGame(game);
            }, 1000);
          }

          function onMouseOut() {
            clearTimeout(timeout);
          }

          return (
            <img
              onClick={() => {
                dialogRef.current?.showModal();
              }}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              key={game.image}
              // yessss! "Fallout: New Vegas" is duplicated in the json, with same name and genres
              // turned out image urls are actually the only unique property here
              // this was causing all sorts of issue with this item being rendered even though it got filtered out
              src={game.image}
              className={"item"}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
