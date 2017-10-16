// Source Week 5

// Task 1

function noise(duration) {
    return sourcesound_to_sound(
                make_sourcesound(function(t) {
                                    return t <= duration ? math_random() * 2 - 1
                                                         : 0;
                                 }, duration));
}

function decay(duration){
    return duration >= 0.5 ? 0.495 : duration - 0.005;
}

function snare_drum(note, duration) {
    return (adsr(0.005, decay(duration), 0, 0))(noise(duration));
}

function bass_drum(note, duration) {
    return (adsr(0.005, decay(duration), 0, 0))
                (simultaneously(list(sine_sound(67, duration),
                                     sine_sound(71, duration),
                                     sine_sound(73, duration),
                                     sine_sound(79, duration),
                                     sine_sound(83, duration),
                                     sine_sound(89, duration))));
}

function mute(note, duration) {
    return silence(duration);
}

// play(snare_drum(72, 2));
// play(bass_drum(60, 2));
// play(consecutively(list(snare_drum(72, 2), mute(0, 1), bass_drum(60, 2))));

// Task 2

// paste your snare_drum from task 1 here
function noise(duration) {
    return sourcesound_to_sound(
                make_sourcesound(function(t) {
                                    return t <= duration ? math_random() * 2 - 1
                                                         : 0;
                                 }, duration));
}

function decay(duration){
    return duration >= 0.5 ? 0.495 : duration - 0.005;
}

function snare_drum(note, duration) {
    return (adsr(0.005, decay(duration), 0, 0))(noise(duration));
}

function combine_instruments(list_of_instrument) {
    function helper(lst, note, dur) {
        if (is_empty_list(lst)) {
            return [];
        } else {
            return pair((head(lst))(note, dur), helper(tail(lst), note, dur));
        }
    }
    return function(note, dur) {
                return simultaneously(helper(list_of_instrument, note, dur));
           };
}

/* test
var snare_drum_and_bell = combine_instruments(list(snare_drum, bell));
play(snare_drum_and_bell(500, 1))
*/

// Task 3

function simplify_rhythm(rhythm) {
    function iter(rhythm, n) {
        return n === 0 ? [] : append(rhythm, iter(rhythm, n - 1));
    }
    function parser(rhythm){
        if (is_empty_list(rhythm)) {
            return [];
        } else if (is_list(rhythm)) {
            if (is_number(head(rhythm))) {
                return pair(head(rhythm), parser(tail(rhythm)));
            } else {
                return append(parser(head(rhythm)), parser(tail(rhythm)));
            }
        } else {
            return iter(parser(head(rhythm)), tail(rhythm));
        }
    }
    return parser(rhythm);
}

/* test 
var my_rhythm = pair(list(pair(list(1,2,0,1), 2), list(1,3,0,1,3,1,0,3)), 3);
simplify_rhythm(my_rhythm); 
*/

// Task 4

// paste your snare_drum, bass_drum and mute from task 1 here
function noise(duration) {
    return sourcesound_to_sound(
                make_sourcesound(function(t) {
                                    return t <= duration ? math_random() * 2 - 1
                                                         : 0;
                                 }, duration));
}

function decay(duration){
    return duration >= 0.5 ? 0.495 : duration - 0.005;
}

function snare_drum(note, duration) {
    return (adsr(0.005, decay(duration), 0, 0))(noise(duration));
}

function bass_drum(note, duration) {
    return (adsr(0.005, decay(duration), 0, 0))
                (simultaneously(list(sine_sound(67, duration),
                                     sine_sound(71, duration),
                                     sine_sound(73, duration),
                                     sine_sound(79, duration),
                                     sine_sound(83, duration),
                                     sine_sound(89, duration))));
}

function mute(note, duration) {
    return silence(duration);
}

function simplify_rhythm(rhythm) {
    function iter(rhythm, n) {
        return n === 0 ? [] : append(rhythm, iter(rhythm, n - 1));
    }
    function parser(rhythm){
        if (is_empty_list(rhythm)) {
            return [];
        } else if (is_list(rhythm)) {
            if (is_number(head(rhythm))) {
                return pair(head(rhythm), parser(tail(rhythm)));
            } else {
                return append(parser(head(rhythm)), parser(tail(rhythm)));
            }
        } else {
            return iter(parser(head(rhythm)), tail(rhythm));
        }
    }
    return parser(rhythm);
}

function simple_percussions(distance, list_of_sounds, rhythm) {
    var all_sounds_lst = pair(silence(distance), list_of_sounds);
    function parse(rhythm, n, acc) {
        if (is_empty_list(rhythm)) {
            return simultaneously(acc);
        } else {
            return parse(tail(rhythm),
                         n + 1,
                         pair(consecutively(list(silence(n * distance),
                                                 list_ref(all_sounds_lst,
                                                          head(rhythm)))),
                              acc));
        }
    }
    return parse(simplify_rhythm(rhythm), 0, []);
}

/* test
   var my_snare_drum = snare_drum(70, 2);
   var my_bass_drum = bass_drum(80, 2);
   var my_bell = bell(72, 2);
   play(simple_percussions(0.5, list(my_snare_drum, my_bass_drum, my_bell), list(1,2,1,0,3,1,0)));
*/