import { FunctionalComponent, h, Fragment } from 'preact';
import { route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import { useStore } from '../../store';
import get from '../../utils/get';
import orderBy from '../../utils/orderBy';
import style from './style.scss';

const ZLTO_API = 'https://api.zlto.co';

const SubmitTask: FunctionalComponent = () => {
  const [token] = useStore.token();
  const [taskInFocus, setTaskInFocus] = useStore.taskInFocus();
  const [zltoBalance, setZltoBalance] = useStore.zltoBalance();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  console.log('@@@@@  ~ file: index.tsx ~ line 15 ~ currentQuestion', currentQuestion)

  const [answers, setAnswers] = useState({} as any);

  console.log('@@@@@  ~ file: index.tsx ~ line 16 ~ answers', answers)

  console.log('@@@@@  ~ file: index.tsx ~ line 17 ~ surveyInFocus', taskInFocus)

  useEffect(() => {
      if (!taskInFocus.questions) {
        route('earn');
      }
  }, [])

  let questions = taskInFocus.questions.reverse();
  questions = orderBy(questions, 'question_number');

  const [questionsToShow, setQuestionsToShow] = useState(questions);

  console.log('@@@@@  ~ file: index.tsx ~ line 21 ~ questions', questions)

  const attachmentTypes = {
      link: 1,
      fileUrl: 2,
      embedded: 3,
      fileUpload: 4
  };

  const next = () => {
    setCurrentQuestion(currentQuestion + 1);
  };
  
  const prev = () => {
    setCurrentQuestion(currentQuestion - 1);
  };

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  async function submitAnswers(payload) {
    const res = await fetch(`${ZLTO_API}/dl_submit_survey/`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    const data = await res.json();

    return data;
  };

  async function onSurveyCompleted() {
    console.log('@@@ answers: ', answers);

    const questionIds = Object.keys(answers)

    const res = await Promise.all(
      questionIds.map(async (questionId) => {
        let answer = answers[questionId];

        answer = answer.replace(/(\r\n|\n|\r)/gm, "");
        console.log('@@@@@  ~ file: index.tsx ~ line 75 ~ questionIds.map ~ answer', answer)

        let payload = {
          question: parseInt(questionId),
        } as any;
        if (!!answer && !!answer.file) {
          const base64String = await toBase64(answer.file);
          const blobRes = await fetch(base64String as any);
          const blob = await blobRes.blob();
          const file = new File([blob], 'user_upload');

          let fileFormData = new FormData();
          fileFormData.append('answer_file', file);
          fileFormData.append('question', questionId);
          payload = fileFormData;
        } else if (Array.isArray(answer)) {
          payload.answer = answer.join('\n')
        } else {
          payload.answer = answer;
        }

        return await submitAnswers(payload);
      })
    );

    console.log('@@@ res: ', res);

    const incorrectResponseIds = res.filter(obj => !obj.is_correct).map(obj => obj.details.question);
    console.log('@@@@@  ~ file: index.tsx ~ line 110 ~ onSurveyCompleted ~ incorrectResponseIds', incorrectResponseIds)

    if (incorrectResponseIds.length > 0) {
        const incorrectQuestions = taskInFocus.questions.filter(q => incorrectResponseIds.some(id => id === q.id))
        console.log('@@@@@  ~ file: index.tsx ~ line 113 ~ onSurveyCompleted ~ incorrectQuestions', incorrectQuestions)

        window.alert(`The following answers were incorrect: \n${incorrectQuestions.reverse().map(q => `${q.title}`).join('\n')}. \nPlease try again`)

        // Reset state so user starts from initial question
        setCurrentQuestion(0);
        setAnswers({});
        return;
    }

    if (res.some(obj => ['Already got Credited'].includes(obj.credited))) {
        window.alert('Already credited for this survey.');
        route('/earn');
        return;
    }

    window.alert('Congratulations you have successfully completed this activity and earned Zlto');
    await refreshZltoBalance();
    route('/earn');
  };

  async function refreshZltoBalance() {
    const getAccountRes = await fetch(`${ZLTO_API}/dl_account_details/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        }
    });
    const accountData = await getAccountRes.json();
    console.log('@@@@@  ~ file: index.tsx ~ line 42 ~ performAuth ~ accountData', accountData);

    setZltoBalance(accountData.balance);
  };

  const percentCompleted = (currentQuestion + 1) / questionsToShow.length * 100;

  return (
      <div class={style.home}>
            <div class={style.progressWrapper}>
                <div class={style.progressBar}>
                    <span class={style.progressBarFill} style={`width: ${percentCompleted}%`}></span>
                </div>
                <div class={style.progressQuestionNumber}>
                    Question {currentQuestion + 1} / {questionsToShow.length}
                </div>
            </div>
          <h2 class={style.title}>{taskInFocus.details.title}</h2>
          <div class={style.grid}>
              {questionsToShow.map((obj, idx) => {

                  const Attachments = () => (
                      <div class={style.attachmentContainer} title="Attachments:">
                      {obj.question_attachments.map((attachment, idx) => (
                          <div class={style.attachment}>
                          {attachment.attachment_type === attachmentTypes.link &&
                              <a
                              href={attachment.attachment_src}
                              target='_blank'
                              >
                              View Link
                              </a>
                          }
                          {attachment.attachment_type === attachmentTypes.fileUrl &&
                              <img
                              src={attachment.attachment_src}
                              />
                          }
                          {attachment.attachment_type === attachmentTypes.embedded &&
                              attachment.attachment_src
                          }
                          {attachment.attachment_type === attachmentTypes.fileUpload &&
                              <img
                                  src={attachment.attachment}
                              />
                          }
                          </div>
                      ))}
                      </div>
                  );

                  const Description = () => {
                      const htmlString = obj.description.toString();
                      return <span dangerouslySetInnerHTML={{ __html: htmlString }} ></span>
                  };

                  return (
                      <Fragment>
                            {currentQuestion === idx &&
                              <div class={style.questionContainer}>
                                  <span class={style.questionTitle}>
                                      {idx + 1}: {obj.title}
                                  </span>
                                  {!!obj.description &&
                                      <Description />
                                  }
                                  {!!obj.question_attachments && !!obj.question_attachments.length &&
                                      <Attachments />
                                  }
                                  <div class={style.answerContainer}>
                                      <span>
                                        Answer below:
                                      </span>

                                      {(obj.question_type_verbose === 'Date Field') && (
                                          <input
                                                value={answers[obj.id]}
                                                onChange={e => setAnswers({...answers, [obj.id]: get(e, 'target.value', '')}) }
                                                type="date"
                                                placeholder={obj.title}
                                          />
                                      )}
                                      {['Closed-ended', 'Multiple Choice'].includes(obj.question_type_verbose) && (
                                          <div class={style.selectDropdown}>
                                            <select 
                                                value={!!answers[obj.id] ? answers[obj.id] : 'Please select an option'}
                                                placeholder='Plase select an option'
                                                onChange={e => setAnswers({...answers, [obj.id]: get(e, 'target.value', '')}) }
                                                required
                                            >
                                                {obj.choices.split('\n').map(option => (
                                                    <option value={option}>{option}</option>
                                                ))}
                                            </select>
                                          </div>
                                      )}
                                      {(['Open-ended', 'Short answer', 'Paragraph'].includes(obj.question_type_verbose)) && (
                                          <input
                                                value={answers[obj.id]}
                                                onChange={e => setAnswers({...answers, [obj.id]: get(e, 'target.value', '')}) }
                                                type="text"
                                                placeholder={obj.title}
                                          />
                                      )}
                                  </div>

                                  <div class={style.actionContainer}>
                                      {currentQuestion > 0 && (
                                          <button class={style.actionButton} onClick={() => prev()}>
                                              Previous
                                          </button>
                                      )}
                                      {currentQuestion < questions.length - 1 && (
                                          <button
                                                class={style.actionButton}
                                                onClick={() => {
                                                    if (answers[obj.id] === undefined) {
                                                        window.alert('Your answer is empty');
                                                        return;
                                                    }
                                                    next()
                                                }}
                                        >
                                              Next
                                          </button>
                                      )}
                                      {currentQuestion === questions.length - 1 && (
                                          <input class={style.actionButton} onClick={onSurveyCompleted} type="submit" value="Submit"/>
                                      )}
                                  </div>

                              </div>
                          }
                      </Fragment>
                  );
              })}
          </div>
      </div>
  );
};

export default SubmitTask;
