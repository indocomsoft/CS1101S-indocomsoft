# Mission Sidequest 19.1: Multiple Headaches

Start date: 28 October 2017  
**Due: 9 November 2017, 23:59**

Readings:  
- Lecture notes on Object-Oriented Programming 
    
    
## Background

Multiple inheritance is a concept in object-oriented programming where a class can inherit from two different classes and use functionality from both.

Derek and Pixel want to use multiple inheritance to model the concept of traitors in the battle simulator you helped them build previously. Traitors are Sith Lords who were previously on the side of the Source Academy.

While implementing traitors, they ran into a problem which resulted in their argument.

This is how they defined the traitor: **The rest of the supporting program, such as the definition of `make_sith_lord`, can be found in task 3&#39;s template file.**

```
function make_traitor(name, sith_name, child) {
    function self(message) {
        var msg = head(message);
        if (msg === &quot;is_traitor&quot;) {
            return true;
        } else if (is_x_message(msg)) {
            return parent1(message) || parent2(message);
        } else {
            var result = parent1(message);
            if (is_pair(result) &amp;&amp; head(result) === &quot;No Method Found:&quot;) {
                return parent2(message);
            } else {
                return result;
            }
        }
    }

    var true_self = child === undefined ? self : child;
    var parent1 = make_source_warrior(name, true_self);
    var parent2 = make_sith_lord(name, sith_name, true_self);

    return self;
}

```

After writing the definition above, they tested it in the following manner:

```
var dooku = make_traitor(&quot;Dooku&quot;, &quot;Tyranus&quot;, undefined);
display(dooku(list(&quot;is_source_warrior&quot;)));
// true

display(dooku(list(&quot;is_sith_lord&quot;)));
// true

display(dooku(list(&quot;is_traitor&quot;)));
// true

dooku(list(&quot;swing&quot;));
// Dooku swings lightsaber!

dooku(list(&quot;talk&quot;)); // error here - why didn&#39;t he mention that he is Lord Tyranus?
// Dooku says: Hi, I am Dooku!
```

This sidequest consists of **three** tasks.

## Task 1

Derek and Pixel have each proposed a way to figure out the right method to call when there is multiple inheritance. Your task is to compare and contrast their ways, and describe how one may be better than the other.

Both of their proposals use the class diagram illustrated in the following figure as an example. In this example, G is the only class that uses multiple inheritance to inherit from classes E and F.

This is a purely explanatory task; programs do not need to be submitted. However, if you think adding a program would help you explain your answer, please do so.

![class_diagram](https://i.imgur.com/Lkkpj47.jpg)

### Derek's Breadth-First Search Method

Derek proposed that the first thing to do when using multiple inheritance is to designate the dominant class. In the above example, Derek decides to make E the dominant class. Next, when a message is passed to G, the first step is to check if the message is handled in G. If so, then G would just handle the message as per normal.

However, if G does not handle the message, the dominant class of G, E in our example, would be searched for the method. If E handles it, then the search ends. Otherwise, the search would continue in the non-dominant class of G, F in our example. If F handles it, the search ends.

However, if the search fails again, the parents of E and F will be searched ”layer by layer”. If the message is not handled in any of the classes, including the root class, then the message would essentially be an unknown message to class G.

### Pixel's Distance Method

Pixel proposed an alternate method. While a dominant class still needs to be defined, he proposes that instead of going backwards, each class should be labelled with a distance from the root, A. That is, A has distance 0, B and C has distance 1, D has distance 2 and so on.

When G is given a message, the search for an object to handle the message should start from the class with the greatest distance to the class with the least distance. In event of ties, where classes have the same distance from the root, the class that belongs to the side of the dominant parent will be searched first.


## Task 2

It is time to make a choice.

Who do you think has a better method? Explain your choice. If you think both of them are truly hopeless, propose your own method and explain why your method is better than **both** of theirs.


## Task 3

Implement the method you selected in Task 2. Once you have finished implementation, execute the same example with Count Dooku and show your output clearly.