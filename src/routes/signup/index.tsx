// @ts-nocheck
import { FunctionalComponent, h } from "preact";
import style from "./style.css";
import { route } from "preact-router";
import { useState, useEffect } from "preact/hooks";
import { useStore } from "../../store";

const Signup: FunctionalComponent = () => {
  const ZLTO_API = "https://api.zlto.co";

  const [token, setToken] = useStore.token();
  // const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  async function performAuth() {
    const res = await fetch(`${ZLTO_API}/dl_create_account/`, {
      method: "POST",
      body: JSON.stringify({
        email,
        // username: email,
        password,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("@@@ res: ", res);

    if (!!res) {
      const data = await res.json();
      console.log("@@@@@  ~ file: index.tsx ~ line 29 ~ session ~ data", data);
      setToken(data.access_token);
      route("earn");
    }
  }

  return (
    <div class={style.home}>
      <h1>Create account</h1>
      <label for="fname">Email</label>
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        id="email"
        name="email"
        placeholder="Your email.."
      />

      <label for="lname">Password</label>
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        id="password"
        name="password"
        placeholder="Your password.."
      />

      <input onClick={performAuth} type="submit" value="Signup" />

      <div>
        {" "}
        <h2>What is Zlto?</h2>
        <p>
          Zlto is platform that uses blockchain technology to increase
          engagement amongst youth, track positive behaviour and encourage
          certain behaviour through our innovative rewards systems.
        </p>
        <h2>💪 How to earn?</h2>
        <p>
          Users are incentivized with Zlto every time they engage in positive
          behavior, which is anything that contributes towards personal growth
          like learning or community upliftment e.g volunteering.
          <br />
          There are three ways in which users can earn via Zlto: Self-earn;
          Microtasks; Surveys.
        </p>
        <h2>🎓 How to learn?</h2>
        <p>
          You can do short courses on the platform ranging from Job Readiness,
          Skills Training, Entrepreneurship, Mental Health Awareness. You can
          choose from a range of over 500 courses and kickstart your learning
          journey.
        </p>
        <h2>🎁 How to spend?</h2>
        <p>
          Our network of vendors provide access to our users with access to over
          3, 000 stores ranging from local, regional and national across South
          Africa. Users are able to redeem their digital coupons at any of these
          outlets which includes Airtime, Electricity, PEP and Shoprite amongst
          others.
        </p>
      </div>
    </div>
  );
};

export default Signup;
