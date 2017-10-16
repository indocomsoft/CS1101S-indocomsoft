// Source Week 5

// Task 1

function pentatonic_scale(note, number_of_notes) {
    var scale = list(2, 2, 3, 2, 3);
    function helper(note, n){
        return n === number_of_notes ? []
                                     : pair(note,
                                            helper(note + list_ref(scale,
                                                                   n % 5),
                                                   n + 1));
    }
    return helper(note, 0);
}

// test
/* var sample = pentatonic_scale(60, 10);
   play(consecutively(map(function (note) {
       return trombone(note, 0.5);
   }, sample))); */


// Task 2

function pentatonic_scale(note, number_of_notes) {
    var scale = list(2, 2, 3, 2, 3);
    function helper(note, n){
        return n === number_of_notes ? []
                                     : pair(note,
                                            helper(note + list_ref(scale,
                                                                   n % 5),
                                                   n + 1));
    }
    
    return helper(note, 0);
}

function play_matrix(distance, list_of_sounds) {
    function get_matrix_xy(x, y){
        return list_ref(list_ref(get_matrix(), y), x);
    }
    function parse_col(x, n, acc){
        if (n === 16) {
            return simultaneously(acc);
        } else {
            var cur = get_matrix_xy(x, n);
            return parse_col(x,
                             n + 1,
                             (cur ? pair(list_ref(list_of_sounds, n), acc)
                                  : acc));
        }
    }
    function helper(n, acc){
        if (n === 16) {
            return simultaneously(acc);
        } else {
            return helper(n + 1,
                          pair(consecutively(list(silence(n * distance),
                                             parse_col(n, 0, []))),
                               acc));
        }
    }
    function recurring(){
        set_timeout(recurring, distance * 16 * 1000);
        play_concurrently(helper(0, []));
    }
    recurring();
}

function stop_matrix() {
    clear_all_timeout();
}

/* var scales = pentatonic_scale(60, 16);
   var sounds = map(function (n) { return piano(n, 1); }, scales);
   play_matrix(0.5, sounds); */