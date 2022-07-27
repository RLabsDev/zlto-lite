// @ts-nocheck
import { FunctionalComponent, h } from 'preact';
import style from './style.css';
import { route } from 'preact-router';
import { useState } from 'preact/hooks';
import { useStore } from '../../store';

const Home: FunctionalComponent = () => {
    const ZLTO_API = 'https://api.zlto.co';

    const [token, setToken] = useStore.token();
    const [user, setUser] = useStore.user();
    const [zltoBalance, setZltoBalance] = useStore.zltoBalance();

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    async function performAuth() {
        const res = await fetch(`${ZLTO_API}/dl_login_account/`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });

        console.log('@@@ res: ', res);

        if (!!res) {
            const data = await res.json();
            console.log('@@@@@  ~ file: index.tsx ~ line 29 ~ session ~ data', data)

            if (data[0]?.includes('failed')) {
                window.alert(data[0]);
                return;
            }

            setUser(data.account);
            setToken(data.token);

            const getAccountDetailsRes = await fetch(`${ZLTO_API}/dl_account_details/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${data.token}`,
                }
            });
            const details = await getAccountDetailsRes.json();
            console.log('@@@@@  ~ file: index.tsx ~ line 53 ~ performAuth ~ details', details)

            setZltoBalance(details.balance);

            route('earn');
        }
    };

    return (
        <div class={style.home}>
            <h1>Login</h1>
            <label for="fname">Username</label>
            <input onChange={e => setUsername(e.target.value)} type="text" id="fname" name="firstname" placeholder="Username"/>

            <label for="lname">Password</label>
            <input onChange={e=> setPassword(e.target.value)} type="password" id="lname" name="lastname" placeholder="Password"/>

            <input onClick={performAuth} type="submit" value="Login"/>

            <a
                class={style.createAccount}
                onClick={() => route('signup')}
            >
                New to Zlto?
                {' '}
                Create account
            </a>

            <a
                class={style.createAccount}
                onClick={() => route('reset-password')}
            >
                Forgot your password?
            </a>
        </div>
    );
};

export default Home;
