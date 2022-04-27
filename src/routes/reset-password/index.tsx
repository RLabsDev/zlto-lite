// @ts-nocheck
import { FunctionalComponent, h } from 'preact';
import style from './style.css';
import { route } from 'preact-router';
import { useState } from 'preact/hooks';

const ResetPassword: FunctionalComponent = () => {
    const ZLTO_API = 'https://api.zlto.co';

    const [email, setEmail] = useState(null);

    async function requestResetPassword() {
        const res = await fetch(`${ZLTO_API}/dl_reset_password_email/`, {
            method: 'POST',
            body: JSON.stringify({
                email,
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

            window.alert('Password reset link sent to your email!');
            route('/');
        }
    };

    return (
        <div class={style.home}>
            <h1>Enter email</h1>
            <label for="fname">Email</label>
            <input onChange={e => setEmail(e.target.value)} type="text" id="email" name="email" placeholder="Your email.."/>

            <input onClick={requestResetPassword} type="submit" value="Reset"/>
        </div>
    );
};

export default ResetPassword;
