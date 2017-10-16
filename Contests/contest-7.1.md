# Contest 7.1: The Choreographer

Readings:  
- Textbook Sections 1.1.3
    
    
## Background

Avenger Muru, wanting to show other his peers his appreciation for the arts and get their admiration, wishes to add some panache to his house. To that end, he has called for an impromptu competition amongst the cadets in the Academy, to design the most intricate and beautiful curves.

While you feel that the competition is yet another decoration exercise, you feel the strong desire to gain a spot in the Academy&#39;s Hall of Fame with the most awe-inspiring and magnificent curve you can ever imagine (and also hope to get noticed by Avenger Muru).

## Contest Rules (IMPORTANT)

### Example of what is acceptable

```
function martin_henz_curve_contest_0() {
    // draw_connected 10000
    return function(t) {
                   return make_point(t, t);
              }
}
```

### Example of what is not acceptable
```
function helper() {
    ((draw_points_squeezed_to_window(10000))(unit_line); // Using draw function
}

// draw_points_on 10
// Not the correct line to declare draw function and number of points
// Not following naming convention
function my_submission(input1) { // Functions that take in inputs
    //(draw_points_on(8000))(yourname_curve_contest());
    // Specifying draw function and number of points in the wrong format
    helper(); // Calling functions not defined within your entry
}

// Calling draw function in the top level scope
(draw_points_on(8000))(yourname_curve_contest());
```

### Rules for submission
* Be creative.
* No draw functions or any other attempt to interact with the viewport is allowed.
* Strictly follow the naming convention outlined in the contest description.
* Indicate which draw function you want to use, and how many points do you want to draw via a comment as the first line within the function, as described in the pdf.
* All functions should be self-contained.

### Evaluation of Submissions
* Each student will be randomly assigned to 9 or 10 entries for voting. (This is to ensure that each submission receives an equal number of votes.)
* Each student can assign a score of 1 to 10 for each entry. The scores assigned to all 10 entries must sum up to 55. (The simplest way to achieve this is to rank the submissions from 1 to 10.) For students that are assigned 9 entries only, the total scores must sum up to 54.
* The final score for a submitted entry is \(s(v,t) = v - 2^{t/50}\), where v is the normalized_voting_score (max 100), and t is the number of tokens in your program, including semicolons, operators, parentheses, but not including comments. The &quot;acceptable&quot; example above has 36 tokens.
* `normalized_voting_score = sum_of_scores / number_of_voters / 10 * 100`

### Task
"You may submit up to 3 separate entries. Each entry should be submitted as its own function named `yourname_curve_contest_x` where `x` is from 0 to 2, such that calling the function without any argument returns a curve.

You can specify which `draw` function and how many drawing points you want to use for each entry. Please leave a comment in the following format as the first line of each entry's function:

```
// draw_function number_of_points
```

where `draw_function` can be one of the following:

* `draw_points_on`, which draws the curve with disconnected points
* `draw_connected`, which also connects the points
* `draw_points_squeezed_to_window`, which is similar to `draw_points_on` but also scales and translates the curve proportionally to the viewing area
* `draw_connected_squeezed_to_window`, which is similar to `draw_connected` but also scales and translates the curve proportionally to the viewing area
* `draw_connected_full_view`, which translates the curve to the viewing area, then scales it so it takes up around 80% of the viewing area, so that it is easier to see the points at the edges
* `draw_connected_full_view_proportional`, which is similar to `draw_connected_full_view` but applies the same scale factor to the width and height of the curve

and `number_of_points` can be any positive integer less than or equal to 50000. However, note that a higher `number_of_points` takes a longer time to draw, and we will only accept entries that run in a reasonable amount of time. We will draw your entry with the following statement:

```
(draw_function(number_of_points))(yourname_curve_contest_x());
```

So if you want to draw your entry with

```
(draw_connected(10000))(yourname_curve_contest_x());
```

you should add the following comment as the first line in your function:

```
// draw_connected 10000
```

Please note that beside those 3 `yourname_curve_contest_x` functions, you are not allowed to have anything else, e.g. function definition / function call, etc. in the global scope.
    
## Submission

To submit your work to the Academy, place your submission within the box in the "Editor" tab(left-hand side). Name your (up to) three submissions using the function names `yourname_curve_contest_x` where x is from 0 to 2. Save the program by clicking the "Save" button, and then, "Submit" button when you are done. Note that submission is final and that any mistake in submission requires extra effort from a tutor or the lecturer himself to fix."
