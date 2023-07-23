import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';

const initialState = {
  questions: [],

  // another implementation of isLoading state
  // possible statuses: 'loading', 'error', 'ready', 'active', 'finished'
  status: 'loading',

  // state of current question
  questionIndex: 0,

  // handling index of user answer
  // initially there is no answer
  answer: null,

  // handling user score
  points: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      // in reducer function we must return the brand new state
      return { ...state, questions: action.payload, status: 'ready' };

    case 'dataFailed':
      return { ...state, status: 'error' };

    // handling click on button Let`s start!
    case 'start':
      return { ...state, status: 'active' };

    // handling user answer (choosing answer of 4 questions)
    case 'newAnswer':
      // checking for active question
      const question = state.questions.at(state.questionIndex);

      return {
        ...state,
        answer: action.payload,

        // adding points only when answer is correct
        // firstly, checking for active question
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points + 0,
      };

    case 'nextQuestion':
      return { ...state, questionIndex: state.questionIndex + 1, answer: null };

    default:
      throw new Error('Unknown action');
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { questions, status, questionIndex, answer, points } = state;

  const numQuestions = questions.length;

  const maximumPoints = questions.reduce(
    (acc, question) => acc + question.points,
    0
  );
  

  useEffect(function () {
    fetch('http://localhost:9000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <>
            <Progress
              numQuestions={numQuestions}
              questionIndex={questionIndex}
              points={points}
              maximumPoints={maximumPoints}
              answer={answer}
            />
            <Question
              question={questions[questionIndex]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
