# Mission Sidequest 17.1: Back to Basics!

Start date: 25 October 2017  
**Due: 31 October 2016, 23:59**

Readings:  
- Lecture notes on Object-Oriented Programming
    
    
As you are training on the virtual battlefield with Grandmaster Martin and the rest of the initiates, you notice instructors Derek and Pixel walking around. They notice you noticing them and call you over. You approach cautiously, wondering what they are up to.

"I need your help," begins Instructor Derek, "Grandmaster Martin asked me to design a new and simpler battlefield simulator to train younglings. I don't know how any of these systems work and I need your help in building them. If I don't get it done, there's no telling what he'll do to me."

"Why me?" you exclaim, "Why can't Pixel help you?"

"I went to him first, but it turns out he's more hopeless than I am! I was going to report his cluelessness to the Grandmaster, but he pleaded with me and told me he'd help me find someone to assist in the new simulator. That's why he's here now."

Pixel, embarrassed, just hangs his head in silence.

"Besides, I saw the way you handled the current simulator and I think you're the perfect person to help me."

You feel pity for these two sorry-looking characters and decide to help them out.

This sidequest consists of **three** tasks.

**Important note:** the object system that you will be working with in this mission is completely different from the Source object system used in CS1101S. Do not be confused by these two object systems.

## Task 1

The Grandmaster has bestowed upon Derek fragments of a program to be used to build the new simulator.

```
function is_x_message(message) {
    return message.substring(0,3) === "is_";
}

function make_object() {
    function self(message) {
        var msg = head(message);
        if (msg === "is_object") {
            return true;
        } else if (is_x_message(msg)) {
            return false;
        } else {
            return list("No Method Found:", msg);
        }
    }
    return self;
}
```

Derek understands that this object system uses functions as objects. Messages are passed to the object to access its operations; this is analogous to calling its methods. Messages are represented as lists, with the first element of the list being the name of the method to call, and the rest being the arguments to call it with.

He also understands the necessity of the `is_x` family of methods: they are used to determine the type of an object. For example, an object of type B is expected to respond to the message `is_b` with the value `true`, but respond to the message `is_c` with `false`.

What Derek is puzzled about is the concept of `self`. He gives you a shaky account of his understanding, interspersed with philosophical ramblings:


> `self` points to the object that was made and is used when an object needs to call its own methods. Implementing objects using this approach is simple and easy to understand.

> This approach also allows objects to be extended: the extended object would be able to use `self` pointer to invoke its own methods, even if the methods may have been overridden in an extending object.

Is Derek correct? Do you think that this is a good object system? In your answer, you should discuss the properties required in an object-oriented program, whether this object system allows those properties to be implemented, and problems with this system, if any.


## Task 2

The basic object shown in Task 1 is not very useful on its own. Show how you can extend it to create a `Named Object`.

A `Named Object` is an object that has a name assigned to it when it is created. It should also respond to the `name` message, which may take a single string argument. If an argument is given, the object's name should be changed to the given string. If no arguments are given, the object's current name should be returned.


## Task 3

Now that you have defined a Named Object, help Derek define a Person object. A Person is a Named Object, is able to speak, and is able to engage in partnerships with other Persons.

### Partnership Rules
In a battlefield, it is not uncommon to see combatants fighting in pairs. They are generally more deadly than unpartnered combatants, so it would be useful to simulate them.

A person can only engage in a partnership with someone who is not already partnered, and each person can only partner with **one** other person. A partnership is also a permanent relationship and those engaged in a partnership are not allowed to change their partners.

For our purposes, a person can partner with someone else using the message `join_partner` and a person's partner can be retrieved with the message `partner`.

### Speaking Rules
When a person speaks, the person will first say his name. If the person has a partner, he will also introduce his partner by saying his name.

For our purposes, a person will speak when the method `talk` is called.

### Your Task

Define the Person object according to the rules above. Refer to the sample programs for example interactions.

