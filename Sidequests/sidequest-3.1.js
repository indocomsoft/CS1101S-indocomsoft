// Source Week 3

// Task 1:

// 1. g(n) has order of growth of O(f(n))
// 2. f(n) has order of growth of O(g(n))
// 3. g(n) has order of growth of O(f(n))
// 4. f(n) has order of growth of O(g(n))

// Task 2: 

// m(n) = 3n + 2
// 1. When foo(n) is first called, it will return n * bar(n)
//    This results in 1 arithmetic operation of *
// 2. bar(n) will then first evaluate (n === 0)
//    This results in 1 arithmetic operation of ===
// 3. In the case when (n === 0) is false, 
//    bar(n) will return 1 + bar(n - 1)
//    This results in 2 arithmetic operations of + and -
// 4. In the case when (n === 0) is true,
//    bar(n) would return 0
//    which results in 0 arithmatic operation.
// 5. Function bar will recursively calls itself as long as n > 0
//    Each call results in a total of 3 arithmetic operations (steps 2 and 3)
// 6. So chronologically, step 1 will occur once,
//    incurring 1 arithmetic operation
//    steps 2 and 3 will occur n times as bar recurses on itself until
//    n is equal to zero, incurring a total of 3 arithmetic operations
//    per function call.
//    Hence, overall, a total of 3n arithmetic operations.
//    steps 2 and 4 will occur 1 time when n is equal to 0
//    incurring 1 arithmetic operation
// 7. Therefore, m(n) = 1 + 3n + 1 = 3n + 2
//
// h(n) = n

// Task 3:
// foo(n) has an order of growth of O(n^2)
// improved_foo(n) has an order of growth of O(n)
// Function improved_foo is derived from the pattern:
// foo(n) = bar(n) + bar(n - 1) + bar(n - 2) + ... + bar(2) + bar(1) + 0
// n + (n - 1) + (n - 2) + ... + 2 + 1 + 0 +
//     (n - 1) + (n - 2) + ... + 2 + 1 + 0 +
//               (n - 2) + ... + 2 + 1 + 0 +
// ....
//                               2 + 1 + 0 +
//                                   1 + 0
//                                            + 0
// = n(1) + (n - 1)(2) + (n - 2)(3) + ... + 2(n - 1) + 1(n)
// Notice how n(1) is equal to 1(n), (n - 1)(2) is equal to 2(n - 1), and so
// on by commutative law. The function improved_foo thus iteratively
// calculate the sum of the series up to the (n / 2)-th term if n is even
// or ((n - 1) / 2)-th term if n is odd. In the case that n is even, twice
// the sum of the series is the answer to foo(n). In the case that n is odd,
// twice the sum of the series added to square of ((n + 1) / 2) is the answer
// to foo(n).

function improved_foo(n){
    function square(x){
        return x * x;
    }
    function helper(count, req, acc){
        return count > req ? acc
                           : helper(count + 1,
                                    req,
                                    acc + (n - count + 1) * count);
    }
    return n % 2 === 0 ? 2 * helper(1, n / 2, 0)
                       : square((n + 1) / 2) + 2 * helper(1, (n - 1) / 2, 0);
}