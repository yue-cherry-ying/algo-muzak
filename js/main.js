
const ctx = new (window.AudioContext || window.webkitAudioContext)()
const fft = new AnalyserNode(ctx, { fftSize: 2048 })
createWaveCanvas({ element: 'section', analyser: fft })

function tone(type, pitch, time, duration){
  const t = time || ctx.currentTime
  const dur = duration || 1
  const osc = new OscillatorNode(ctx, {
    type: type || 'sine',
    frequency: pitch || 440
  })
  const lvl = new GainNode(ctx, {gain: 0.001})
  osc.connect(lvl)
  lvl.connect(ctx.destination)
  lvl.connect(fft)
  osc.start(t)
  osc.stop(t + 4)
  adsr({
    param: lvl.gain,
    time: t,
    duration: dur
  })
}

function adsr(opts){
  const param = opts.param
  const peak = opts.peak || 1
  const hold = opts.hold || 0.7
  const time = opts.time || ctx.currentTime
  const dur = opts.duration || 1
  const a = opts.attack || dur * 0.2
  const d = opts.decay || dur * 0.1
  const s = opts.sustain || dur * 0.5
  const r = opts.release || dur * 0.2

  const initVal = param.value
  param.setValueAtTime(initVal, time)
  param.linearRampToValueAtTime(peak, time+a)
  param.linearRampToValueAtTime(hold, time+a+d)
  param.linearRampToValueAtTime(hold, time+a+d+s)
  param.linearRampToValueAtTime(initVal, time+a+d+s+r)
}

function step(rootFreq, steps){
  let tr2 = Math.pow(2, 1 / 12)
  let rnd = rootFreq * Math.pow(tr2, steps)
  return Math.round(rnd * 100) / 100
}

const sharp = [1, 4, 6, 9, 11]

const delayStart = 1
const tempo = 140
const beat = 60 / tempo
const bar = beat * 4
const root = 440
const scale = sharp
// const notes =

for (let i = 0; i < 16; i++){
  const time = i * beat + delayStart
  const dur = beat
  const s = Math.floor(Math.random() * sharp.length)
  // const idx = sharp[s]
  const pitch = step(root, sharp[s])
  tone('sine', pitch, time, dur)
}

/*

  const tone = new OscillatorNode(ctx)
  tone.connect(fft)
  tone.connect(ctx.destination)
  tone.start(ctx.currentTime)
  tone.stop(ctx.currentTime + 1)

*/
