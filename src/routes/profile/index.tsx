import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { useStore } from '../../store';
import { route } from 'preact-router';
import get from '../../utils/get';
import style from './style.scss';

interface Props {
    user: string;
};

const Profile: FunctionalComponent<Props> = (props: Props) => {
    const ZLTO_API = 'https://api.zlto.co';

    const [token] = useStore.token();
    const [user, setUser] = useStore.user();

    const [name, setName] = useState(user.name);
    const [surname, setSurname] = useState(user.surname);
    const [email, setEmail] = useState(user.email);
    const [cell, setCell] = useState(user.cell_number);
    const [dob, setDob] = useState(user.dob);
    const [aboutMe, setAboutMe] = useState(user.about_me);

    async function saveProfile() {
        const res = await fetch(`${ZLTO_API}/dl_update_account_details/`, {
            method: 'PUT',
            body: JSON.stringify({
                name,
                surname,
                email,
                cell_number: cell,
                dob,
                about_me: aboutMe
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
            }
        });

        console.log('@@@ res: ', res);

        if (!!res) {
            const data = await res.json();
            console.log('@@@@@  ~ file: index.tsx ~ line 40 ~ saveProfile ~ data', data)

            if (data[0]?.includes('failed')) {
                window.alert(data[0]);
                return;
            }

            window.alert('Profile updated!');

            setUser(data);
            route('earn');
        }
    };

    return (
        <div class={style.profile}>
            <h1>Profile for {user.name}</h1>
            <p>Update your profile details below</p>

            <label for="fname">Name</label>
            <input value={name} onChange={e => setName(get(e, 'target.value', ''))} type="text" id="name" name="name" placeholder="Name"/>

            <label for="lname">Surname</label>
            <input value={surname} onChange={e=> setSurname(get(e, 'target.value', ''))} type="text" id="surname" name="surname" placeholder="Surname"/>

            <label for="fname">Email</label>
            <input value={email} onChange={e => setEmail(get(e, 'target.value', ''))} type="text" id="email" name="email" placeholder="Email"/>

            <label for="lname">Cell Phone Number</label>
            <input value={cell} onChange={e=> setCell(get(e, 'target.value', ''))} type="text" id="cell_number" name="cell_number" placeholder="Cell Phone Number"/>

            <label for="lname">Date of Birth</label>
            <input value={dob} onChange={e=> setDob(get(e, 'target.value', ''))} type="text" id="dob" name="dob" placeholder="Date of Birth"/>

            <label for="lname">About Me</label>
            <input value={aboutMe} onChange={e=> setAboutMe(get(e, 'target.value', ''))} type="text" id="about_me" name="about_me" placeholder="About Me"/>

            <input onClick={saveProfile} type="submit" value="Save"/>
        </div>
    );
};

export default Profile;
