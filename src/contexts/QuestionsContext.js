import { createContext, useContext, useEffect, useReducer } from 'react';

const SECS_PER_QUESTION = 30;

const QuestionsContext = createContext();

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

  // handling user highscore
  highscore: 0,

  // seconds of timer
  secondsRemaining: null,
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
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

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

    case 'finished':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };

    case 'restart':
      return {
        ...initialState,
        questions: state.questions,
        status: 'ready',
      };

    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };

    default:
      throw new Error('Unknown action');
  }
}

function QuestionsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    questions,
    status,
    questionIndex,
    answer,
    points,
    highscore,
    secondsRemaining,
  } = state;

  useEffect(function () {
    fetch('http://localhost:9000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, []);

  const numQuestions = questions.length;

  const maximumPoints = questions.reduce(
    (acc, question) => acc + question.points,
    0
  );

  return (
    <QuestionsContext.Provider
      value={{
        questions,
        status,
        questionIndex,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maximumPoints,
        dispatch,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
}

function useQuestions() {
  const context = useContext(QuestionsContext);
  if (context === undefined)
    throw new Error('The context was used outside of the Provider Component');
  return context;
}

export { QuestionsProvider, useQuestions };
