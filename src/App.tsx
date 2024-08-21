import { useEffect, useMemo, useState } from "react";
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
    return data?.filter((game) => {
      if (!genre) return data;

      return game.genres.includes(genre);
    });
  }, [data, genre]);

  return (
    <div className="app">
      <h1>GTH exercise</h1>
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
        {filteredGames?.map((game, idx) => (
          <img
            key={"" + game.name + game.genres}
            src={game.image}
            className={"item"}
            data-index={idx}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
