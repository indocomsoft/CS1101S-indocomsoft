// Source Week 9

// Task 1
function sort(b) {
    for(var i = 0; i <= array_length(b) - 1; i = i + 1) {
        for(var j = 0; j <= array_length(b) - i - 1; j = j + 1) {
            if (b[j] > b[j + 1]) {
                swap(j, j + 1, b);
            } else { }
        }
    }
}

// Do not modify this function
function swap(left_index, right_index, array) {
    var tmp = array[left_index];
    array[left_index] = array[right_index];
    array[right_index] = tmp;
}

// Comment the following out for testing
/*
var test_1 = [1, 2, 3, 4, 5];
display("Unsorted: " + test_1);
sort(test_1);
display("Sorted: " + test_1);

var test_2 = [9, 8, 7, 6, 5];
display("Unsorted: " + test_2);
sort(test_2);
display("Sorted: " + test_2);

var test_3 = ["Pixel", "Scottie", "Hartin Menz", "Ershk", "Beat"];
display("Unsorted: " + test_3);
sort(test_3);
display("Sorted: " + test_3);
*/