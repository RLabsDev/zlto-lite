// @ts-nocheck
import { FunctionalComponent, h } from "preact";
import style from "./style.scss";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { useStore } from "../../store";

const Home: FunctionalComponent = () => {
  const ZLTO_API = "https://api.zlto.co";

  const [token, setToken] = useStore.token();
  const [user, setUser] = useStore.user();
  const [zltoBalance, setZltoBalance] = useStore.zltoBalance();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  async function performAuth() {
    const res = await fetch(`${ZLTO_API}/dl_login_account/`, {
      method: "POST",
      body: JSON.stringify({
        username,
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

      if (data[0]?.includes("failed")) {
        window.alert(data[0]);
        return;
      }

      setUser(data.account);
      setToken(data.token);

      const getAccountDetailsRes = await fetch(
        `${ZLTO_API}/dl_account_details/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${data.token}`,
          },
        }
      );
      const details = await getAccountDetailsRes.json();
      console.log(
        "@@@@@  ~ file: index.tsx ~ line 53 ~ performAuth ~ details",
        details
      );

      setZltoBalance(details.zlto_balance?.balance);

      route("earn");
    }
  }

  return (
    <div class={style.home}>
      <h1>Login</h1>

      <label for="fname">Username</label>
      <input
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        id="fname"
        name="firstname"
        placeholder="Username"
      />

      <label for="lname">Password</label>
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        id="lname"
        name="lastname"
        placeholder="Password"
      />

      <input onClick={performAuth} type="submit" value="Login" />

      <a class={style.createAccount} onClick={() => route("signup")}>
        New to Zlto? Create account
      </a>

      <a class={style.createAccount} onClick={() => route("reset-password")}>
        Forgot your password?
      </a>

      <a class={style.createAccount} href="#openModal">
        What is Zlto?
      </a>
      <div id="openModal" class={style.modalDialog}>
        <div>
          {" "}
          <a href="#close" title="Close" class={style.close}>
            X
          </a>
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
            Our network of vendors provide access to our users with access to
            over 3, 000 stores ranging from local, regional and national across
            South Africa. Users are able to redeem their digital coupons at any
            of these outlets which includes Airtime, Electricity, PEP and
            Shoprite amongst others.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
