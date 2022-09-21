import { FunctionalComponent, h } from "preact";
import { route } from "preact-router";
import { Link } from "preact-router/match";
import style from "./style.scss";
import { useStore } from "../../store";

const Header: FunctionalComponent = () => {
  const [token, setToken] = useStore.token();
  const [zltoBalance, setZltoBalance] = useStore.zltoBalance();

  return (
    <header class={style.header}>
      <Link href={token === "" ? "/" : "/earn"}>
        <h1 class={style.balance}>
          {token === "" ? (
            <img src="assets/zlto_logo.png" height={60} />
          ) : (
            `Balance: ${Math.round(zltoBalance)}`
          )}
        </h1>
      </Link>
      <nav>
        {token === "" ? (
          <div>
            <Link activeClassName={style.active} href="/">
              Login
            </Link>
            <Link activeClassName={style.active} href="/signup">
              Signup
            </Link>
          </div>
        ) : (
          <div>
            <Link activeClassName={style.active} href="/earn">
              💪 Earn
            </Link>
            <Link activeClassName={style.active} href="/store">
              🎁 Store
            </Link>
            {/* <Link activeClassName={style.active} href="/" onClick={() => setToken('')}>
                            👋🏽 Logout
                        </Link> */}
            <Link activeClassName={style.active} href="/profile">
              🧑‍🎓 Profile
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
