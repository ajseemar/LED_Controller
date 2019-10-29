import React from 'react';
// import logo from './logo.svg';
import './App.css';
const $ = require('jquery');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      on: false,
      r: 0,
      g: 0,
      b: 0
    };

    this.toggleLED = this.toggleLED.bind(this);
    this.handleRangeInput = this.handleRangeInput.bind(this);
  }

  // componentDidMount() {
  // $.ajax({
  //   method: 'get',
  //   url: '/turn_on_led'
  // }).then(res => this.setState({
  //   r: res.r,
  //   g: res.g,
  //   b: res.b,
  //   on: true
  // }));
  // }

  // componentWillUnmount() {
  // $.ajax({
  //   method: 'get',
  //   url: '/turn_off_led'
  // })
  // }

  toggleLED() {
    if (this.state.on) {
      $.ajax({
        method: 'get',
        url: '/turn_off_led'
      }).then(() => {
        this.setState({
          on: false
        })
      })
    } else {
      $.ajax({
        method: 'get',
        url: '/turn_on_led'
      }).then(res => this.setState({
        r: res.r,
        g: res.g,
        b: res.b,
        on: true
      }));
    }
  }

  getRangeSliderVal(range) {
    // switch (range) {
    //   case 'r':
    //     return Math.floor()
    //     break;
    //   case 'g':
    //     break;
    //   case 'b':
    //     break;
    //   default:
    //     break;
    // }
    return this.state.on ? Math.floor(this.state[range] * 255) : 0
  }

  handleRangeInput(range) {
    return e => {
      if (!this.state.on) return;
      this.setState({
        [range]: e.currentTarget.value / 255
      });
      $.ajax({
        method: 'post',
        url: 'update_led',
        data: { r: this.state.r, g: this.state.g, b: this.state.b }
      });
    }
  }

  render() {
    return (
      <div className='led-controller-container'>
        <div className="App">
          {/* hello from react */}
          <div className='center-me'>
            <i className="fa fa-power-off"
              style={{ color: this.state.on ? 'green' : 'red', fontSize: '48px' }}
              onClick={this.toggleLED}
            ></i>
          </div>
          <div className='center-me'>
            <p>Red Value:</p>
          </div>
          <div className='slider-container'>
            <input type="range" min="0" max="255" value={this.getRangeSliderVal('r')} onChange={this.handleRangeInput('r')} class="slider" id="rrange" />
          </div>
          <div className='center-me'>
            <p>Green Value:</p>
          </div>
          <div className='slider-container'>
            <input type="range" min="0" max="255" value={this.getRangeSliderVal('g')} onChange={this.handleRangeInput('g')} class="slider" id="grange" />
          </div>
          <div className='center-me'>
            <p>Blue Value:</p>
          </div>
          <div className='slider-container'>
            <input type="range" min="0" max="255" value={this.getRangeSliderVal('b')} onChange={this.handleRangeInput('b')} class="slider" id="brange" />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
