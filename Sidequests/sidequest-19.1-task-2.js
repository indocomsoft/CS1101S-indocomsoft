/*
In my opinion, BFS is the better method.

As I have explained in task 1,

        A
      /    \
    /       \
    B       C 
    |       |
    D       E
    |       |
    F       |
    |       |
    G       |
    |       |
    H       |
     \     /
      \   / 
        I
LHS dominant
Derek's method: I, H, E, G, C, F, A, D, B, A
Pixel's method: I, H, G, F, D, E, B, C, A, A
RHS dominant
Derek's method: I, E, H, C, G, A, F, D, B, A
Pixel's method: I, H, G, F, E, D, C, B, A, A
(Note that in this sidequest's implementation of multiple inheritance, when
instantiated, classes C and B instatiates 2 distinct objects of class A as
their parents, hence class A is searched twice)

Derek's BFS method might be better because when a class inherits
multiple classes, it is usually done because we need to use attributes and
methods directly above it (i.e. H and E in my diagram). Derek's method favours
parents closest to the bottom-most class, thus it will look up classes
right above it, thus hitting both H and E sooner than with Pixel's method.

Pixel's method is only useful if the attributes and methods on the non-dominant
side of the chain is rarely used comparatively to the dominant side.

        A
      /  \
     B   C
     |   |
     D   |
     |   |
     E   |
     |   |
     F   |
     |   |
     \  /
      G

*/