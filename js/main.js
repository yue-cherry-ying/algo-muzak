
window.onload = function(){
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  // const ctx = new AudioContext()
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

  const sharpnote = [
    // 185, //F#2
    207.65, //G#2
    233.08, //A#3
    277.18, //C#3
    311.13, //D#3
    369.99, //F#3
    415.3, //G#3
    466.16, //A#4
    554.37, //C#4
    622.25, //D#4
    // 739.99, //F#4
    // 830.61, //G#4
    // 932.33 //A#5
    // 1108.73, //C#5
  ]


  const delayStart = 1
  const tempo = 150
  const beat = 60 / tempo
  const bar = beat * 4
  const root = 277.18
  const scale = sharpnote
  // const notes =

  for (let i = 0; i < 64; i++){
    const time = i * beat + delayStart
    const dur = beat
    const s = Math.floor(Math.random() * sharpnote.length)
    const pitch = sharpnote[s]
    tone('sine', pitch, time, dur)
  }

  document.querySelector('#play').addEventListener('click', function() {
    ctx.resume().then(() => {
      console.log('Playback resumed successfully')
    })
  })

}


/*


  const tone = new OscillatorNode(ctx)
  tone.connect(fft)
  tone.connect(ctx.destination)
  tone.start(ctx.currentTime)
  tone.stop(ctx.currentTime + 1)

*/
