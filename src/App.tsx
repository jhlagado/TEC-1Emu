import React, { Component } from 'react';
import styled, { css } from 'styled-components'
import MemoryMap from 'nrf-intel-hex';

import logo from './logo.svg';
import './App.css';
import { Z80, Z80State } from './z80';
import { ROM } from './ROM';
import { cpus } from 'os';
import { TEC } from './TEC';
import { Display } from './Display';

const byteToHex = (byte) => (byte & 0xff).toString(16).padStart(2, '0');
const wordToHex = (word) => (word & 0xffff).toString(16).padStart(4, '0');

const keyMap = {
  Digit0: 0x00,
  Digit1: 0x01,
  Digit2: 0x02,
  Digit3: 0x03,
  Digit4: 0x04,
  Digit5: 0x05,
  Digit6: 0x06,
  Digit7: 0x07,
  Digit8: 0x08,
  Digit9: 0x09,
  KeyA: 0x0A,
  KeyB: 0x0B,
  KeyC: 0x0C,
  KeyD: 0x0D,
  KeyE: 0x0E,
  KeyF: 0x0F,
  KeyM: 0x13,
  Space: 0x13,
  KeyG: 0x12,
  Minus: 0x11,
  ArrowDown: 0x11,
  Equal: 0x10,
  ArrowUp: 0x10,
};

class App extends Component<any, any> {

  tec = new TEC();

  constructor(props) {
    super(props);
    this.tec.loadROM();
    this.tec.reset();
    this.state = {
      tecState: this.tec.state,
      outPorts: this.tec.outPorts,
      displays: this.tec.displays,
      frequency: this.tec.frequency,
    };
  }

  doStep() {
    this.tec.step(this.update);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();

    if (event.code === 'Escape') {
      this.tec.reset();
    }
    else if (event.code in keyMap) {
      let keyCode = keyMap[event.code];
      if (event.shiftKey) {
        keyCode = keyCode | 0x80;
      }
      this.tec.inPorts[0] = keyCode;
      this.tec.interrupt(true, 0);
    }
    else {
      console.log(event, event.code, event.key);
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    // this.tick();
    this.tec.run(this.update);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }

  // tick = () => {
  //   this.tec.run(this.update);
  // }

  update = () => {
    this.setState({
      tecState: this.tec.state,
      inPorts: this.tec.outPorts,
      outPorts: this.tec.outPorts,
      digits: this.tec.digits,
      segments: this.tec.segments,
      displays: this.tec.displays,
      frequency: this.tec.frequency,
    });
  }

  render() {
    const PC = this.state.tecState && this.state.tecState.pc;
    const A = this.state.tecState && this.state.tecState.a;
    const H = this.state.tecState && this.state.tecState.h;
    const L = this.state.tecState && this.state.tecState.l;
    const HL = H << 8 | L;
    const MEM = PC && this.tec.memory.slice(PC, PC + 4).map(byteToHex);
    const digits = this.state.digits || 0;
    const segments = this.state.segments || 0;
    const port2 = this.state.ports && this.state.ports[2];
    const frequency = this.state.frequency;
    return (
      <div className="App">

        <div>PC: {wordToHex(PC)}</div>
        <div>A: {byteToHex(A)}</div>
        <div>HL: {byteToHex(HL)}</div>
        <div>MEM(PC): {MEM}</div>
        <div>digits: {digits.toString(2).padStart(8, '0')}</div>
        <div>segments: {segments.toString(2).padStart(8, '0')}</div>
        <div>Speaker: {frequency}</div>
        <Display value={this.state.displays}></Display>

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
