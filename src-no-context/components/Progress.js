function Progress({
  questionIndex,
  numQuestions,
  points,
  maximumPoints,
  answer,
}) {
  return (
    <header className="progress">
      {/* for filling progress bar immediately, we should plus 1 to value of bar (value is index of question)*/}
      <progress
        max={numQuestions}
        value={questionIndex + Number(answer !== null)}
      />
      <p>
        Question <strong>{questionIndex + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maximumPoints}
      </p>
    </header>
  );
}

export default Progress;
