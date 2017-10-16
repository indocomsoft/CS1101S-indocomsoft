// Mission 13 v3
// O(n^2) solution where n is no of ships
// 14 October 2017

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

// Sort list xs using Merge Sort in descending order
// Running time of O(n log n), space of O(n)
function merge_sort(xs) {
    function middle(n) {
        return math_floor(n / 2);
    }
    function take(xs, n) {
        return n === 0 ? [] : pair(head(xs), take(tail(xs), n - 1));
    }
    function drop(xs, n) {
        return n === 0 ? xs : drop(tail(xs), n - 1);
    }
    function merge(xs, ys) {
        if (is_empty_list(xs)) {
            return ys;
        } else if (is_empty_list(ys)) {
            return xs;
        } else {
            var x = head(xs);
            var y = head(ys);
            return (x > y) ? pair(x, merge(tail(xs), ys))
                           : pair(y, merge(xs, tail(ys)));
        }
    }
    if (is_empty_list(xs) || is_empty_list(tail(xs))) {
        return xs;
    } else {
        var mid = middle(length(xs));
        return merge(merge_sort(take(xs, mid)), merge_sort(drop(xs, mid)));
    }
}

// Returns x rounded up to 2dp
// Some hacky stuffs to work around floating point imprecision
// with just using math_ceil, ceil2dp(80.01) would return 80.02 instead of 80.01
function ceil2dp(x) {
    var precision = -12;
    if (x % 0.01 < math_pow(10, precision)) {
        return math_floor(x * 100) / 100;
    } else {
        return math_ceil(x * 100) / 100;
    }
}

function acquire_missile_targets(hostile_list, number_of_missiles) {
    var len = length(hostile_list);
    
    // Update the nearest_list distances
    // Time: O(n)
    // Space: O(n)
    function update_nearest_list(ship_index, nearest_list) {
        var ship = list_ref(hostile_list, ship_index);
        function helper(nearest_list, hostile_list, count) {
            if (is_empty_list(hostile_list)) {
                return [];
            } else {
                var cur = head(hostile_list);
                var cur_distance = distance(ship, cur);
                if (cur_distance < head(nearest_list)) {
                    return pair(cur_distance,
                                helper(tail(nearest_list),
                                       tail(hostile_list), count + 1));
                } else {
                    return pair(head(nearest_list), 
                                helper(tail(nearest_list),
                                       tail(hostile_list), count + 1));
                }
            }
        }
        return helper(nearest_list, hostile_list, 0);
    }

    // returns the nearest vertex to the tree not in the tree
    // return data structure: pair(index, value)
    // Time: O(n)
    // Space: O(1)
    function find_nearest(xs) {
        function helper(xs, count, acc) {
            if (is_empty_list(xs)) {
                return acc;
            } else {
                var cur = head(xs);
                // cur === 0 means the vertex has been visited, skip that
                return helper(tail(xs), count + 1,
                              ((cur < tail(acc) && cur !== 0)
                                ? pair(count, cur)
                                : acc));
            }
        }
        // Use 3000000 as it is longer than max possible distances
        return helper(xs, 0, pair(-1, 3000000));
    }

    // Builds a minimum spanning tree using Prim's Algorithm
    // Returns a list of distances in the MST
    // Time: O(n^2)
    // Space: O(n)
    function build_mst() {
        // nearest_list: list(distance, distance, ...) in the same order as in
        // hostile_list
        // distance_list: list(distance, distance. ...)
        function prim(nearest_list, distance_list, count) {
            if (count === (len - 1)) {
                return distance_list;
            } else {
                var nearest = find_nearest(nearest_list);
                var new_nl = update_nearest_list(head(nearest), nearest_list);
                var new_dl = pair(tail(nearest), distance_list);
                return prim(new_nl, new_dl, count + 1);
            }
        }
        
        // Set nearest distances to be 3000000 as max distance is approx 2828428 
        var nearest_list = build_list(len, function(n){ return 3000000; });
        // Start with an arbitrary vertex of the first ship in hostile_list
        var new_nl = update_nearest_list(0, nearest_list);
        return prim(new_nl, [], 0);
    }

    // Returns a list of ships to target in order to destroy all ships in
    // hostile_list for a given blast_radius
    // Time: O(n^2)
    // Space: O(n^2)
    function find_targets(blast_radius) {
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
    
    if (number_of_missiles === len) {
        return pair(0.01, map(function(x){ return get_id(x); }, hostile_list));
    } else {
        var mst = build_mst();
        var sorted = merge_sort(mst);
        var blast_radius = ceil2dp(list_ref(sorted, number_of_missiles - 1));
        var ships_to_target = find_targets(blast_radius);
        return pair(blast_radius, ships_to_target);
    }
}

// Tester
timed(acquire_missile_targets)(
    list(
        list("TIE0001", 100, 200, -80.01),
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