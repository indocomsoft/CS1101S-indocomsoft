function is_x_message(message) {
    return message.substring(0,3) === "is_";
}

function make_object(child) {
    var method_list = list("is_object", "get_methods");
    function self(message) {
        var msg = head(message);
        if (msg === "is_object") {
            return true;
        } else if (is_x_message(msg)) {
            return false;
        } else if (msg === "get_methods") {
            return method_list;
        } else {
            return list("No Method Found:", msg);
        }
    }
    var true_self = child === undefined ? self : child;
    return self;
}

function make_named_object(name, child) {
    var method_list = list("is_named_object", "name", "get_parent", "get_methods");
    function self(message) {
        var msg = head(message);
        if (msg === "is_named_object") {
            return true;
        } else if (msg === "name") {
            // check if getter/setter
            if (is_empty_list(tail(message))) {
                return name;
            } else {
                name = head(tail(message));
            }
        } else if (msg === "get_parent") {
            return parent;
        } else if (msg === "get_methods") {
            return method_list;
        } else {
            return parent(message);
        }
    }
    // define parent
    var true_self = child === undefined ? self : child;
    var parent = make_object(true_self);

    return self;
}

function make_person(name, child) {
    var method_list = list("is_person", "talk", "join_partner","force_join_partner", "partner", "get_parent", "get_methods");
     function self(message) {
        var msg = head(message);
        var name = parent(list("name"));
        if (msg === "is_person") {
            return true;
        } else if (msg === "talk") {
            if (partner === undefined) {
                display(name + " says: Hi! I am " + name + "!");
            } else {
                display(name + " says: I am " + name + " and I am partnered with " + partner(list("name")) + "!");
            }
        } else if (msg === "join_partner") {
            if (partner !== undefined) {
                display(name + " exclaims: I am already partnered!");
            } else {
                // check partner
                var proposed_partner = head(tail(message));
                if (proposed_partner(list("partner")) !== undefined) {
                    display(name + " exclaims: " + proposed_partner(list("name")) + " is already partnered!");
                } else {
                    // assign partner
                    partner = proposed_partner;
                    partner(list("force_join_partner", true_self));
                }
            }
        } else if (msg === "force_join_partner") {
            // Used to update partner.
            partner = head(tail(message));
        } else if (msg === "partner") {
            return partner;
        } else if (msg === "get_parent") {
            return parent;
        } else if (msg === "get_methods") {
            return method_list;
        } else {
            return parent(message);
        }
    }
    // define parent
    var true_self = child === undefined ? self : child;
    var parent = make_named_object(name, true_self);

    var partner = undefined;

    return self;
}

function make_source_warrior(name, child) {
    var method_list = list("is_source_warrior", "swing", "get_parent", "get_methods");
    function self(message) {
        var msg = head(message);
        if (msg === "is_source_warrior") {
            return true;
        } else if (msg === "swing") {
            display(parent(list("name")) + " swings lightsaber!");
        } else if (msg === "get_parent") {
            return parent;
        } else if (msg === "get_methods") {
            return method_list;
        } else {
            return parent(message);
        }
    }
    var true_self = child === undefined ? self : child;
    var parent = make_person(name, true_self);

    return self;
}

function make_sith_lord(name, sith_name, child) {
    var method_list = list("is_sith_lord", "sith_name", "talk", "get_parent", "get_methods");
    function self(message) {
        var msg = head(message);
        if (msg === "is_sith_lord") {
            return true;
        } else if (msg === "sith_name") {
            // check if getter/setter
            if (is_empty_list(tail(message))) {
                return sith_name;
            } else {
                sith_name = head(tail(message));
            }
        } else if (msg === "talk") {
            parent(message);
            display(true_self(list("name")) + " says: Make that Lord " + true_self(list("sith_name")) + ", muahahaha...");
        } else if (msg === "get_parent") {
            return parent;
        } else if (msg === "get_methods") {
            return method_list;
        } else {
            return parent(message);
        }
    }
    var true_self = child === undefined ? self : child;
    var parent = make_person(name, true_self);

    return self;
}


function make_traitor(name, sith_name, child) {
    var method_list = list("is_traitor", "get_parent", "get_methods");
    function self(message) {
        var msg = head(message);
        if (msg === "is_traitor") {
            return true;
        } else if (is_x_message(msg)) {
            return parent1(message) || parent2(message);
        } else if (msg === "get_parent") {
            // parent1 is the dominant parent
            return list(parent1, parent2);
        } else if (msg === "get_methods") {
            return method_list;
        } else {
            // var result = parent1(message);
            // if (is_pair(result) && head(result) === "No Method Found:") {
            //     return parent2(message);
            // } else {
            //     return result;
            // }
            return bfs(message, self);
        }
    }
    var true_self = child === undefined ? self : child;
    var parent1 = make_source_warrior(name, true_self);
    var parent2 = make_sith_lord(name, sith_name, true_self);

    return self;
}

// your program here.
function bfs(message, start) {
    var to_visit = make_queue();
    var visited = [];
    enqueue(to_visit, start);

    var parent = undefined;
    var child = undefined;
    var method_list = undefined;
    var parent_dom = undefined;
    var parent_other = undefined;
    while(!is_empty_queue(to_visit)) {
        child = dequeue(to_visit);
        parent = child(list("get_parent"));
        method_list = child(list("get_methods"));
        if (contains(head(message), method_list)) {
            return child(message);
        } else { }

        if (is_pair(parent) && head(parent) === "No Method Found:") {
            // we have reached make_object
            // stop the search in this part of the chain
        } else if (is_list(parent)) {
            // Multiple inheritance
            parent_dom = head(parent);
            if (!contains(parent_dom, visited)) {
                enqueue(to_visit, parent_dom);
            } else { }
            parent_other = head(tail(parent));
            if (!contains(parent_dom, visited)) {
                enqueue(to_visit, parent_other);
            } else { }
        } else {
            // Single inheritance
            if (!contains(parent, visited)) {
                enqueue(to_visit, parent);
            } else { }
        }
        // mark the node as visited
        visited = pair(child, visited);
    }
    return list("No Method Found:", msg);
}


// Queue data structure
function make_queue() {
    return pair([], []);
}

function is_empty_queue(q) {
    return is_empty_list(head(q));
}

function enqueue(q, item) {
    if (is_empty_queue(q)) {
        set_head(q, pair(item, []));
        set_tail(q, head(q));
    } else {
        set_tail(tail(q), pair(item, []));
        set_tail(q, tail(tail(q)));
    }
}

function dequeue(q) {
    var front = head(head(q));
    set_head(q, tail(head(q)));
    return front;
}

function peek(q) {
    return head(head(q));
}

function contains(x, lst) {
    return !is_empty_list(filter(function(y) { return y === x; }, lst));
}


// count dooku example
var dooku = make_traitor("Dooku", "Tyranus", undefined);
display(dooku(list("is_source_warrior")));
// true

display(dooku(list("is_sith_lord")));
// true

display(dooku(list("is_traitor")));
// true

dooku(list("swing"));
// Dooku swings lightsaber!

dooku(list("talk")); 
// Dooku says: Hi, I am Dooku!
// Dooku says: Make that Lord Tyranus, muahahaha...
