import "./Challenge.css";

const Challenges = () => {
  return (
    <div className="challenge-cards-container">
      <h2 className="challenge-cards-title">CHALLENGES!</h2>
      <div className="challenge-cards-scroll">
        <div className="challenge-card not-ready">
          <div className="blur-bg" />
          <div className="not-ready-message">
            🚧 This feature isn’t ready yet. Coming soon!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;