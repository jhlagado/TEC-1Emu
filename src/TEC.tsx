import { Z80, Z80State } from "./z80";
import { ROM } from "./ROM";
import MemoryMap from 'nrf-intel-hex';

const MAX_TICKS = 1000;

export class TEC {

  cpu = Z80({
    mem_read: (addr) => this.memory[addr],
    mem_write: (addr, value) => this.memory[addr] = value,
    io_read: (port) => this.inPorts[port & 0xFF],
    io_write: (port, value) => this.outPorts[port & 0xFF] = value,
  });

  memory = Array(4000).map(() => 0xFF);
  inPorts = Array(256).map(() => 0xFF);
  outPorts = Array(256).map(() => 0xFF);
  digits = 0;
  segments = 0;
  displays = Array(6);
  numCycles = 0;
  frequency = 0;
  speakerBit = 0;
  perfNow = performance.now();
  state = this.cpu.getState();

  reset = this.cpu.reset;
  interrupt = this.cpu.interrupt;

  loadROM() {
    const blocks = MemoryMap.fromHex(ROM);

    for (let address of blocks.keys()) {
      const block = blocks.get(address);
      for (let i = address; i < address + block.length; i++) {
        this.memory[i] = block[i];
      }
    }
  }

  step(cb) {
    this.cpu.run_instruction();
    this.update(cb);
  }

  run(cb) {

    let iter = this.cpu.run();
    let item = iter.next();
    let op = item.value;
    let done = item.done;

    const loop = () => {
      if (done)
        return;
      else if (op.opcode === 0xD3) {
        this.outPorts[op.port] = op.value;
      }
      this.update(cb);
      let item = iter.next();
      op = item.value;
      done = item.done;
      requestAnimationFrame(loop);
    }

    loop();
  }

  update(cb?) {
    this.state = this.cpu.getState();
    this.digits = this.outPorts[1]
    this.segments = this.outPorts[2]
    let mask = 0x01;
    for (let i = 0; i < 6; i++) {
      if (this.digits & mask)
        this.displays[i] = this.segments;
      mask = mask << 1;
    }
    const speakerBit = this.outPorts[1] >> 7;
    if (speakerBit && !this.speakerBit) {
      this.numCycles++;
    }
    this.speakerBit = speakerBit;
    const perfNow = performance.now();
    const millis = perfNow - this.perfNow;
    if (millis > 100) {
      this.frequency = (this.numCycles / millis) * 1000;
      this.numCycles = 0;
      this.perfNow = perfNow;
    }
    if (cb) {
      cb();
    }
  }

}
