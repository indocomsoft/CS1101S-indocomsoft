// Source Week 11, streams library

// Task 1
function is_even(n) {
    return n % 2 === 0;
}

function stream_take(xs, n) {
    return pair(head(xs), function() {
                            return n === 0 ? []
                                           : stream_take(stream_tail(xs),
                                                         n - 1); });
}

function stream_drop(xs, n) {
    if (n === 0) {
        return pair(stream_ref(xs, n), function() { return stream_tail(xs); });
    } else {
        return stream_drop(stream_tail(xs), n - 1);
    }
}

var bounded_input = enum_stream(0, 10000);
var even_results = stream_filter(is_even, bounded_input);
var first_ten = stream_take(even_results, 10);
var next_ten = stream_take(stream_drop(even_results, 10), 10);

// For testing
/*
display(eval_stream(first_ten, 10));
display(eval_stream(next_ten, 10));
*/

// Task 2
function add(a, b) {
    return a + b;
}

function stream_sequence(op, initial, xs) {
    if (is_empty_list(xs)) {
        return [];
    } else {
        var cur = op(head(xs), initial);
        return pair(cur,
                    function() {
                        return stream_sequence(op, cur, stream_tail(xs));
                    });
    }
}

var integers = integers_from(1);
var even_integers = stream_filter(function(x) { return x % 2 === 0; },
                                  integers);
var squared_even_integers = stream_map(function(x) { return x * x; },
                                       even_integers);
var sum_square = stream_sequence(add, 0, squared_even_integers);

// For testing
/*
display(eval_stream(sum_square, 10));
// return 4, 20, 56,...
*/


// Task 3
function make_step_duration_streams(n) {
    return n === 4
            ? make_step_duration_streams(1)
            : pair(n, function() { return make_step_duration_streams(n + 1); });
}
// 1, 2, 3, 1, 2, 3, 1, ...
var step_duration_stream = make_step_duration_streams(1);

function make_oscillating_cookie_stream(is_first) {
    return pair(is_first? "Hbebuerq" : "Kgasnsa",
                function() {
                    return make_oscillating_cookie_stream(!is_first);
                });
}

// "Hbebuerq", "Kgasnsa", "Hbebuerq", ...
var oscillating_cookie_stream = make_oscillating_cookie_stream(true);

function stream_zip(xs, ys) {
    if (is_empty_list(xs) || is_empty_list(ys)) {
        return [];
    } else {
        return pair(pair(head(xs), head(ys)),
                    function() {
                        return stream_zip(stream_tail(xs), stream_tail(ys));
                    });
    }
}

// [1, "Hbebuerq"], [2, "Kgasnsa"], [3, "Hbebuerq"], [1, "Kgasnsa"], ...
var simple_cookie_stream = stream_zip(step_duration_stream, oscillating_cookie_stream);

function update_cookie_stream() {
    var current_pair = head(simple_cookie_stream);
    var current_duration = head(current_pair);
    var current_cookie = tail(current_pair);
    display("Have a " + current_cookie + " cookie!");
    setTimeout(function() {
        simple_cookie_stream = stream_tail(simple_cookie_stream);
        update_cookie_stream();
    }, current_duration * 1000);
}

// For testing
// update_cookie_stream();

