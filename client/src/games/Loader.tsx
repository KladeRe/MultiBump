import Spinner from "../util/Spinner";

const Loader = () => {
  return (
    <div className="loader-container">
      <Spinner />
      <p>Waiting for other player</p>
    </div>
  );
};

export default Loader;
