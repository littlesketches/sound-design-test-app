
/**
 *  MASTER OUTPUT CHANNEL 
 */ 
const masterStrip = {
    channel: new Tone.Channel(masterConfig.strip.channel),
    send: {}
}
// Patch channel strip
const masterStripChain = masterStrip.channel.chain(
    Tone.getDestination()
)

// Setup and patch sends
for(const [sendId, sendObj] of Object.entries(masterConfig.send)){
    masterStrip.send[sendId] = {
        channel:  new Tone.Channel()
    }

    // Bussing from send channel to master channel
    const busId = `master-send-[${sendId}]`,
        output = Tone.getDestination(),
        masterChannel = masterStrip.channel,
        sendChannel = masterStrip.send[sendId].channel

    masterChannel.send(busId)
    sendChannel.receive(busId)

    // Build FX node on the channel 
    for(const [fxId, fxObj] of Object.entries(sendObj)){
        const fxNode = masterStrip.send[sendId][fxId] = new Tone[fxObj.setup.toneClass](fxObj.params) 
        fxNode.connect(output)              // Connect every fxNode to the channeloutput
        sendChannel.connect(fxNode) // Connect first fxNode to the send channel for bussing
    }
}


/**
 *  DRUM SYNTHS
 */ 
// Create instruments and channel strip
const drumkit = {
    instrument: {
        kick: {
            label:  "Kick drum",
            note:   "A1",
            voice:  {
                body:       new Tone.MembraneSynth(drumkitConfig.instrument.kick.voice.body)
            }
        },
        snare: {
            label:  "Snare drum",
            note:   "C2",
            voice: {
                noise:      new Tone.NoiseSynth(drumkitConfig.instrument.snare.voice.noise),
                transient:  new Tone.NoiseSynth(drumkitConfig.instrument.snare.voice.transient)
            }, 
            modifier: {
                voice: {
                    noise:  new Tone.Filter(drumkitConfig.instrument.snare.modifier.voice.noise.filter)
                }
            }
        },
        hihatClosed: {
            label:  "Closed hihat",
            note:   "C4",
            voice: {
                body:       new Tone.MetalSynth(drumkitConfig.instrument.hihatClosed.voice.body)
            }
        },
        hihatOpen: {
            label:  "Open hihat",
            note:   "D4",
            voice: {        
                body:   new Tone.MetalSynth(drumkitConfig.instrument.hihatOpen.voice.body)
            },

            modifier: {
                voice: {
                    body:  new Tone.Filter(drumkitConfig.instrument.hihatOpen.modifier.voice.body.filter)
                }
            }
        }
    },
    strip: {
        compressor: new Tone.Compressor(drumkitConfig.strip.compressor),
        channel:    new Tone.Channel(drumkitConfig.strip.channel)
    }
}

// Patch drum group channel 
const drumkitChain = drumkit.strip.compressor.chain(
        drumkit.strip.channel, 
        masterStripChain
    )

// Patch each drum instrument 
drumkit.instrument.kick.voice.body.chain(drumkitChain)
drumkit.instrument.snare.voice.noise.chain(drumkit.instrument.snare.modifier.voice.noise, drumkitChain)
drumkit.instrument.snare.voice.transient.chain(drumkitChain)
drumkit.instrument.hihatClosed.voice.body.chain(drumkitChain)
drumkit.instrument.hihatOpen.voice.body.chain(drumkit.instrument.hihatOpen.modifier.voice.body, drumkitChain)


/**
 *  KEYBOARD SYNTH
 */ 
const synth = {
    instrument: {},
    strip: {
        channel: new Tone.Channel(synthConfig.strip.channel),
        send: {}
    } 
}
// Patch channel strip
synth.strip.channel.connect(masterStripChain)

// Create Synth instrument
for( const [synthId, synthObj] of Object.entries(synthConfig.instrument)){
    synth.instrument[synthId] = {}
    for( const [partId, partObj] of Object.entries(synthObj.part) ){
        synth.instrument[synthId][partId] = synthObj.meta.part[partId].poly ?
            new Tone.PolySynth(Tone[synthObj.meta.part[partId].toneClass], partObj.voice) 
            : new Tone[synthObj.meta.part[partId].toneClass](partObj.voice)

        synth.instrument[synthId][partId].connect(synth.strip.channel)
    }
}


// Create and path Sends
for(const [sendId, sendObj] of Object.entries(synthConfig.send)){
    synth.strip.send[sendId] = {
        channel:  new Tone.Channel()
    }

    // Bussing from instrument send channel and the combined synth channel
    const busId = `synth-send-[${sendId}]`,
        output = masterStripChain,
        instrumentChannel =  synth.strip.send[sendId].channel,
        synthGroupChannel = synth.strip.channel
    
    synthGroupChannel.send(busId)
    instrumentChannel.receive(busId)

    // Build FX node on the channel 
    for(const [fxId, fxObj] of Object.entries(sendObj)){
       const fxNode = synth.strip.send[sendId][fxId] = new Tone[fxObj.setup.toneClass](fxObj.params) 
        fxNode.connect(output)
        // Connect first fxNode to the send channel for bussing
        instrumentChannel.connect(fxNode)
    }
}


