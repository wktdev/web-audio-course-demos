"use strict"



function audioFileLoader(fileDirectory) {
    var soundObj = {};
    soundObj.fileDirectory = fileDirectory;



    var getSound = new XMLHttpRequest();
    getSound.open("GET", soundObj.fileDirectory, true);
    getSound.responseType = "arraybuffer";
    getSound.onload = function() {
        audioContext.decodeAudioData(getSound.response, function(buffer) {
            soundObj.soundToPlay = buffer;

        });
    }

    getSound.send();

    soundObj.play = function(volumeVal) {
        var volume = audioContext.createGain();
        volume.gain.value = volumeVal;
        var playSound = audioContext.createBufferSource();
        playSound.buffer = soundObj.soundToPlay;
        playSound.connect(volume);
        volume.connect(audioContext.destination)
        playSound.start(audioContext.currentTime)
    }


    return soundObj;

}

/*  Load and play  */
var snare = audioFileLoader("snare.mp3");

function keyPressed() {

    snare.play(0.2);

}


window.addEventListener("keydown", keyPressed, false);