import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import axios from "axios";
import "./App.css";
import MovieCard from "./MovieCard";
import MovieBox from "./MovieBox";

function App() {
  const [dataa, setDataa] = useState([]);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [prvCount, setPrvCount] = useState(0);
  const [nextCount, setNextCount] = useState(4);
  const [lengthh, setLength] = useState(0);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:8080/movies");
        setLength(response.data.data.length);
        setDataa(response.data.data);
        let result = [];
        for (let i = prvCount; i <= nextCount; i++) {
          result.push(response.data.data[i]);
        }
        setMovies(result);
        console.log(result);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMovies();
  }, []);
  if (error) {
    return <div>Error: {error}</div>;
  }
  const [renderBox, setRenderBox] = useState(null);
  const handleClickMovie = (item) => {
    setRenderBox(item);
  };
  function handleClose() {
    setRenderBox(null);
  }
  function handleClickPrevious() {
    if (prvCount > 0) {
      setPrvCount(prvCount - 1);
      renderMovie();
    }
  }
  function handleClickNext() {
    if (nextCount < lengthh - 1) {
      setNextCount(nextCount + 1);
      renderMovie();
    }
  }
  function renderMovie() {
    let result = [];
    for (let i = prvCount; i <= nextCount; i++) {
      result.push(dataa[i]);
    }
    setMovies(result);
  }
  return (
    <>
      <div className="container">
        {!renderBox && (
          <div className="homePage">
            <div className="header">
              <div className="mainMenu">
                <span className="material-symbols-outlined">menu</span>
              </div>
              <div className="logo">
                <p className="ppp">MOVIE</p>
                <span className="sss">UI</span>
              </div>
              <div className="searchBox">
                <span className="material-symbols-outlined">search</span>
              </div>
            </div>
            <p className="pp1">Most Popular Movies</p>
            <div className="movieList">
              {movies.map((item) => {
                return (
                  <MovieCard
                    props={item}
                    key={item.ID}
                    onClick={() => handleClickMovie(item)}
                  ></MovieCard>
                );
              })}
            </div>
            <div className="btnNextAndPrevious">
              <button onClick={handleClickPrevious}>
                <span className="material-symbols-outlined">arrow_back</span>
                PREVIOUS
              </button>
              <button onClick={handleClickNext}>
                NEXT{" "}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        <div className="movieBox">
          {renderBox && <MovieBox props={renderBox} onClick={handleClose} />}
        </div>
      </div>
    </>
  );
}

export default App;
