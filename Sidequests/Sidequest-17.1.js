// Source Week 10

// Task 1
// your answer here.
/*
Derek is correct.

According to Lecture slides 10A, there are four main characteristics of
Object-Oriented Programming: aggregation, polymorphism, classification and
inheritance.

Aggregation (Objects are collections of properties - key/value pairs)
This is achieved as in function self, message is the key, and the method / 
attribute inside the executed if-else if-else block is the value.

Polymorphism (Objects provide for late binding (the object “decides” the
method))
This is achieved through function self which will carry out the appropriate
action or return the appropriate value depending on the message passed. In a
way, function self acts as a dispatch function.

Classification (Class provide constructors and methods)
Function make_object is the constructor. Methods are located in the
if-else if-else block inside function self

Inheritance (Classes can extend other classes)
This is achievable by creating a dispatch function self when creating a new
class extending another class. The dispatch function in the child class 
should ask its parent when it has exhausted all its properties. This is best
exemplified through the example code below:

An example code of class Person extending make_object and
Professor extending Person:
*/
function Person(height, weight) {
    var parent = make_object();
    function self(message) {
        var msg = head(message);
        if (msg === "is_Person") {
            return true;
        } else if (msg === "get_height") {
            return height;
        } else if (msg === "set_height") {
            height = head(tail(message));
        } else if (msg === "get_weight") {
            return weight;
        } else if (msg === "set_weight") {
            weight = head(tail(message));
        } else if (msg === "bmi") {
            return weight / math_pow((height/100),2);
        } else {
            return parent(message);
        }
    }
    return self;
}

function Professor(height, weight, school) {
    var parent = Person(height, weight);
    function self(message) {
        if (msg === "is_Professor") {
            return true;
        } else if (msg === "get_school") {
            return school;
        } else if (msg === "set_school") {
            school = head(tail(message));
        } else {
            return parent(message);
        }
    }
    return self;
}
// Instantiate a new object hartinMenz
var hartinMenz = Professor(185, 75, "NUS");
/*

The disadvantage is that this object system is that this system is static, thus
class prototypes cannot be changed on the fly easily. Although we can overwrite
the class prototype, objects instantiated using the old prototype would keep
on using the old prototype.
*/

// Task 2
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

function make_named_object(name) {
    var parent = make_object();
    function self(message) {
        var msg = head(message);
        if (msg === "is_named_object") {
            return true;
        } else if (msg === "name") {
            if (length(message) === 1) {
                return name;
            } else {
                name = head(tail(message));
            }
        } else {
            return parent(message);
        }
    }
    return self;
}

// Sample Execution
var boba_fett = make_named_object("boba_fett");
var random_object = make_object();

display(boba_fett(list("is_named_object"))); // true
display(random_object(list("is_named_object"))); // false

display(boba_fett(list("name"))); // "boba_fett"

var palpatine = make_named_object("palpatine");
display(palpatine(list("name"))); // palpatine

palpatine(list("name", "darth sidious"));
display(palpatine(list("name"))); // darth sidious

// Task 3
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

function make_named_object(name) {
    var parent = make_object();
    function self(message) {
        var msg = head(message);
        if (msg === "is_named_object") {
            return true;
        } else if (msg === "name") {
            if (length(message) === 1) {
                return name;
            } else {
                name = head(tail(message));
            }
        } else {
            return parent(message);
        }
    }
    return self;
}

function make_person(name) {
    var parent = make_named_object(name);
    var partner = undefined;
    var hasPartner = false;
    function self(message) {
        var msg = head(message);
        if (msg === "is_person") {
            return true;
        } else if (msg === "join_partner") {
            var arg = head(tail(message));
            if (partner === undefined && arg(list("partner")) === undefined
                && !hasPartner) {
                hasPartner = true;
                arg(list("join_partner", self));
                partner = arg;
            } else {
                return name + " exclaims: "
                       + (partner !== undefined ? "I am"
                                                : arg(list("name")) + " is")
                        + " already partnered!";
            }
        } else if (msg === "partner") {
            return partner;
        } else if (msg === "talk") {
            return name + " says: "
                   + (partner === undefined ? "Hi! ": "") + "I am " + name
                   + (partner === undefined
                        ? ""
                        : " and I am partnered with " + partner(list("name")))
                   + "!";
        } else {
            return parent(message);
        }
    }
    return self;
}

// Sample Execution
var boba_fett = make_person("Boba Fett");
var jango_fett = make_person("Jango Fett");
var hk_47 = make_person("HK 47");

display(boba_fett(list("is_person"))); // true

display(boba_fett(list("join_partner", jango_fett)));

display(boba_fett(list("talk")));
// Boba Fett says: I am Boba Fett and I am partnered with Jango Fett!

display(jango_fett(list("join_partner", boba_fett)));
// Jango Fett exclaims: I am already partnered!

display(boba_fett(list("join_partner", hk_47)));
// Boba Fett exclaims: I am already partnered!

display(hk_47(list("talk")));
// HK 47 says: Hi! I am HK 47!

display(boba_fett(list("talk")));
// Boba Fett says: I am Boba Fett and I am partnered with Jango Fett!

display((jango_fett(list("partner")))(list("talk")));
// Boba Fett says: I am Boba Fett and I am partnered with Jango Fett!

display(hk_47(list("join_partner", boba_fett)));
// HK 47 exclaims: Boba Fett is already partnered!
