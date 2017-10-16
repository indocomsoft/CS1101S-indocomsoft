// Source Week 6

// Task 1
function partition(xs, p) {
    function helper(lst, smaller, larger) {
        if (is_empty_list(lst)) {
            return pair(smaller, larger);
        } else {
            var cur = head(lst);
            return cur <= p ? helper(tail(lst),
                                     pair(cur, smaller),
                                     larger)
                            : helper(tail(lst),
                                     smaller,
                                     pair(cur, larger));
        }
    }
    return helper(xs, [], []);
}

// Test
// var my_list = list(1, 2, 3, 4, 5, 6);
// partition(my_list, 4);

// Task 2
function partition(xs, p) {
    function helper(lst, smaller, larger) {
        if (is_empty_list(lst)) {
            return pair(smaller, larger);
        } else {
            var cur = head(lst);
            return cur <= p ? helper(tail(lst),
                                     pair(cur, smaller),
                                     larger)
                            : helper(tail(lst),
                                     smaller,
                                     pair(cur, larger));
        }
    }
    return helper(xs, [], []);
}

function quicksort(xs) {
    if (is_empty_list(xs)) {
        return xs;
    } else if (is_empty_list(tail(xs))) {
        return xs;
    } else {
        var cur = head(xs);
        var partitioned = partition(tail(xs), cur);
        var sorted_smaller = quicksort(head(partitioned));
        var sorted_larger = quicksort(tail(partitioned));
        return append(sorted_smaller, pair(cur, sorted_larger));
    }
}

// Test
// var my_list = list(23, 12, 56, 92, -2, 0);
// quicksort(my_list);

// Task 3
// Question 1
// The order of growth is O(n)
// It gives rise to an recursive process as it utilises function filter,
// which is a recursive process.

// Question 2
// (a) O(n^2)
// (b) O(n^2)
// (c) Such a list exists -- it is a list that will be partitioned into two
//     lists of nearly the same length by partition(xs, p) during every
//     iteration of quicksort(xs).
//     list(12, 6, 3, 1, 2, 4, 5, 9, 7, 8, 10, 11, 18, 15, 13, 14, 16, 17, 21,
//          19, 20, 22, 23);
//     list(12, 9, 8, 7, 11, 10, 3, 2, 1, 5, 4, 6, 21, 20, 19, 23, 22, 15, 14,
//          13, 17, 16, 18)
//     The order of growth is Θ(n log n)

// Question 3
// The performance of quicksort depends on the list passed to the function.
//
// In the worst case scenario, the complexity is O(n^2).
// 
// In the best case scenario, the complexity is O(n log n).

// Task 2
function partition(xs, p) {
    function helper(lst, smaller, larger) {
        if (is_empty_list(lst)) {
            return pair(smaller, larger);
        } else {
            var cur = head(lst);
            return cur <= p ? helper(tail(lst),
                                     pair(cur, smaller),
                                     larger)
                            : helper(tail(lst),
                                     smaller,
                                     pair(cur, larger));
        }
    }
    return helper(xs, [], []);
}

function quicksort(xs) {
    if (is_empty_list(xs)) {
        return xs;
    } else if (is_empty_list(tail(xs))) {
        return xs;
    } else {
        var cur = head(xs);
        var partitioned = partition(tail(xs), cur);
        var sorted_smaller = quicksort(head(partitioned));
        var sorted_larger = quicksort(tail(partitioned));
        return append(sorted_smaller, pair(cur, sorted_larger));
    }
}

// Test
// var my_list = list(23, 12, 56, 92, -2, 0);
// quicksort(my_list);