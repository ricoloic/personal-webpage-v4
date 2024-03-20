# Calculating the cardinality of ordered n-tuple

Given a tuple of 4 elements, if each of the elements can have the same amount of different position as there is elements in the tuple. We can calculate the cardinality of the total possible count of different tuples when there elements are positionned in order.

```
aaaa	a	a	a	a
aaab	a	a	a	b
aaac	a	a	a	c
aaad	a	a	a	d
aabb	a	a	b	b
aabc	a	a	b	c
aabd	a	a	b	d
aacc	a	a	c	c
aacd	a	a	c	d
aadd	a	a	d	d
abbb	a	b	b	b
abbc	a	b	b	c
abbd	a	b	b	d
abcc	a	b	c	c
abcd	a	b	c	d
abdd	a	b	d	d
accc	a	c	c	c
accd	a	c	c	d
acdd	a	c	d	d
addd	a	d	d	d
bbbb	b	b	b	b
bbbc	b	b	b	c
bbbd	b	b	b	d
bbcc	b	b	c	c
bbcd	b	b	c	d
bbdd	b	b	d	d
bccc	b	c	c	c
bccd	b	c	c	d
bcdd	b	c	d	d
bddd	b	d	d	d
cccc	c	c	c	c
cccd	c	c	c	d
ccdd	c	c	d	d
cddd	c	d	d	d
dddd	d	d	d	d
```

In this case we can count the number of rows present and notice that with for a tuple of 4 elements we have a cardinality of 35.

## Algorithm

```go
package main

import (
	"fmt"
	"time"
)

func calculate(t int, l int, index int, sum int) int {
	l += 1

	for i := 1; i <= index; i++ {
		if l < t {
			sum = calculate(t, l, i, sum)
		} else {
			sum += i
		}
	}

	return sum
}

func main() {
	for i := 1; i <= 20; i++ {
		fmt.Printf("Calculating cardinality for tuple of size %d\n", i)

		startTime := time.Now()

		res := calculate(i, 1, i, 0)

		endTime := time.Now()
		executionTime := endTime.Sub(startTime)

		fmt.Printf("Card:  %d\n", res)
		fmt.Printf("Execution time: %d nanosecond\n\n", executionTime)
	}
}
```


```
Calculating cardinality for tuple of size 1
Card:  1
Execution time: 42 nanosecond

Calculating cardinality for tuple of size 2
Card:  3
Execution time: 41 nanosecond

Calculating cardinality for tuple of size 3
Card:  10
Execution time: 83 nanosecond

Calculating cardinality for tuple of size 4
Card:  35
Execution time: 166 nanosecond

Calculating cardinality for tuple of size 5
Card:  126
Execution time: 416 nanosecond

Calculating cardinality for tuple of size 6
Card:  462
Execution time: 958 nanosecond

Calculating cardinality for tuple of size 7
Card:  1716
Execution time: 3125 nanosecond

Calculating cardinality for tuple of size 8
Card:  6435
Execution time: 11500 nanosecond

Calculating cardinality for tuple of size 9
Card:  24310
Execution time: 42958 nanosecond

Calculating cardinality for tuple of size 10
Card:  92378
Execution time: 179666 nanosecond

Calculating cardinality for tuple of size 11
Card:  352716
Execution time: 833459 nanosecond

Calculating cardinality for tuple of size 12
Card:  1352078
Execution time: 2423500 nanosecond

Calculating cardinality for tuple of size 13
Card:  5200300
Execution time: 9075291 nanosecond

Calculating cardinality for tuple of size 14
Card:  20058300
Execution time: 34792667 nanosecond

Calculating cardinality for tuple of size 15
Card:  77558760
Execution time: 156505417 nanosecond

Calculating cardinality for tuple of size 16
Card:  300540195
Execution time: 511428791 nanosecond

Calculating cardinality for tuple of size 17
Card:  1166803110
Execution time: 1991442583 nanosecond

Calculating cardinality for tuple of size 18
Card:  4537567650
Execution time: 7740995792 nanosecond

Calculating cardinality for tuple of size 19
Card:  17672631900
Execution time: 30314188167 nanosecond

Calculating cardinality for tuple of size 20
Card:  68923264410
Execution time: 118286735917 nanosecond
```

**Reference:** [The on-line encyclopedia of integer sequences](https://oeis.org/A001700)
