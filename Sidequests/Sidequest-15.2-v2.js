// Mission 13 v2
// O(n^3) solution where n is no of ships
// 12 October 2017

// Source Week 6

// Helper functions
function get_id(x) { return head(x); }
function get_x(x) { return head(tail(x)); }
function get_y(x) { return head(tail(tail(x))); }
function get_z(x) { return head(tail(tail(tail(x)))); }

function sum_of_squares(a, b, c) {
    function sq(x) { return x * x; }
    return sq(a) + sq(b) + sq(c);
}

function distance(e1, e2) {
    return math_sqrt(sum_of_squares(
        get_x(e1) - get_x(e2),
        get_y(e1) - get_y(e2),
        get_z(e1) - get_z(e2)
    ));
}
// End of Helper Functions

// Sort list xs using Merge Sort
// Running time of O(n log n)
function merge_sort(xs) {
    function middle(n) {
        return math_floor(n / 2);
    }
    
    function take_drop(xs, n) {
        function helper(ys, k, acc) {
            if (k === 0) {
                return pair(acc, ys);
            } else {
                return helper(tail (ys), k - 1, pair(head(ys), acc));
            }
        }
        return helper(xs, n, []);
    }
    
    // Adapted for MST
    function merge(xs, ys) {
        if (is_empty_list(xs)) {
            return ys;
        } else if (is_empty_list(ys)) {
            return xs;
        } else {
            var x = head(xs);
            var y = head(ys);
            return (thead(x) < thead(y))
                    ? pair(x, merge(tail(xs), ys))
                    : pair(y, merge(xs, tail(ys)));
        }
    }
    
    if (is_empty_list(xs) || is_empty_list(tail(xs))) {
        return xs;
    } else {
        var td = take_drop(xs, middle(length(xs)));
        return merge(merge_sort(head(td)), merge_sort(tail(td)));
    }
}

function is_triple(t) {
    return is_pair(t) && head(t) === "triple";
}


function triple(head, body, tail) {
    return pair("triple", pair(head, pair(body, tail)));
}

function thead(t) {
    return is_triple(t) ? head(tail(t)) : false;
}

function tbody(t) {
    return is_triple(t) ? head(tail(tail(t))) : false;
}

function ttail(t) {
    return is_triple(t) ? tail(tail(tail(t))) : false;
}

function pq_empty() {
    return [];
}

function pq_extract_min(xs) {
    function pq_find_min(xs) {
        return accumulate(function(a, b) {
                              if (is_empty_list(b)) {
                                  return a;
                              } else {
                                  var x = thead(a);
                                  var y = thead(b);
                                  return x < y ? a : b;
                              }
                          }, [], xs);
    }
    
    function pq_delete(x, xs) {
        if (is_empty_list(xs)) {
            return [];
        } else {
            var cur = head(xs);
            if (equal(cur, x)) {
                return tail(xs);
            } else {
                return pair(cur, pq_delete(x, tail(xs)));
            }
        }
    }
    var min = pq_find_min(xs);
    return pair(min, pq_delete(min, xs));
}
    

// Put xs into pq
function pq_enqueue_multiple(xs, pq) {
    return append(xs, pq);
}

function set_list(xs, index, value) {
    function helper(lst, count) {
        if (is_empty_list(lst)) {
            return [];
        } else if (count === index) {
            return pair(value, tail(lst));
        } else {
            return pair(head(lst), helper(tail(lst), count + 1));
        }
    }
    return helper(xs, 0);
}

// returns list(triple(distance, from, to), triple(distance, from, to), ...) 
function make_distance_list(ship_index, hostile_list) {
    var ship = list_ref(hostile_list, ship_index);
    function helper(hostile_list, count) {
        if (is_empty_list(hostile_list)) {
            return [];
        } else {
            var cur = head(hostile_list);
            if (equal(ship, cur)) {
                return helper(tail(hostile_list), count + 1);
            } else {
                return pair(triple(distance(ship, cur), ship_index, count),
                            helper(tail(hostile_list), count + 1));
            }
        }   
    }
    return helper(hostile_list, 0);
}

