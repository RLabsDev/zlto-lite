import { FunctionalComponent, h, Fragment } from 'preact';
import {  useState } from 'preact/hooks';
import { useStore } from '../../store';
import get from '../../utils/get';
import orderBy from '../../utils/orderBy';
import style from './style.scss';

const ZLTO_API = 'https://api.zlto.co';

const SubmitTask: FunctionalComponent = () => {
  const [token] = useStore.token();
  const [taskInFocus, setTaskInFocus] = useStore.taskInFocus();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  console.log('@@@@@  ~ file: index.tsx ~ line 15 ~ currentQuestion', currentQuestion)

  const [answers, setAnswers] = useState({} as any);

  console.log('@@@@@  ~ file: index.tsx ~ line 16 ~ answers', answers)

  console.log('@@@@@  ~ file: index.tsx ~ line 17 ~ surveyInFocus', taskInFocus)

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
        "Content-Type": "multipart/form-data",
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
        const answer = answers[questionId];
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

    // if (_.every(res, obj => ['record updated', 'record saved'].includes(obj.message))) {
    //   successfulSaveNotification();
    //   navigate(routes.surveys.view)
    // }
  };

  return (
      <div class={style.home}>
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
                              <div>
                                  <span class={style.questionTitle}>
                                      {idx + 1}: {obj.title}
                                  </span>
                                  {!!obj.description &&
                                      <Description />
                                  }
                                  <div>
                                      {(obj.question_type_verbose === 'Open-ended' || (['Paragraph'].includes(obj.answer_type_verbose))) && (
                                          <input
                                              onChange={e => setAnswers({...answers, [obj.id]: get(e, 'target.value', '')}) }
                                              type="text"
                                              placeholder={obj.title}
                                          />
                                      )}
                                      {(obj.question_type_verbose === 'Date') && (
                                          <input
                                              onChange={e => setAnswers({...answers, [obj.id]: get(e, 'target.value', '')}) }
                                              type="text"
                                              placeholder={obj.title}
                                          />
                                      )}
                                      {obj.question_type_verbose === 'Multiple Choice' && (
                                          <div class={style.selectDropdown}>
                                            <select 
                                                onChange={e => setAnswers({...answers, [obj.id]: get(e, 'target.value', '')}) }
                                                required
                                            >
                                                {obj.choices.split('\n').map(option => (
                                                    <option value={option}>{option}</option>
                                                ))}
                                            </select>
                                          </div>
                                      )}
                                  </div>

                                  <div class={style.actionContainer}>
                                      {currentQuestion > 0 && (
                                          <button class={style.actionButton} onClick={() => prev()}>
                                              Previous
                                          </button>
                                      )}
                                      {currentQuestion < questions.length - 1 && (
                                          <button class={style.actionButton} onClick={() => next()}>
                                              Next
                                          </button>
                                      )}
                                      {currentQuestion === questions.length - 1 && (
                                          <input class={style.actionButton} onClick={onSurveyCompleted} type="submit" value="Done"/>
                                      )}
                                  </div>

                                  {!!obj.question_attachments && !!obj.question_attachments.length &&
                                      <Attachments />
                                  }
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
