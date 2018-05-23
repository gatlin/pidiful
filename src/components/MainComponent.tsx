import * as Alm from 'alm';
import { connect } from 'alm';
import {
    toggleRun,
    toggleShowLog,
    canvasUpdate
} from '../actions';
import './MainComponent.css';
import { Vector } from '../physics';

let shownCount = 0;

const RunCtrl = props => (
    <div className='ctrl'>
      <label for='run-ctrl'>Running
        <input
          type='checkbox'
          id='run-ctrl'
          checked={ props.run ? 'checked' : null }
          on={{
              change: evt => {
                  props.toggleRun();
              }
          }}
          />
      </label>
    </div>
);

const ShowLogCtrl = props => (
    <div className='ctrl'>
      <label for='show-log-ctrl'>Show Log
        <input
          type='checkbox'
          id='show-log-ctrl'
          on={{
              change: evt => {
                  props.toggleShowLog();
              }
          }}
          checked={
              props.show
                  ? 'checked'
                  : null
          }
          />
      </label>
    </div>
);

const LogBar = props => !props.show ? <span></span> : (
    <div id='log-bar'>
      <p>Position: {props.ball.pos.toString()}</p>
      <p>Velocity: {props.ball.vel.toString()}</p>
      <p>Acceleration: {props.ball.acc.toString()}</p>
      <p><em>P</em>: { props.ball.p.toString() }</p>
      <p><em>I</em>: { props.ball.i.toString() }</p>
      <p><em>D</em>: { props.ball.d.toString() }</p>
      <p>Estimated position: { props.ball.estimated_pos.toString() }</p>
      <p>Estimated velocity: { props.ball.estimated_vel.toString() }</p>
      <p>Error: { props.ball.error.toString() }</p>
    </div>
);

/**
 * The main application component. Self-explanatory.
 */
const MainComponent = props => (
    <section
      id="the_app"
      className="app"
      tabindex={1}
      on={{
          keydown: evt => {
              switch (evt.getRaw().keyCode) {
                  // spacebar
              case 32:
                  props.toggleRun();
                  break;
                  // Left
              default:
                  return;
              }
          }
      }}
      >
      <canvas
        id='the_canvas'
        height={props.canvasHeight}
        width={props.canvasWidth}
        ref={ cnvs => {
            props.canvasUpdate(cnvs);
        }}
        />
        <RunCtrl
          run={props.ball.run}
          toggleRun={props.toggleRun}
          />
        <ShowLogCtrl
          toggleShowLog={props.toggleShowLog}
          show={props.show_log} />
        <LogBar show={props.show_log} ball={props.ball}/>
    </section>
);

export default connect(
    ({ ball, show_log, canvasWidth, canvasHeight }) => ({
        ball,
        show_log,
        canvasWidth,
        canvasHeight
    }),
    dispatch => ({
        toggleShowLog: () => dispatch(toggleShowLog()),
        toggleRun: () => dispatch(toggleRun()),
        canvasUpdate: d => dispatch(canvasUpdate(d))
    })
)(MainComponent);
