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
    const [tasks, setTasks] = useStore.tasks();
    const [taskInFocus, setTaskInFocus] = useStore.taskInFocus();

    // const survey = !!surveys ? surveys[2] : {} as any; // hardcoded for now, maybe new endpoint created to fetch one daily survey
    // console.log('@@@@@  ~ file: index.tsx ~ line 15 ~ survey', survey)

    useEffect(() => {
        getTasks();
      }, []);

    async function getTasks() {
        try {
            setIsLoading(true);

    console.log('@@@@@  ~ file: index.tsx ~ line 13 ~ token', token)

            const res = await fetch(`${ZLTO_API}/dl_get_tasks/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                }
            });

            console.log('@@@ res: ', res);

            if (!!res) {
                const data = await res.json();
                console.log('@@@@@  ~ file: index.tsx ~ line 29 ~ session ~ data', data)

                setTasks([
                    ...data.my_tasks,
                    ...(data.others || []),
                ]);
            }

        } catch(e) {
            console.log('Error: ', e)
            route('');
        }

        setIsLoading(false);
    };

    async function getTaskDetails(task) {
        const res = await fetch(`${ZLTO_API}/dl_get_task_details/${task.id}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            }
        });

        console.log('@@@ getSurveyDetails res: ', res);

        if (!!res) {
            const data = await res.json();
            console.log('@@@@@  ~ file: index.tsx ~ line 29 ~ session ~ data', data)

            setTaskInFocus(data);
            route('submit-task')
        } 
    };

    return (
        <div class={style.home}>
            <h1 class={style.title}>Earn</h1>
            <div class={style.grid}>
                {isLoading && (!taskInFocus || !taskInFocus.details) && <h3>Loading...</h3>}

                {tasks.length === 0 && <h3>No tasks at the moment - please check with your Zlto partner for more information.</h3>}

                {tasks.map(task => (
                    <div class={style.card} onClick={() => getTaskDetails(task)}>
                        <img src={task.banner_pic} alt={task.title} style="width:100%"/>
                        <div class={style.container}>
                            <h4><b>{task.title}</b></h4>
                            <p>🎁 Reward: {task.amount} Zlto </p>
                        </div>
                    </div>
                    ))
                }

                {!!taskInFocus && !taskInFocus.details &&
                    <div>
                        {get(taskInFocus, 'questions', []).map(obj => (
                            <h1>{obj.title}</h1>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
};

export default Earn;
