// Source Week 6, sound

// Task 1
function generate_list_of_note(letter_name, list_of_interval) {
    function helper(lst, prev, acc) {
        if (is_empty_list(lst)) {
            return acc;
        } else {
            var note = prev + head(lst);
            return helper(tail(lst), note, append(acc, list(note)));
        }
    }
    var base_note = letter_name_to_midi_note(letter_name);
    return pair(base_note, helper(list_of_interval, base_note, []));
}

var major_scale_interval = list(2, 2, 1, 2, 2, 2, 1, -1, -2, -2, -2, -1, -2, -2);
var c_major_scale = generate_list_of_note("C4", major_scale_interval);

//display(c_major_scale);

function list_to_sound(list_of_midi_note, duration) {
    var freq_list = map(midi_note_to_frequency, list_of_midi_note);
    return consecutively(map(function(x) {
                                 return sine_sound(x, duration);
                             }, freq_list));
}

// var c_major_scale_sound = list_to_sound(c_major_scale, 0.4);
// play(c_major_scale_sound);

var harmonic_minor_scale_interval = list(2, 1, 2, 2, 1, 3, 1, -1, -3, -1, -2, -2, -1, -2);

var melodic_minor_scale_interval = list(2, 1, 2, 2, 2, 2, 1, -2, -2, -1, -2, -2, -1, -2);


var c_harmonic_minor_scale = generate_list_of_note("C4",
                                            harmonic_minor_scale_interval);
// var c_harmonic_minor_scale_sound = list_to_sound(c_harmonic_minor_scale, 0.4);
// play(c_harmonic_minor_scale_sound);

var c_melodic_minor_scale = generate_list_of_note("C4",
                                            melodic_minor_scale_interval);
// var c_melodic_minor_scale_sound = list_to_sound(c_melodic_minor_scale, 0.4);
// play(c_melodic_minor_scale_sound);


// Task 2
function generate_list_of_note(letter_name, list_of_interval) {
    function helper(lst, prev, acc) {
        if (is_empty_list(lst)) {
            return acc;
        } else {
            var note = prev + head(lst);
            return helper(tail(lst), note, append(acc, list(note)));
        }
    }
    var base_note = letter_name_to_midi_note(letter_name);
    return pair(base_note, helper(list_of_interval, base_note, []));
}

function list_to_sound(list_of_midi_note, duration) {
    var freq_list = map(midi_note_to_frequency, list_of_midi_note);
    return consecutively(map(function(x) {
                                 return sine_sound(x, duration);
                             }, freq_list));
}

var major_arpeggio_interval = list(4, 3, 5, 4, 3, 5);
var minor_arpeggio_interval = list(4, 2, 6, 4, 2, 6);
function generate_arpeggio(letter_name, list_of_interval) {
    return generate_list_of_note(letter_name, list_of_interval);
}

function arpeggiator_up(arpeggio, duration_each) {
    function helper(n) {
        if (n <= length(arpeggio) - 4) {
            // build the current block of 4 notes
            var cur = build_list(4, function(x){
                                        return list_ref(arpeggio, n + x);
                                    });
            return consecutively(list(list_to_sound(cur, duration_each),
                                      helper(n + 1)));
        } else {
            return silence(0);
        }
    }
    return length(arpeggio) < 4 ? arpeggio
                                : helper(0);
}

// test
// play(arpeggiator_up(generate_arpeggio("C4", major_arpeggio_interval), 0.1));

// Task 3
function exponential_decay(decay_time) {
    return function(t) {
        return t <= decay_time ? math_exp(-4 * math_log(2) * t / decay_time)
                              : 0;
    };
}

// test
// display((exponential_decay(4))(1));
// the result should be 0.5

// Task 4
function exponential_decay(decay_time) {
    return function(t) {
        return t <= decay_time ? math_exp(-4 * math_log(2) * t / decay_time)
                              : 0;
    };
}

function adsr(attack_time, decay_time, sustain_level, release_time) {
    return function(sound) {
        var sound_ss = sound_to_sourcesound(sound);
        var total_time = get_duration(sound_ss);
        var sustain_time = total_time - attack_time - decay_time
                             - release_time;
        var decay_ratio_at = exponential_decay(decay_time);
        var release_ratio_at = exponential_decay(release_time);
        var adsr = make_sourcesound(
                    function(t){
                        var cur = (get_wave(sound_ss))(t);
                        if (t < attack_time) {
                            return (t / attack_time) * cur;
                        } else if (t < attack_time + decay_time) {
                            var decay_ratio = decay_ratio_at(t - attack_time);
                            var norm_decay_ratio = decay_ratio *
                                                    (1 - sustain_level)
                                                         + sustain_level;
                            return norm_decay_ratio * cur;
                        } else if (t < total_time - release_time) {
                            return sustain_level * cur;
                        } else if (t < total_time) {
                            var t_elapsed = total_time - release_time;
                            var release_ratio = release_ratio_at(t - t_elapsed);
                            var norm_release_ratio = release_ratio
                                                        * sustain_level;
                            return norm_release_ratio * cur;
                        } else {
                            return 0;
                        }
                }, total_time);
        return sourcesound_to_sound(adsr);
    };
}

var sample1 = (adsr(0, 0.2, 0.1, 0.5))(sine_sound(800, 1));
var sample2 = (adsr(0.4, 0, 1, 0.8))(sine_sound(400, 2));
var sample3 = (adsr(0.01, 0.5, 0.5, 0.5))(sine_sound(400, 2));
var sample4 = (adsr(0.6, 0.2, 0, 0))(sine_sound(800, 1));

// play(sample1);