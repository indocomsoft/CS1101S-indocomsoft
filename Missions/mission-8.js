// Source Week 6, sound

// Task 1
function noise(duration) {
    return make_sourcesound(
               function(x) {
                   if (x >= duration) {
                       return 0;
                   } else {
                       return math_random() * 2 - 1;
                   }
               }, duration);
}

function play_sourcesound(sourcesound) {
    play(sourcesound_to_sound(sourcesound));
}

//play_sourcesound(noise(1));

// Task 2
function noise(duration) {
    return make_sourcesound(
               function(x) {
                   if (x >= duration) {
                       return 0;
                   } else {
                       return math_random() * 2 - 1;
                   }
               }, duration);
}

function play_sourcesound(sourcesound) {
    play(sourcesound_to_sound(sourcesound));
}

function cut_sourcesound(sourcesound, duration) {
    return make_sourcesound(
                function(x) {
                    if (x >= duration) {
                        return 0;
                    } else {
                        return (get_wave(sourcesound))(x);
                    }
                }, duration);
}

var c = cut_sourcesound(noise(1), 0.5);
//play_sourcesound(c);

// Task 3
function sine_sound(frequency, duration) {
   return sourcesound_to_sound(
                make_sourcesound(
                    function(x){
                        if (x >= duration) {
                            return 0;
                        } else {
                            return math_sin(frequency * 2 * math_PI * x);
                        }
                    }, duration));
}

//play(sine_sound(500, 1));

// Task 4
function sine_sound(frequency, duration) {
   return sourcesound_to_sound(
                make_sourcesound(
                    function(x){
                        if (x >= duration) {
                            return 0;
                        } else {
                            return math_sin(frequency * 2 * math_PI * x);
                        }
                    }, duration));
}

function consecutively(list_of_sounds) {
    // concatenate sourcesounds ss1 and ss2
    function cat_sourcesound(ss1, ss2){
        var ss1_duration = get_duration(ss1);
        var total_duration = ss1_duration + get_duration(ss2);
        return make_sourcesound(
                    function(x){
                        if (x >= total_duration) {
                            return 0;
                        } else if (x >= ss1_duration) {
                            return (get_wave(ss2))(x - ss1_duration);
                        } else {
                            return (get_wave(ss1))(x);
                        }
                    }, total_duration);
    }
    function helper(acc_sourcesound, list){
        if(is_empty_list(list)){
            return sourcesound_to_sound(acc_sourcesound);
        } else {
            return helper(cat_sourcesound(acc_sourcesound,
                                          sound_to_sourcesound(head(list))),
                          tail(list));
        }
    }
    var empty_sourcesound = make_sourcesound(
                                    function(x){
                                        return 0;
                                    }, 0);
    return helper(empty_sourcesound, list_of_sounds);
}

// Create dot, dash and pause sounds first
var dot_sound = sine_sound(500, 0.1);
var dash_sound = sine_sound(500, 0.2);
var pause_sound = sine_sound(0, 0.1);

// Build the signal using consecutively
var distress_signal = consecutively(list(dot_sound, pause_sound,
                                         dot_sound, pause_sound,
                                         dot_sound, pause_sound,
                                         pause_sound, pause_sound,
                                         dash_sound, pause_sound,
                                         dash_sound, pause_sound,
                                         dash_sound, pause_sound,
                                         pause_sound, pause_sound,
                                         dot_sound, pause_sound,
                                         dot_sound, pause_sound,
                                         dot_sound));

// Play distress signal
//play(distress_signal);