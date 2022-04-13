// @ts-nocheck
import { FunctionalComponent, h } from 'preact';
import style from './style.css';
import { route } from 'preact-router';
import { useState, useEffect } from 'preact/hooks';
import { useStore } from '../../store';

const Signup: FunctionalComponent = () => {
    const ZLTO_API = 'https://api.zlto.co';

    const [token, setToken] = useStore.token();
    // const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    async function performAuth() {
        const res = await fetch(`${ZLTO_API}/dl_create_account/`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                // username: email,
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
            setToken(data.access_token);
            route('earn');
        }
    };

    return (
        <div class={style.home}>
            <h1>Create account</h1>
            <label for="fname">Email</label>
            <input onChange={e => setEmail(e.target.value)} type="text" id="email" name="email" placeholder="Your email.."/>

            <label for="lname">Password</label>
            <input onChange={e=> setPassword(e.target.value)} type="password" id="password" name="password" placeholder="Your password.."/>

            <input onClick={performAuth} type="submit" value="Signup"/>
        </div>
    );
};

export default Signup;
