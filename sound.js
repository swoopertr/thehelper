helper={
    sound_player : {
        audio_object: undefined,
        load_sound: function(url, cb) {
            this.audio_object = new Audio(url);
            this.audio_object.addEventListener('loadeddata', () => {
                cb && cb();
              })
        },
        play_sound: function() {
            this.audio_object.play();
        },
        pause_sound: function() {
            thid.audio_object.pause();
        },
        stop_sound: function() {
            this.audio_object.pause();
            this.audio_object.currentTime = 0;
        },
        set_volume: function(volume) {
            this.audio_object.volume = volume;
        },
        mute_sound: function() {
            this.audio_object.volume = 0;
        }
    }
};
