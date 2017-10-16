// Mission 13 v1
// O(n^(r+2)) solution where n is no of ships, r is no of missiles
// 7 October 2017

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

// My helper functions

// Build combinations of elements in xs with length k
function combinations(xs, k) {
    if (k === 0) {
        return list([]);
    } else if (is_empty_list(xs)) {
        return [];
    } else {
        var s1 = combinations(tail(xs), k - 1);
        var s2 = combinations(tail(xs), k);
        var x = head(xs);
        var has_x = map(function(s) {return pair(x, s);}, s1);
        return append(has_x, s2);
    }
}

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
    
    function merge(xs, ys) {
        if (is_empty_list(xs)) {
            return ys;
        } else if (is_empty_list(ys)) {
            return xs;
        } else {
            var x = head(xs);
            var y = head(ys);
            return (x < y) ? pair(x, merge(tail(xs), ys))
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

// Remove all the duplicated elements and return only unique elements
function remove_duplicate(lst) {
    function helper(lst, acc) {
        if (is_empty_list(lst)) {
            return reverse(acc);
        } else {
            var curlst = head(lst);
            if (is_empty_list(acc)) {
                return helper(tail(lst), pair(curlst, acc));
            } else {
                var curacc = head(acc);
                if (curlst === curacc) {
                    return helper(tail(lst), acc);
                } else {
                    return helper(tail(lst), pair(curlst, acc));
                }
            }
        }
    }
    return helper(lst, []);
}
    

// Returns x rounded up to 2dp
function ceil2dp(x) {
    return math_ceil(x * 100) / 100;
}

function acquire_missile_targets(hostile_list, number_of_missiles) {
    // Builds a list of distances provided a list of ships
    // lst = list(list(ship,ship), list(ship,ship), ...)
    // Return format:
    // list(distance, distance, ...)
    function build_distance_list(lst) {
        if (is_empty_list(lst)) {
            return [];
        } else {
            var cur = head(lst);
            var ship1 = head(cur);
            var ship2 = head(tail(cur));
            return pair(distance(ship1, ship2), build_distance_list(tail(lst)));
        }
    }
    
    // Checks whether all vessels in hostile_list will be destroyed by
    // blasts of blast_radius to ships
    // blast_radius: Number
    // ships: list(ship, ship, ..., ship)
    // Returns boolean
    // Uses something like DFS (?)
    function simulate_blast(blast_radius, ships) {
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
                        return b_s(tail(ships_to_try),
                                   boom_ship(cur, alive_ships));
                    } else {
                        return b_s(tail(ships_to_try), alive_ships);
                    }
                }
            }
            var ships = remove(ship, surviving_ships);
            return b_s(ships, ships);
        }
        
        // Iterate through ships
        function helper(lst, surviving_ships) {
            if (is_empty_list(lst)) {
                return surviving_ships;
            } else {
                var cur = head(lst);
                return helper(tail(lst), boom_ship(cur, surviving_ships));
            }
        }
        return length(helper(ships, hostile_list)) === 0;
    }
    
    // Checks for all distances in distance_list and all combinations in
    // ship_combinations whether there is any case whereby all ships in
    // hostile_list are destroyed.
    // distance_list: list(distance, distance, ...)
    // ships_combinations: list(list(ship, ship), list(ship, ship), ...)
    // returns pair(blast_radius, list(ship, ship, ...)) if found
    // or [] if not found
    function check_all(distance_list, ships_combinations) {
        // Iterate through ships_combinations
        // checks if blasting vessels in ships result in destruction of
        // all vessels in hostile_list
        // blast_radius: Number
        // ships: list(ship, ship, ...)
        // returns list(ship, ship, ...) if found or [] if not found
        function check_ships(blast_radius, ships) {
            if (is_empty_list(ships)) {
                return [];
            } else {
                var cur = head(ships);
                var status = simulate_blast(blast_radius, cur);
                if (status) {
                    return cur;
                } else {
                    return check_ships(blast_radius, tail(ships));
                }
            }
        }
        
        // Iterate through distances
        if (is_empty_list(distance_list)) {
            return [];
        } else {
            var cur = head(distance_list);
            var status = check_ships(cur, ships_combinations);
            if (is_empty_list(status)) {
                return check_all(tail(distance_list), ships_combinations);
            } else {
                return pair(cur, status);
            }
        }
    }
    
    // Checks whether min_case really requires n missiles or provide a minimum
    // no of missiles required to destroy all ships otherwise
    // min_case: pair(distance, list(ship, ship, ...))
    // returns pair(distance, list(ship, ship, ...))
    function check_real_min_missile(min_case) {
        var distance = head(min_case);
        var ships = tail(min_case);
        var no_of_ships = length(ships);
        function helper(n) {
            if (n === no_of_ships) {
                return min_case;
            } else {
                var ships_combinations = combinations(ships, n);
                var status = check_all(list(distance),
                                       ships_combinations);
                if (is_empty_list(status)) {
                    return helper(n + 1);
                } else {
                    return status;
                }
            }
        }
        return helper(1);
    }
    
    // Main program
    
    // Trivial case: no. of missiles = no. of ships
    if (length(hostile_list) === number_of_missiles) {
        return pair(0.01,
                    map(function(x) { return get_id(x); }, hostile_list));
    } else {
        // Generate possible combinations of ships targeted
        var ships_combinations = combinations(hostile_list, number_of_missiles);
        // Build a list containing the possible distances among all ships
        var distance_list = build_distance_list(combinations(hostile_list, 2));
        // Sort the distances
        var sorted = merge_sort(distance_list);
        // Retain only unique distances
        var cleaned = remove_duplicate(sorted);
        // Iterate through distances and ship_combinations, find out what
        // is the minimum blast radius required and which ships to target
        var raw_min_case = check_all(cleaned, ships_combinations);
        // Check whether we can use less missiles
        var min_case = check_real_min_missile(raw_min_case);
        // Round up to 2dp the blast radius and extract the ship ID's
        var final =  pair(ceil2dp(head(min_case)),
                          map(function(x){ return get_id(x); }, tail(min_case)));
        return final;
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