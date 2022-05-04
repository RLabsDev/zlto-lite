// @ts-nocheck
import { FunctionalComponent, h } from 'preact';
import style from './style.css';
import { route } from 'preact-router';
import { useState } from 'preact/hooks';

const VerifyResetPassword: FunctionalComponent = ({ authKey }) => {
    const ZLTO_API = 'https://api.zlto.co';

    const [newPassword, setNewPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);

    async function confirmNewPassword() {
        if (newPassword !== confirmPassword) {
            window.alert('Passwords do not match');
            return;
        }

        if (newPassword === null || confirmPassword === null) {
            window.alert('Both password fields required');
            return;
        }

        const res = await fetch(`${ZLTO_API}/dl_change_reset_password/`, {
            method: 'POST',
            body: JSON.stringify({
                new_password: newPassword,
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${authKey}`
            }
        });

        console.log('@@@ res: ', res);

        if (!!res) {
            const data = await res.json();
            console.log('@@@@@  ~ file: index.tsx ~ line 29 ~ session ~ data', data)

            window.alert('Password has been reset!');
            route('/');
        }
    };

    return (
        <div class={style.home}>
            <h1>Enter new password</h1>
            <label for="password">New Password</label>
            <input onChange={e => setNewPassword(e.target.value)} type="password" id="newPassword" name="newPassword" placeholder="New password.."/>

            <label for="confirmPassword">Confirm Password</label>
            <input onChange={e => setConfirmPassword(e.target.value)} type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm password.."/>

            <input onClick={confirmNewPassword} type="submit" value="Reset"/>
        </div>
    );
};

export default VerifyResetPassword;
