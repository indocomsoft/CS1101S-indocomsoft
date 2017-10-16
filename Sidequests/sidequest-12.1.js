// Source Week 6

// Task 1
function make_node(left_tree, number, right_tree) {
    return list(left_tree, number, right_tree);
}

// Task 2
function make_node(left_tree, number, right_tree) {
    return list(left_tree, number, right_tree);
}

function middle(n) {
    return math_floor(n / 2);
}

function take(xs, n) {
    return n === 0 ? [] : pair(head(xs), take(tail(xs), n - 1));
}

function drop(xs, n) {
    return n === 0 ? xs : drop(tail(xs), n - 1);
}

function make_balanced(xs) {
    var list_length = length(xs);
    if (list_length === 0) {
        return [];
    } else {
        var list_mid = middle(list_length);
        return make_node(make_balanced(take(xs, list_mid)),
                         list_ref(xs, list_mid),
                         make_balanced(drop(xs, list_mid + 1)));
    }
}

// Test
// make_balanced(list(1,2,3,4,5,6,7,8,9,10));