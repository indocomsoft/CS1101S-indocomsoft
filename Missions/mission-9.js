// Source Week 6, sound

// Task 1

// Function type: Number -> Pair(Number, Number)
// where input is between 0 - 10 inclusive, where 0 - 9 represent the digits
// and 10 represents #
function get_dtmf_frequencies(digit) {
    var r1 = 697;
    var r2 = 770;
    var r3 = 852;
    var r4 = 941;
    var c1 = 1209;
    var c2 = 1366;
    var c3 = 1477;
    var freqs = list(pair(r4, c2),
                     pair(r1, c1),
                     pair(r1, c2),
                     pair(r1, c3),
                     pair(r2, c1),
                     pair(r2, c2),
                     pair(r2, c3),
                     pair(r3, c1),
                     pair(r3, c2),
                     pair(r3, c3),
                     pair(r4, c3));
    return list_ref(freqs, digit);
}

// Task 2
function create_dtmf_tone(frequency_pair) {
    return simultaneously(list(sine_sound(head(frequency_pair), 0.5),
                               sine_sound(tail(frequency_pair), 0.5)));
}

// Paste your function get_dtmf_frequencies from Task 1 here
function get_dtmf_frequencies(digit) {
    var r1 = 697;
    var r2 = 770;
    var r3 = 852;
    var r4 = 941;
    var c1 = 1209;
    var c2 = 1366;
    var c3 = 1477;
    var freqs = list(pair(r4, c2),
                     pair(r1, c1),
                     pair(r1, c2),
                     pair(r1, c3),
                     pair(r2, c1),
                     pair(r2, c2),
                     pair(r2, c3),
                     pair(r3, c1),
                     pair(r3, c2),
                     pair(r3, c3),
                     pair(r4, c3));
    return list_ref(freqs, digit);
}

// Paste your function create_dtmf_tone from Task 2 here
function create_dtmf_tone(frequency_pair) {
    return simultaneously(list(sine_sound(head(frequency_pair), 0.5),
                               sine_sound(tail(frequency_pair), 0.5)));
}

// Task 3
function dial(list_of_digits) {
    var dtmf_sound = create_dtmf_tone(get_dtmf_frequencies(
                                            head(list_of_digits)));
    if (is_empty_list(tail(list_of_digits))) {
        return dtmf_sound;
    } else {
        return consecutively(list(dtmf_sound,
                                  silence(0.1),
                                  dial(tail(list_of_digits))));
    }
}

// Test
// play(dial(list(6,2,3,5,8,5,7,7)));

// Paste your function get_dtmf_frequencies from Task 1 here
function get_dtmf_frequencies(digit) {
    var r1 = 697;
    var r2 = 770;
    var r3 = 852;
    var r4 = 941;
    var c1 = 1209;
    var c2 = 1366;
    var c3 = 1477;
    var freqs = list(pair(r4, c2),
                     pair(r1, c1),
                     pair(r1, c2),
                     pair(r1, c3),
                     pair(r2, c1),
                     pair(r2, c2),
                     pair(r2, c3),
                     pair(r3, c1),
                     pair(r3, c2),
                     pair(r3, c3),
                     pair(r4, c3));
    return list_ref(freqs, digit);
}

// Paste your function create_dtmf_tone from Task 2 here
function create_dtmf_tone(frequency_pair) {
    return simultaneously(list(sine_sound(head(frequency_pair), 0.5),
                               sine_sound(tail(frequency_pair), 0.5)));
}

// Paste your function dial from Task 3 here
function dial(list_of_digits) {
    var dtmf_sound = create_dtmf_tone(get_dtmf_frequencies(
                                            head(list_of_digits)));
    if (is_empty_list(tail(list_of_digits))) {
        return dtmf_sound;
    } else {
        return consecutively(list(dtmf_sound,
                                  silence(0.1),
                                  dial(tail(list_of_digits))));
    }
}

// Task 4
function dial_all(list_of_numbers) {
    function is_allowed(list_of_digits) {
        var forbidden = list(1, 8, 0, 0, 5, 2, 1, 1, 9, 8, 0);
        return (!equal(list_of_digits,forbidden));
    }
    var filtered_list = filter(is_allowed, list_of_numbers);
    var starred_list = map(function(x) {
                               return append(x, list(10));
                           }, filtered_list);
    var dial_list =  accumulate(append, [], starred_list);
    return dial(dial_list);
}

// Test
// play(dial_all(
//  list(
//      list(1,8,0,0,5,2,1,1,9,8,0),
//      list(6,2,3,5,8,5,7,7),
//      list(0,0,8,6,1,3,7,7,0,9,5,0,0,6,1))
//  ));