function is_all_true(visited) {
    if (is_empty_list(visited)) {
        return true;
    } else {
        return head(visited) && is_all_true(tail(visited));
    }
}

function build_mst(hostile_list) {
    // visited: list(false, false, ...)
    // priority_queue: list(triple(weight, from, to), triple(weight, from, to), ...)
    // tree: list(triple(distance, from, to), triple(distance, from, to), ...)
    function prim(visited, priority_queue, tree) {
        if (is_all_true(visited)) {
            return tree;
        } else if (!head(visited)) {
            // The first iteration of prim, pick an arbitrary node
            // In this case, the first element in hostile_list
            var cur = list_ref(hostile_list, 0);
            var new_visited = set_list(visited, 0, true);
            var edges = make_distance_list(0, hostile_list);
            var new_pq = edges;
            return prim(new_visited, new_pq, []);
        } else {
            var extracted = pq_extract_min(priority_queue);
            var curtriple = head(extracted);
            var cur = ttail(curtriple);
            var pq_extracted = tail(extracted);
            if (list_ref(visited, cur)) {
                return prim(visited, pq_extracted, tree);
            } else {
                var new_visited = set_list(visited, cur, true);
                var edges = make_distance_list(cur, hostile_list);
                var new_pq = pq_enqueue_multiple(edges, pq_extracted);
                return prim(new_visited, new_pq, pair(curtriple, tree));
            }
        }
    }
    var no_of_ship = length(hostile_list);
    var visited = build_list(no_of_ship, function(n){ return false; });
    return prim(visited, pq_empty(), []);   
}

function find_targets(blast_radius, hostile_list) {
    // SEND THE BLAST TO SHIP!
    // MAKES SHIP GO BOOM BOOM
    // Returns a list of ships surviving a blast to ship
    function boom_ship(ship, surviving_ships) {
        function b_s(ships_to_try, alive_ships) {
            if (is_empty_list(ships_to_try)) {
                return alive_ships;
            } else {
                var cur = head(ships_to_try);
                if (distance(cur, ship) <= blast_radius) {
                    // BOOM BOOM TIME
                    var new_ships_to_try = boom_ship(cur, alive_ships);
                    return b_s(new_ships_to_try, new_ships_to_try);
                } else {
                    return b_s(tail(ships_to_try), alive_ships);
                }
            }
        }
        var ships = remove(ship, surviving_ships);
        return b_s(ships, ships);
    }
    
    // Iterate through surviving ships
    function helper(surviving_ships, acc) {
        if (is_empty_list(surviving_ships)) {
            return acc;
        } else {
            var cur = head(surviving_ships);
            var new_surviving_ships = boom_ship(cur, surviving_ships);
            return helper(new_surviving_ships, pair(get_id(cur), acc));
        }
    }
    return helper(hostile_list, []);
}

// Returns x rounded up to 2dp
function ceil2dp(x) {
    return math_ceil(x * 100) / 100;
}

function acquire_missile_targets(hostile_list, number_of_missiles) {
    var len = length(hostile_list);
    if (number_of_missiles === len) {
        return pair(0.01, map(function(x){ return get_id(x); }, hostile_list));
    } else {
        var mst = build_mst(hostile_list);
        var sorted = merge_sort(mst);
        var blast_radius = thead(list_ref(sorted, len - number_of_missiles - 1));
        if (number_of_missiles === 1) {
            return pair(ceil2dp(blast_radius), get_id(head(hostile_list)));
        } else {
            var ships_to_target = find_targets(blast_radius, hostile_list);
            return pair(ceil2dp(blast_radius), ships_to_target);
        }
    }
}

// Tester
acquire_missile_targets(
    list(
        list("TIE0001", 100, 200, -80),
        list("TIE0002", 100, 200, 0),
        list("TIE0003", 100, 200, 50),
        list("TIE0004", 100, 200, 120),
        list("TIE0005", 100, 200, 200),
        list("TIE0006", 100, 200, 250),
        list("TIE0007", 100, 200, 320),
        list("TIE0008", 100, 200, 500),
        list("TIE0009", 100, 200, 800),
        list("TIE0010", 100, 200, 820)
    ),
    3);