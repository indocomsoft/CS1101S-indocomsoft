// Source Week 11, streams library


// Task 1
function make_step_stream(n) {
    function helper(cur) {
        return cur === (n + 1)
                ? helper(1)
                : pair(cur, function() { return helper(cur + 1); });
    }
    return helper(1);
}

// Task 2
function make_oscillating_stream(n) {
    function helper(cur, is_increasing) {
        if (cur === (n + 1)) {
            return helper(n - 1, false);
        } else if (cur === 0) {
            return helper(2, true);
        } else {
            return pair(cur, function() {
                                 return helper(cur + (is_increasing ? 1 : -1),
                                               is_increasing);
                             });
        }
    }
    if (n === 1) {
        var ones = pair(1, function() { return ones; });
        return ones;
    } else {
        return helper(1, true);
    }
}

// Task 3
function make_flexible_step_stream(lst) {
    var n = length(lst);
    function helper(cur) {
        return cur === (n + 1)
                ? helper(1)
                : pair(list_ref(lst, cur - 1),
                       function() { return helper(cur + 1); });
    }
    return helper(1);
}

function make_flexible_oscillating_stream(lst) {
    var n = length(lst);
    function helper(cur, is_increasing) {
        if (cur === (n + 1)) {
            return helper(n - 1, false);
        } else if (cur === 0) {
            return helper(2, true);
        } else {
            return pair(list_ref(lst, cur - 1),
                        function() {
                            return helper(cur + (is_increasing ? 1 : -1),
                                          is_increasing);
                        });
        }
    }
    if (n === 1) {
        var ret = pair(head(lst), function() { return ret; });
        return ret;
    } else {
        return helper(1, true);
    }
}

// Task 4
function interleave(stream1, stream2) {
    function helper(s1, s2, s1_now) {
        if (is_empty_list(s1) && is_empty_list(s2)) {
            return [];
        } else if (is_empty_list(s1)) {
            return pair(head(s2), function() { return stream_tail(s2); });
        } else if (is_empty_list(s2)) {
            return pair(head(s1), function() { return stream_tail(s1); });
        } else {
            return pair(head((s1_now ? s1 : s2)),
                        function() {
                            return helper((s1_now ? stream_tail(s1) : s1),
                                          (s1_now ? s2 : stream_tail(s2)),
                                          !s1_now);
                        });
        }
    }
    return helper(stream1, stream2, true);
}