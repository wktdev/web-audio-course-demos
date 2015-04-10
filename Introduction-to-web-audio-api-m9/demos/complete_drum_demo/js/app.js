$(function() {
    var isPlaying = false; // Are we currently playing?
    var current16thNote; // What note is currently last scheduled?
    var tempo = 120.0; // tempo (in beats per minute)
    //(in milliseconds)
    var futureTickTime = 0.0; // when the next note is due.
    // var noteResolution = 0; // 0 == 16th, 1 == 8th, 2 == quarter note
    var noteLength = 0.05; // length of "beep" (in seconds)
    var timerID = 0; // setInterval identifier.



    //______________________________________LOAD SOUNDS___________________________________


    var snare = audioFileLoader("snare.mp3"); // this is done using audiolib.js
    var kick = audioFileLoader("kick.mp3");
    var hihat = audioFileLoader("hihat.mp3");
    var shaker = audioFileLoader("shaker.mp3");



    //______________________________________end of LOAD SOUNDS_____________________________

    var track1 = [],
        track2 = [],
        track3 = [],
        track4 = [];

    var track1Que = [],
        track2Que = [],
        track3Que = [],
        track4Que = [];

    function futureTick() {
        // Advance current note and time by a 16th note...
        var secondsPerBeat = 60.0 / tempo; // Notice this picks up the CURRENT 
        // tempo value to calculate beat length.
        futureTickTime += 0.25 * secondsPerBeat; // Add beat length to last beat time

        current16thNote++; // Advance the beat number, wrap to one
        if (current16thNote > 16) {
            current16thNote = 1;
        }
    }



    function setDemoDivColors(domElementGridNote, arr) {

        for (i = 0; i < arr.length; i += 1) {
            $(domElementGridNote + arr[i]).css("background-color", "yellow");

        }
    }

    setDemoDivColors('#gridBeatTrack1-Rhyth', track1);
    setDemoDivColors('#gridBeatTrack2-Rhyth', track2);
    setDemoDivColors('#gridBeatTrack3-Rhyth', track3);
    setDemoDivColors('#gridBeatTrack4-Rhyth', track4);


    function checkIfRecordedAndPlay(trackArray, sndToPlay, gridBeat, timeVal) {

        for (i = 0; i < trackArray.length; i += 1) {

            if (gridBeat === trackArray[i]) {

                sndToPlay.play(timeVal)

            }
        }

        console.log(track1Que)

        track1.push(track1Que[0])
        track1Que[0] = undefined

        track2.push(track2Que[0])
        track2Que[0] = undefined

        track3.push(track3Que[0])
        track3Que[0] = undefined

        track4.push(track4Que[0])
        track4Que[0] = undefined



    };



    function scheduleNote(beatNumber, time) {


        $("#metro-ui-" + (beatNumber)).effect("pulsate", {
            times: 1
        }, 10);
        checkIfRecordedAndPlay(track1, kick, beatNumber, time);
        checkIfRecordedAndPlay(track2, snare, beatNumber, time);
        checkIfRecordedAndPlay(track3, hihat, beatNumber, time);
        checkIfRecordedAndPlay(track4, shaker, beatNumber, time);
        // create an oscillator metronome
        // var osc = audioContext.createOscillator();
        // osc.connect(audioContext.destination);
        // osc.frequency.value = 180.0;
        // osc.start(time);
        // osc.stop(time + noteLength);

        removeDuplicates(track1); //____ Checks for duplicates in our track arrays and removes them so two sounds don't get 'recorded' twice and place twice
        removeDuplicates(track2);
        removeDuplicates(track3);
        removeDuplicates(track4);

    }




    function scheduler() {
        // while there are notes that will need to play before the next interval, 
        // schedule them and advance the pointer.
        while (futureTickTime < audioContext.currentTime + 0.1) {
            scheduleNote(current16thNote, futureTickTime);
            futureTick();
        }
        timerID = window.setTimeout(scheduler, 50.0);
    }



    //_____________TRANSPORT CONTROLS____________________________________________________________

    function play() {
        isPlaying = !isPlaying;

        if (isPlaying) { // start playing
            current16thNote = 1;
            futureTickTime = audioContext.currentTime;
            console.log(futureTickTime)
            scheduler(); // kick off scheduling
            return "stop";
        } else {
            window.clearTimeout(timerID);
            return "play";
        }
    }



    $("#play-button").on("click", function() {
        play();
    })



    $("#tempo").on("change", function() {
        tempo = this.value;
        $("#showTempo").html(tempo);
    })

    //____________end of TRANSPORT CONTROLS___________________________________________________________________________________








    //____________________GRID TOGGLE EVENTS__________________________________________________________________________________________________


    function sequenceGridToggler(classDomEle, arr) {
        $(classDomEle).on("mousedown", function() {
            // console.log(classDomEle)
            var rhythmicValue = parseInt(this.id.match(/(\d+)$/)[0], 10);
            var index = arr.indexOf(rhythmicValue);
            if (index > -1) {
                arr.splice(index, 1);
                $('#' + this.id).css("background-color", "");
            } else {
                arr.push(rhythmicValue);
                $('#' + this.id).css("background-color", "yellow");
            }
        });

    }

    sequenceGridToggler(".grid-track1", track1);
    sequenceGridToggler(".grid-track2", track2);
    sequenceGridToggler(".grid-track3", track3);
    sequenceGridToggler(".grid-track4", track4);


    //__________________end of GRID TOGGLE EVENTS_____________________________________________________________________________________________



    function removeDuplicates(arr) {

        for (i = 0; i < arr.length - 1; i += 1) {

            for (j = i + 1; j < arr.length; j += 1)

                if (arr[i] === arr[j]) {
                arr.splice(i, 1);

            }
        };

        // console.log(arr)


    };
    //_____________________DRUM PAD EVENTS ___________________________________________________________________________________________________________

    function drumPadAction(domElementDrumPad, domElementGridNote, arrayTrack, sound) { //_______send to the appropriate array

        $(domElementDrumPad).on("mousedown", function(trackQue) {



            $(domElementGridNote + (current16thNote)).css("background-color", "yellow"); //___________The sequencer note grid value is changed color

            arrayTrack[0] = (current16thNote) //_______send to the appropriate array
            sound.play(audioContext.currentTime);



        });

    }
    drumPadAction("#drumpad-track1", "#gridBeatTrack1-Rhyth", track1Que, kick);
    drumPadAction("#drumpad-track2", "#gridBeatTrack2-Rhyth", track2Que, snare);
    drumPadAction("#drumpad-track3", "#gridBeatTrack3-Rhyth", track3Que, hihat);
    drumPadAction("#drumpad-track4", "#gridBeatTrack4-Rhyth", track4Que, shaker);

    //____________________end of DRUM PAD EVENTS__________________________________________________________________________________________________



});