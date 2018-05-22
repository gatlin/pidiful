import { Alm } from 'alm';

import { State, initialState } from './store';
import { Actions, tick } from './actions';
import MainComponent from './components/MainComponent';
import reducer from './reducer';

// The actual application.
const app = new Alm<State, Actions>({
    model: initialState(),
    update: reducer,
    view: MainComponent(),
    domRoot: 'main',
    eventRoot: 'main'
});

function tock(ts) {
    app.store.dispatch(tick());
    window.requestAnimationFrame(tock);
}

// Programatically set the document title
document.title = 'PIDiful';

// Listen for state updates so we can update the store.

// And we're off
app.start();

window.requestAnimationFrame(tock);
