import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';
import style from './style.scss';
import { useStore } from '../../store';

const Header: FunctionalComponent = () => {
    const [token, setToken] = useStore.token();

    return (
        <header class={style.header}>
            <Link href={token === '' ? '/' : '/earn'}>
                <h1>
                    <img src='components/header/zlto_logo.png' height={60} />
                </h1>
            </Link>
            <nav>
                {token === ''
                ? (
                    <div>
                        <Link activeClassName={style.active} href="/">
                            Login
                        </Link>
                        <Link activeClassName={style.active} href="/signup">
                            Signup
                        </Link>
                    </div>
                )
                : (
                    <div>
                        <Link activeClassName={style.active} href="/earn">
                            Earn
                        </Link>
                        <Link activeClassName={style.active} href="/store">
                            Store
                        </Link>
                    </div>
                )
                }
            </nav>
        </header>
    );
};

export default Header;
