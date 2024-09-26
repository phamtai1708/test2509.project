import "./MovieCard.css";

function MovieCard({ props, onClick }) {
  return (
    <>
      <div className="movieCard" onClick={onClick}>
        <div className="imgBoxCard">
          <img src={props.image} alt={props.movieName} />
        </div>
        <p className="mcp1">{props.movieName}</p>
        <p className="mcp2">
          {props.time} min {props.year}
        </p>
      </div>
    </>
  );
}

export default MovieCard;
