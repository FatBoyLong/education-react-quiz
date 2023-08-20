import { useQuestions } from '../contexts/QuestionsContext';

import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Timer from './Timer';
import Footer from './Footer';

function App() {
  const { status } = useQuestions();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen
          // numQuestions={numQuestions} dispatch={dispatch}
          />
        )}
        {status === 'active' && (
          <>
            <Progress
            // numQuestions={numQuestions}
            // questionIndex={questionIndex}
            // points={points}
            // maximumPoints={maximumPoints}
            // answer={answer}
            />
            <Question
            // question={questions[questionIndex]}
            // dispatch={dispatch}
            // answer={answer}
            />
            <Footer>
              <Timer
              // dispatch={dispatch} secondsRemaining={secondsRemaining}
              />
              <NextButton
              // dispatch={dispatch}
              // answer={answer}
              // numQuestions={numQuestions}
              // questionIndex={questionIndex}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && <FinishScreen />}
      </Main>
    </div>
  );
}

export default App;
