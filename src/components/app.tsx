// @ts-nocheck
import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import Home from '../routes/home';
import Signup from '../routes/signup';
import Earn from '../routes/earn';
import SubmitTask from '../routes/submit-task';
import Store from '../routes/store';
import NotFoundPage from '../routes/notfound';
import Header from './header';

const App: FunctionalComponent = () => {
    return (
        <div id="preact_root">
            <Header />
            <Router>
                <Route path="/" component={Home} />
                <Route path="/signup" component={Signup} />
                <Route path="/earn" component={Earn} />
                <Route path="/submit-task" component={SubmitTask} />
                <Route path="/store" component={Store} />
                <NotFoundPage default />
            </Router>
        </div>
    );
};

export default App;
