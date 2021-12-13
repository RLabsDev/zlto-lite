import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import { useStore } from '../../store';
import get from '../../utils/get';
import style from './style.scss';

const ZLTO_API = 'https://api.zlto.co';

const Earn: FunctionalComponent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useStore.token();
    const [surveys, setSurveys] = useStore.surveys();
    const [surveyInFocus, setSurveyInFocus] = useStore.surveyInFocus();

    const survey = !!surveys ? surveys[0] : {} as any; // hardcoded for now, maybe new endpoint created to fetch one daily survey
    console.log('@@@@@  ~ file: index.tsx ~ line 15 ~ survey', survey)

    useEffect(() => {
        getSurveys();
      }, []);

    async function getSurveys() {
        try {
            setIsLoading(true);
            const res = await fetch(`${ZLTO_API}/partner/earn/surveys`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log('@@@ res: ', res);

            if (!!res) {
                const data = await res.json();
                console.log('@@@@@  ~ file: index.tsx ~ line 29 ~ session ~ data', data)

                setSurveys(data.my_surveys);
            }

        } catch(e) {
            route('home');
        }

        setIsLoading(false);
    };

    async function getSurveyDetails() {
        const res = await fetch(`${ZLTO_API}/earn/survey/${survey.id}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        console.log('@@@ getSurveyDetails res: ', res);

        if (!!res) {
            const data = await res.json();
            console.log('@@@@@  ~ file: index.tsx ~ line 29 ~ session ~ data', data)

            setSurveyInFocus(data);
        } 
    };

    return (
        <div class={style.home}>
            <h1 class={style.title}>Survey of the day</h1>

                
            <div class={style.grid}>
                {isLoading && (!surveyInFocus || surveyInFocus === {}) && <h3>Loading...</h3>}

                {!!survey &&
                    <div class={style.card} onClick={getSurveyDetails}>
                        <img src={survey.banner_pic} alt={survey.title} style="width:100%"/>
                        <div class={style.container}>
                            <h4><b>{survey.title}</b></h4>
                            <p>🎁 Reward: {survey.amount} Zlto </p>
                        </div>
                    </div>
                }

                {!!surveyInFocus && surveyInFocus !== {} &&
                    <div>
                        {get(surveyInFocus, 'questions', []).map(obj => (
                            <h1>{obj.title}</h1>
                        ))}
                    </div>
                
                }
            </div>
        </div>
    );
};

export default Earn;
