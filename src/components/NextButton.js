function NextButton({ dispatch, answer, questionIndex, numQuestions }) {
  if (questionIndex < numQuestions - 1) {
    return (
      answer !== null && (
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: 'nextQuestion' })}
        >
          Next question
        </button>
      )
    );
  }

  if (questionIndex === numQuestions - 1) {
    return (
      answer !== null && (
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: 'finished' })}
        >
          Finish
        </button>
      )
    );
  }
}

export default NextButton;
