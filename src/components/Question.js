import { useQuestions } from '../contexts/QuestionsContext';
import Options from './Options';

function Question() {
  const { questions, questionIndex } = useQuestions();

  return (
    <div>
      <h4>{questions[questionIndex].question}</h4>
      <Options />
    </div>
  );
}

export default Question;
