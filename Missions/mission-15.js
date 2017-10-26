// Source Week 10


// Task 1
function compareEnemy(enemyA, enemyB) {
    if (getPlanarAngle(enemyA) < getPlanarAngle(enemyB)) {
        return -1;
    } else if (getPlanarAngle(enemyA) === getPlanarAngle(enemyB)) {
        return 0;
    } else {
        return 1;
    }
}

// Task 2
function compareEnemy(enemyA, enemyB) {
    if (getPlanarAngle(enemyA) < getPlanarAngle(enemyB)) {
        return -1;
    } else if (getPlanarAngle(enemyA) === getPlanarAngle(enemyB)) {
        return 0;
    } else {
        return 1;
    }
}

function partition(xs, low, high, comparator) {
    // Use the last element as the pivot as this results in worst performance
    // when the array is in descending order. This case rarely happens as
    // we can assume that the data provided has not been sorted and is random.
    var pivot = xs[high];
    var i = low - 1;
    for(var j = low; j < high; j = j + 1) {
        if (comparator(xs[j], pivot) === -1) {
            i = i + 1;
            swap(i, j, xs);
        } else { }
    }
    if (comparator(pivot, xs[i + 1]) === -1) {
        swap(i + 1, high, xs);
    } else { }
    return i + 1;
}

function swap(i, j, xs) {
    var temp = xs[i];
    xs[i] = xs[j];
    xs[j] = temp;
}

// Task 3
function quicksort(xs, low, high, comparator) {
    if (low < high) {
        var pos = partition(xs, low, high, comparator);
        quicksort(xs, low, pos - 1, comparator);
        quicksort(xs, pos + 1, high, comparator);
    } else { }
}

function compareEnemy(enemyA, enemyB) {
    if (getPlanarAngle(enemyA) < getPlanarAngle(enemyB)) {
        return -1;
    } else if (getPlanarAngle(enemyA) === getPlanarAngle(enemyB)) {
        return 0;
    } else {
        return 1;
    }
}

function partition(xs, low, high, comparator) {
    var pivot = xs[high];
    var i = low - 1;
    for(var j = low; j < high; j = j + 1) {
        if (comparator(xs[j], pivot) === -1) {
            i = i + 1;
            swap(i, j, xs);
        } else { }
    }
    if (comparator(pivot, xs[i + 1]) === -1) {
        swap(i + 1, high, xs);
    } else { }
    return i + 1;
}

function swap(i, j, xs) {
    var temp = xs[i];
    xs[i] = xs[j];
    xs[j] = temp;
}