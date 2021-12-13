// @ts-nocheck
import { FunctionalComponent, h } from 'preact';
import style from './style.css';
import { route } from 'preact-router';
import { useEffect } from 'preact/hooks';
import { useStore } from '../../store';

const Home: FunctionalComponent = () => {
    const ZLTO_API = 'https://api.zlto.co';
    const APP_CLIENT_ID = 'BGBoJ7Dehh98Y2i50Sq8sb677DpuiW8KM4ghxq8h';
    const APP_CLIENT_SECRET = 'q1sABrh9cBM6UEfAnvcyhVgDwzflxBbkjjdaFco3b6ubfR7KjkxIfIuXGEBdkP8xHofBJbc53ZPlG0T9mwLawhrhlgrZDahkVAv4BF9240OGXIJjItls004Zg9GAnQme';

    const [token, setToken] = useStore.token();

    useEffect(() => {
        session();
      }, []);

    async function session() {
        const res = await fetch(`${ZLTO_API}/oauth/token/`, {
            method: 'POST',
            body: JSON.stringify({
                grant_type: "client_credentials",
                client_id: APP_CLIENT_ID,
                client_secret: APP_CLIENT_SECRET,
                scope: "store partner earn admin client"
            })
        });

        console.log('@@@ res: ', res);

        if (!!res) {
            const data = await res.json();
            console.log('@@@@@  ~ file: index.tsx ~ line 29 ~ session ~ data', data)
            setToken(data.access_token);
            route('earn');
        }
    };

    return (
        <div class={style.home}>
            <h1>Login</h1>
            <h3>Auth token: {token}</h3>
        </div>
    );
};

export default Home;
