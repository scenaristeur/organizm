import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';

/**
 * Stylesheet
 */
const stylesheet = {
  bordered: {
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: 'blue'
      }
    }
  }
};

/**
 * Top level component.
 */
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'name in dashboard'
    };

    this.submit = data => this.setState(state => ({name: data}));
    this.cancel = _ => console.log('Form canceled');
  }
  render() {
    return (
      <element>


        <Log name={this.state.name}/>
        <Request />
        <box top={3} height={3}>
          {`Result: ${this.state.name}`}
        </box>

        <Response />
        {/* <Jobs /> */}
        <Counter />
        <Form />
        <Progress />
        <Stats />
      </element>
    );
  }
}


class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = {
  
      demo: 0
    };
    this.setDemo = value=>   this.setState(state => ({demo: value}));
  

  }
  render() {
    return (
      <box
      label="compteur"
      top="30%"
      left="60%"
      width="40%"
      height="30%"
      border={{type: 'line'}}
      style={{border: {fg: 'cyan'}}}>
      {this.state.demo}

      <button
        mouse
        border={{type: 'line'}}
        height={3}
        width={3}
        top={2}
        left={4}
        onPress={a => this.setDemo(this.state.demo + 1)}>
        +
      </button>
      <button
        mouse
        border={{type: 'line'}}
        height={3}
        width={3}
        top={2}
        onPress={a => this.setDemo(this.state.demo - 1)}>
        -
      </button>
    </box>
    );
  }
}


class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'Change name in form'
    };

  
    this.submit = data => this.setState(state => ({name: data}));
    this.cancel = _ => console.log('Form canceled');
  }
  render() {
    return (
      <form
        keys
        vi
        focused
        onSubmit={this.submit}
        onReset={this.cancel}
        class={stylesheet.bordered}
              label="formulaire"
        left="60%"
        width="40%"
        height="30%"
        border={{type: 'line'}}
        style={{bg: 'cyan', border: {fg: 'blue'}}}>
        <box width={6} height={3}>
        _Name:{' '}
        </box>
        <textbox
          onSubmit={this.submit}
          left={6}
          height={3}
          keys
          mouse
          inputOnFocus
        />
        <box top={3} height={3}>
          {`Result: ${this.state.name}`}
        </box>


        
        {/* <AnimatedBox /> */}
      </form>
    );
  }
}

/**
 * Log component.
 */
class Log extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'name in log'
    };

  
    this.submit = data => this.setState(state => ({name: data}));
    this.cancel = _ => console.log('Form canceled');
  }
  render() {
    return (
      <box
        label="Log"
        class={stylesheet.bordered}
        width="60%"
        height="70%"
        draggable={true}>
        {'Hello'}, {0}, {'World'}, {this.state.name}
      </box>
    );
  }
}

/**
 * Request component.
 */
class Request extends Component {
  render() {
    return (
      <box label="Request" class={stylesheet.bordered} top="70%" width="30%">
        {0}
      </box>
    );
  }
}

/**
 * Response component.
 */
class Response extends Component {
  render() {
    return (
      <box
        label="Response"
        class={stylesheet.bordered}
        top="70%"
        left="30%"
        width="30%"
      />
    );
  }
}

/**
 * Jobs component.
 */
// class Jobs extends Component {
//   render() {
//     return (
//       <box
//         label="Jobs"
//         class={stylesheet.bordered}
//         left="60%"
//         width="40%"
//         height="60%"
//       />
//     );
//   }
// }

/**
 * Progress component.
 */
class Progress extends Component {
  constructor(props) {
    super(props);

    this.state = {progress: 0, color: 'blue'};

    const interval = setInterval(() => {
      if (this.state.progress >= 100) return clearInterval(interval);

      this.setState({progress: this.state.progress + 1});
    }, 50);
  }

  render() {
    const {progress} = this.state,
      label = `Progress - ${progress}%`;

    return (
      <progressbar
        label={label}
        onComplete={() => this.setState({color: 'green'})}
        class={stylesheet.bordered}
        filled={progress}
        top="60%"
        left="60%"
        width="40%"
        height="10%"
        style={{bar: {bg: this.state.color}}}
      />
    );
  }
}

/**
 * Stats component.
 */
class Stats extends Component {
  render() {
    return (
      <box
        label="Stats"
        class={stylesheet.bordered}
        top="70%"
        left="60%"
        width="40%"
        height="31%">
        Some stats
      </box>
    );
  }
}

/**
 * Rendering the screen.
 */
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed dashboard'
});

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0);
});

render(<Dashboard />, screen);
