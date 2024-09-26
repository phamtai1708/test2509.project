import "./MovieBox.css";

function MovieBox({ props, onClick }) {
  if (!props || Object.keys(props).length === 0) {
    return null; // Không hiển thị gì nếu không có dữ liệu
  }
  return (
    <>
      <div className="movieBoxBox">
        <button className="btnClose" onClick={onClick}>
          <span class="material-symbols-outlined">close</span>
        </button>
        <div className="imgBox">
          <img src={props.image} alt={props.movieName} />
        </div>
        <div className="movieDescription">
          <p className="mbp1">{props.movieName}</p>
          <p className="mbp2">
            {props.time} min {props.year}
          </p>
          <p className="mbp3">{props.introduce}</p>
          <button>
            <span class="material-symbols-outlined">play_arrow</span>
            PLAY MOVIE
          </button>
        </div>
      </div>
    </>
  );
}

export default MovieBox;