/**
 *  STATE AND EVENT HANDLERS 
 */
const state = {
    keyboard: {
        synth: '0'
    }
}

// EVENT HANDLERS
const handle = {
    sequencer: {
        step: (detail) => {
            const drumName = Object.keys(drumkit.instrument)[detail.row], 
                voices = drumkit.instrument[drumName].voice,
                note = drumkit.instrument[drumName].note

            for(const [voiceName, voiceSynth] of Object.entries(voices)){
                switch(voiceSynth.name){
                    case 'NoiseSynth':
                        voiceSynth.triggerAttackRelease("64n", "+0.025")
                        break
                    default:
                        voiceSynth.triggerAttackRelease(note, "64n", "+0.025")
                }
            }
        }
    },
    keyboard: {
        noteOn: (note) => {
            synth.instrument[state.keyboard.synth].body.triggerAttack(note.name)
        },
        noteOff: (note) => {
            synth.instrument[state.keyboard.synth].body.triggerRelease(note.name)
        }
    }
}

/**
 *  USER INTERFACE 
 */ 


// TRANSPORT 


document.querySelector("tone-play-toggle")
    .addEventListener("start", () => Tone.Transport.start());
document.querySelector("tone-play-toggle")
    .addEventListener("stop", () => Tone.Transport.stop());
document.getElementById("bpm__slider")
    .addEventListener("change", (ev) => Tone.Transport.bpm.value = ev.detail.value );
Tone.Transport.bpm.value = 96

// DRUM SEQUENCER
document
    .querySelector("tone-step-sequencer")
    .addEventListener("trigger", (ev) => handle.sequencer.step(ev.detail) );


// Keyboard and synth
piano({ 
    name:       "Keyboard",       
    noteon:     (note) => handle.keyboard.noteOn(note),
    noteoff:    (note) => handle.keyboard.noteOff(note),
    parent:     document.getElementById('keyboard-ui')
});
// Synth instrument parts
for( const [synthId, synthObj] of Object.entries(synth.instrument)){
    for(const [partId, partObj] of Object.entries(synthObj)){

        ui({
            name:   `Synth ${synthId} - ${partId}`,
            tone:   partObj,
            parent: document.getElementById('synth-param-ui')
        });
    }
}
// Synth channel; strip and sends
for( const [id, obj] of Object.entries(synth.strip)){
    if(id !=='send'){ // Channel nodes
        ui({
            name:   `Synth ${id}`,
            tone:   obj,
            parent: document.getElementById('synth-param-ui')
        });
    } else { // Sends
        for(const [sendId, sendObj] of Object.entries(obj)){
            for( const [fxId, fxNode] of Object.entries(sendObj)){
                if(fxNode.name !== 'Channel'){

                    ui({
                        name:   `Send ${sendId} - ${fxId}`,
                        tone:   fxNode,
                        parent: document.getElementById('synth-param-ui')
                    });
                }
            }
        }
    }
}

// Drum instruments: voices and modifiers
for(const [drumId, drumObj] of Object.entries(drumkit.instrument)){
    for( const [voiceId, voice] of Object.entries(drumObj.voice) ){
        ui({
            name:   `${drumObj.label}: ${voiceId}`,
            tone:   voice,
            parent: document.getElementById('drumkit-param-ui')
        });
    }
    if(drumObj?.modifier?.voice){
        for( const [voiceId, voice] of Object.entries(drumObj.modifier.voice) ){
            ui({
                name:   `${drumObj.label}: ${voice.name.toLowerCase()}`,
                tone:   voice,
                parent: document.getElementById('drumkit-param-ui')
            });
        }
    }
}

// Drum kit channel strip
for( const [id, node] of Object.entries(drumkit.strip)){
    ui({
        name:   `Drumkit ${id}`,
        tone:   node,
        parent: document.getElementById('drumkit-param-ui')
    });
}

// Master channel send effects
ui({
    name:   `Master channel`,
    tone:   masterStrip.channel,
    parent: document.getElementById('master-param-ui')
});

for( const [sendId, sendObj] of Object.entries(masterStrip.send)){
    for( const [fxId, fxObj] of Object.entries(sendObj)){

        if(fxObj.name !== "Channel"){
            ui({
                name:   fxId,
                tone:   fxObj,
                parent: document.getElementById('master-param-ui')
            });      
        }
    }
}