
const masterConfig = {
    strip: {
        channel:{

        }
    },
    send: {
        A: {
            'distortion': {
                meta: {
                    label: 'Drive (distortion)'
                },
                setup: {
                    toneClass:  'Distortion',
                },
                params: {
                    distortion:  0.5,
                    wet:        0 
                }
            }
        },
        B: {
            'reverb': {
                meta: {
                    label: 'Reverb'
                },
                setup: {
                    toneClass:  'Reverb',
                },
                params: {
                    decay:  1.5,
                    wet:    1
                }
            }
        }  
    }
}

const synthConfig = {
    instrument: {
        0: {
            meta: {
                label: 'Synth One',
                part: {
                    body: {
                        poly:       true,
                        toneClass: 'MonoSynth'
                    }
                }
            },
            part: {
                body: {
                    voice: {
                        "volume": -30,
                        "detune": 0,
                        "portamento": 0,
                        "envelope": {
                            "attack": 0,
                            "attackCurve": "linear",
                            "decay": 1.5,
                            "decayCurve": "exponential",
                            "release": 1,
                            "releaseCurve": "exponential",
                            "sustain": 0.5
                        },
                        "filter": {
                            "Q": 4,
                            "detune": 0,
                            "frequency": 0,
                            "gain": 0,
                            "rolloff": -24,
                            "type": "lowpass"
                        },
                        "filterEnvelope": {
                            "attack": 0.6,
                            "attackCurve": "linear",
                            "decay": 1.2,
                            "decayCurve": "exponential",
                            "release": 2,
                            "releaseCurve": "exponential",
                            "sustain": 0.5,
                            "baseFrequency": 1000,
                            "exponent": 2,
                            "octaves": 3
                        },
                        "oscillator": {
                            "detune": 0,
                            "frequency": 440,
                            "partialCount": 0,
                            "partials": [],
                            "phase": 0,
                            "type": "sawtooth"
                        }
                    }
                }
            },

        }
    },
    strip: {
        channel:{

        }
    },
    send: {
        A: {
            'delay': {
                meta: {
                    label: 'Ping Pong Delay'
                },
                setup: {
                    toneClass:  'PingPongDelay',
                },
                params: {
                    "wet": 1,
                    "feedback": 0.85,
                    "delayTime": 0.25,
                    "maxDelay": 1
                }
            }
        }  
    }

}

const drumkitConfig = {
    instrument: {
        kick: {
            voice: {
                body: {
                    "volume": -6.6,
                    "detune": 0,
                    "portamento": 0,
                    "envelope": {
                        "attack": 0.005,
                        "attackCurve": "exponential",
                        "decay": 0.2,
                        "decayCurve": "exponential",
                        "release": 0.1,
                        "releaseCurve": "exponential",
                        "sustain": 0
                    },
                    "oscillator": {
                        "partialCount": 0,
                        "partials": [],
                        "phase": 0,
                        "type": "sine"
                    },
                    "octaves": 3,
                    "pitchDecay": 0.125
                },
                transient: {
                    "volume": 0,
                    "envelope": {
                        "attack": 0.00001,
                        "attackCurve": "exponential",
                        "decay": 0.00005,
                        "decayCurve": "exponential",
                        "release": 0,
                        "releaseCurve": "exponential",
                        "sustain": 0
                    },
                    "noise": {
                        "fadeIn": 0,
                        "fadeOut": 0,
                        "playbackRate": 1,
                        "type": "white"
                    }
                }
            }

        },
        snare: {
            voice: {
                noise: {
                    "volume": 0,
                    "envelope": {
                        "attack": 0.001,
                        "attackCurve": "exponential",
                        "decay": 0.125,
                        "decayCurve": "exponential",
                        "release": 0.05,
                        "releaseCurve": "exponential",
                        "sustain": 0
                    },
                    "noise": {
                        "fadeIn": 0,
                        "fadeOut": 0,
                        "playbackRate": 0.5,
                        "type": "white"
                    }
                },
                transient: {
                    "volume": 0,
                    "envelope": {
                        "attack": 0.00001,
                        "attackCurve": "exponential",
                        "decay": 0.00005,
                        "decayCurve": "exponential",
                        "release": 0,
                        "releaseCurve": "exponential",
                        "sustain": 0
                    },
                    "noise": {
                        "fadeIn": 0,
                        "fadeOut": 0,
                        "playbackRate": 1,
                        "type": "white"
                    }
                },
            },
            modifier: {
                voice: {
                    noise: {
                    filter: {
                            "Q": 1,
                            "detune": 0,
                            "frequency": 1500,
                            "gain": 0,
                            "rolloff": -12,
                            "type": "bandpass"
                        }
                    },
                }
            }


        },
        hihatClosed: {
            voice: {
                body: {
                    "volume": -15,
                    "detune": 0,
                    "portamento": 0,
                    "envelope": {
                        "attack": 0.0005,
                        "attackCurve": "exponential",
                        "decay": 0.075,
                        "decayCurve": "exponential",
                        "release": 0.125,
                        "releaseCurve": "exponential",
                        "sustain": 0
                    },
                    "harmonicity": 2,
                    "modulationIndex": 2,
                    "octaves": 2,
                    "resonance": 3500
                },
            }

        },
        hihatOpen: {
            voice: {
                body: {
                    "volume": -18,
                    "detune": 0,
                    "portamento": 0,
                    "envelope": {
                        "attack": 0.001,
                        "decay": 0.175,
                        "release": 1.5,
                        "sustain": 0.1
                    },
                    "harmonicity": 2,
                    "modulationIndex": 2,
                    "octaves": 1.5,
                    "resonance": 4000
                }
            },
            modifier: {
                voice: {
                    body: {
                        filter: {
                            "Q": 4,
                            "detune": 0,
                            "frequency": 7000,
                            "gain": 0,
                            "rolloff": -12,
                            "type": "highpass"
                        }   
                    }
                }
            }
        }
    },
    strip: {
        compressor: {
            "attack": 0.003,
            "knee": 30,
            "ratio": 20,
            "release": 0.25,
            "threshold": -36
        },
        channel:{

        }
    }
}
