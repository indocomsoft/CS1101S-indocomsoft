// Source Week 6

// Task 1
function binary_search_tree_to_string(bst) {
    if (is_empty_binary_tree(bst)) {
        return "";
    } else {
        return binary_search_tree_to_string(left_subtree_of(bst))
                + value_of(bst) + "\n"
                + binary_search_tree_to_string(right_subtree_of(bst));
    }
}

// Test
// binary_search_tree_to_string(cadet_names);

// var test = list(list([],"a",list([],"c",[])),"e",list(list([],"h",[]),"n",[]));
// binary_search_tree_to_string(test);

// Task 2
function find(bst, name) {
    if (is_empty_binary_tree(bst)) {
        return false;
    } else if (value_of(bst) < name) {
        return find(right_subtree_of(bst), name);
    } else if (value_of(bst) > name) {
        return find(left_subtree_of(bst), name);
    } else {
        return true;
    }
}

// Your solution here

// 1. var bst1 =
//    list(
//         list(
//              list(
//                   list(
//                          list(
//                               list(
//                                    list([],
//                                         "hello",
//                                         []),
//                                  "hellp",
//                                  []),
//                              "hellq",
//                              []),
//                         "hellr",
//                         []),
//                    "hells",
//                    []),
//                "hellt",
//                []),
//           "hellu",
//           []);

// 2. var bst2 =
//    list(
//         list(
//              list([],
//                   "a",
//                   []),
//              "b",
//              list([],
//                   "c",
//                   [])),
//         "e",
//         list(
//              list([],
//                   "g",
//                   []),
//               "h",
//               list([], 
//                    "i",
//                    [])));

// 3. c(n) = Θ(log n)