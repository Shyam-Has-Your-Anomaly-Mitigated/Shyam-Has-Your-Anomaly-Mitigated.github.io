'''
UNCRACKABLE? The Collatz Conjecture - Numberphile
	https://youtu.be/5mFpVDpKX70
Collatz Conjecture (extra footage) - Numberphile
	https://youtu.be/O2_h3z1YgEU
https://en.wikipedia.org/wiki/Prime_number#Definition_and_examples
https://en.wikipedia.org/wiki/Collatz_conjecture
...I can do this with Mathematica?!? I should look into it..!
	https://en.wikipedia.org/wiki/File:Collatz1000mathematica.png
...I can do this with SVG?!? I should look into it..!
	https://en.wikipedia.org/wiki/File:Collatz-graph-all-30-no27.svg
	https://en.wikipedia.org/wiki/File:Collatz-tree,_depth%3D20.svg
https://xkcd.com/710/
'''

def e(n): return n/2   if n%2==0 else -1

def o(n): return 3*n+1 if n%2!=0 else -1

def p(n):
    n= e(n) if n%2==0 else o(n)
    while n%2==0: n= e(n)
    return n

def ip(n):
    if n<2 : return False
    if n==2: return True
    for e in range(2, n):
        if n%e==0: return False
    return True

def s(n):
    n= e(n) if n%2==0 else o(n)
    while not ip(n) and n!=1: n= p(n)
    return n

def r(m):
    for n in range(m):
        if ip(n): print n, s(n)

def t(n):
    print n,
    while n!=1:
        n= s(n)
        print n,
    print 0
