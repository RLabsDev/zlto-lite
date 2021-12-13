import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.scss';

const Header: FunctionalComponent = () => {
    return (
        <header class={style.header}>
            <h1>Zlto Lite</h1>
            <nav>
                <Link activeClassName={style.active} href="/">
                    Login
                </Link>
                <Link activeClassName={style.active} href="/earn">
                    Earn
                </Link>
                <Link activeClassName={style.active} href="/store">
                    Store
                </Link>
            </nav>
        </header>
    );
};

export default Header;
