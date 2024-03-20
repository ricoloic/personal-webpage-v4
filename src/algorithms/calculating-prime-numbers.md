# Calculating prime numbers

There are methods to calculating prime numbers efficiently, but we can always start with the naive approach and improve it afterward.

## Definition and Usage

We first need to define it before trying to calculate it.
x
For more information on prime numbers you can take a look at the [wiki page](https://en.wikipedia.org/wiki/Prime_number) for it.

### What is a prime number

Following is a list of aspects defining it:

- [natural number](https://en.wikipedia.org/wiki/Natural_number)
- Greater than `1`
- Not a product of two smaller natural numbers (other than `1`)

Also, we can note that a [composite number](https://en.wikipedia.org/wiki/Composite_number) are the numbers that bridge the gaps between any two consecutive prime numbers. This means that they are a product of two or more smaller natural numbers.

### What is the use of prime numbers

They are the building blocks of all positive integers, and any positive integer can be expressed as a product of primes in a unique way. Prime numbers are also used extensively in modern cryptography, and prime factorization is an important tool in number theory and cryptography.

## Finding an algorithm

Let's make an algorithm to find if a given number (`x`) is prime or not.

### The Naive Way

One way to solve the problem could be to iterate starting from `2` upto, but not including, the number we want (`x`).

```go
func main() {
    number := 29
    for i := 2; i < number; i++ {
        // ...
    }
}
```

Here the number we want to find if is prime or not is `29`, which is contained in our `number` variable.

Then for each iteration, we can check the condition if `number` is divisible by `i` (any whole number before) and if so, that means that the `number` is a product of another number other than `1` or itself. This meaning that it is not a prime number.

```go
func main() {
    number := 29
    for i := 2; i < number; i++ {
        if number%i == 0 {
            println(false)
			return
        }
    }
	println(true)
}
```

Also, we know that if none of the divisions gives us whole numbers, we have a prime number.

This concludes our naive algorithm implementation.

#### Example

```css
number: 29;
i:  2;  2 < 29: true;  29%2 == 0: false;
i:  3;  3 < 29: true;  29%3 == 0: false;
i:  4;  4 < 29: true;  29%4 == 0: false;
i:  5;  5 < 29: true;  29%5 == 0: false;
i:  6;  6 < 29: true;  29%6 == 0: false;
i:  7;  7 < 29: true;  29%7 == 0: false;
i:  8;  8 < 29: true;  29%8 == 0: false;
i:  9;  9 < 29: true;  29%9 == 0: false;
i: 10; 10 < 29: true; 29%10 == 0: false;
i: 11; 11 < 29: true; 29%11 == 0: false;
i: 12; 12 < 29: true; 29%12 == 0: false;
i: 13; 13 < 29: true; 29%13 == 0: false;
i: 14; 14 < 29: true; 29%14 == 0: false;
i: 15; 15 < 29: true; 29%15 == 0: false;
i: 16; 16 < 29: true; 29%16 == 0: false;
i: 17; 17 < 29: true; 29%17 == 0: false;
i: 18; 18 < 29: true; 29%18 == 0: false;
i: 19; 19 < 29: true; 29%19 == 0: false;
i: 20; 20 < 29: true; 29%20 == 0: false;
i: 21; 21 < 29: true; 29%21 == 0: false;
i: 22; 22 < 29: true; 29%22 == 0: false;
i: 23; 23 < 29: true; 29%23 == 0: false;
i: 24; 24 < 29: true; 29%24 == 0: false;
i: 25; 25 < 29: true; 29%25 == 0: false;
i: 26; 26 < 29: true; 29%26 == 0: false;
i: 27; 27 < 29: true; 29%27 == 0: false;
i: 28; 28 < 29: true; 29%28 == 0: false;
return true;
```

### Skipping Every Other Iteration

We know that any even number are divisible by `2` which means that there is no need to check if the number is divisible by any even numbers other than `2`.

This means that we could reduce the amount of iterations by half by skipping every other one iteration.

But we still have to validate that the `number` is not divisible by `2` to begin with.

```go
func main() {
    number := 29
	
    if number%2 == 0 {
        return false
    }

    for i := 3; i < number; i += 2 {
        if number%i == 0 {
            println(false)
			return
        }
    }
    println(true)
}
```

So here the main changes that we did are:

1. Added the condition to validate that our `number` is not divisible by `2`
2. Updated our loop for `i` to start at `2 + 1` (`3`)
3. Updated our loop for `i` to skip the even numbers (`i += 2`)

With this we should get the same results as with our first implementation, but this time we don't have to check even numbers apart from `2`. Meaning, we do, at most, half of the iterations compared to our first implementation.

#### Example

```css
number: 29;
number%2 == 0: false;
i:  3;  3 < 29: true;  29%3 == 0: false;
i:  5;  5 < 29: true;  29%5 == 0: false;
i:  7;  7 < 29: true;  29%7 == 0: false;
i:  9;  9 < 29: true;  29%9 == 0: false;
i: 11; 11 < 29: true; 29%11 == 0: false;
i: 13; 13 < 29: true; 29%13 == 0: false;
i: 15; 15 < 29: true; 29%15 == 0: false;
i: 17; 17 < 29: true; 29%17 == 0: false;
i: 19; 19 < 29: true; 29%19 == 0: false;
i: 21; 21 < 29: true; 29%21 == 0: false;
i: 23; 23 < 29: true; 29%23 == 0: false;
i: 25; 25 < 29: true; 29%25 == 0: false;
i: 27; 27 < 29: true; 29%27 == 0: false;
i: 28; 28 < 29: true; 29%28 == 0: false;
return true;
```

### Keeping Track of Previous Primes

One other thing we could do is to keep track of the previous prime numbers found and only compare our `number` with those.

Similar to the previous implementation where we are skipping all numbers that are products of `2` we can do the same but with all numbers that are a product of other number, this would essentially mean that we skip the check against any composite numbers.

```go
func main() {
    primes := []int{2}
    number := 29

	for i := 3; i <= number; i += 2 {
        isPrime := true
        for _, prime := range primes {
            if i%prime == 0 {
                isPrime = false
                break
            }
        }

        if isPrime {
            primes = append(primes, i)
        }
    }

    if primes[len(primes) - 1] == number {
        println(true)
    } else {
        println(false)
    }
}
```

#### Example

```css
number: 29;

i: 3; prime: 2;
i: 3; isPrime: true;
primes: [2 3]

i: 5; prime: 2;
i: 5; prime: 3;
i: 5; isPrime: true;
primes: [2 3 5]

i: 7; prime: 2;
i: 7; prime: 3;
i: 7; prime: 5;
i: 7; isPrime: true;
primes: [2 3 5 7]

i: 9; prime: 2;
i: 9; prime: 3;
i: 9; isPrime: false;
primes: [2 3 5 7]

i: 11; prime: 2;
i: 11; prime: 3;
i: 11; prime: 5;
i: 11; prime: 7;
i: 11; isPrime: true;
primes: [2 3 5 7 11]

i: 13; prime: 2;
i: 13; prime: 3;
i: 13; prime: 5;
i: 13; prime: 7;
i: 13; prime: 11;
i: 13; isPrime: true;
primes: [2 3 5 7 11 13]

i: 15; prime: 2;
i: 15; prime: 3;
i: 15; isPrime: false;
primes: [2 3 5 7 11 13]

i: 17; prime: 2;
i: 17; prime: 3;
i: 17; prime: 5;
i: 17; prime: 7;
i: 17; prime: 11;
i: 17; prime: 13;
i: 17; isPrime: true;
primes: [2 3 5 7 11 13 17]

i: 19; prime: 2;
i: 19; prime: 3;
i: 19; prime: 5;
i: 19; prime: 7;
i: 19; prime: 11;
i: 19; prime: 13;
i: 19; prime: 17;
i: 19; isPrime: true;
primes: [2 3 5 7 11 13 17 19]

i: 21; prime: 2;
i: 21; prime: 3;
i: 21; isPrime: false;
primes: [2 3 5 7 11 13 17 19]

i: 23; prime: 2;
i: 23; prime: 3;
i: 23; prime: 5;
i: 23; prime: 7;
i: 23; prime: 11;
i: 23; prime: 13;
i: 23; prime: 17;
i: 23; prime: 19;
i: 23; isPrime: true;
primes: [2 3 5 7 11 13 17 19 23]

i: 25; prime: 2;
i: 25; prime: 3;
i: 25; prime: 5;
i: 25; isPrime: false;
primes: [2 3 5 7 11 13 17 19 23]

i: 27; prime: 2;
i: 27; prime: 3;
i: 27; isPrime: false;
primes: [2 3 5 7 11 13 17 19 23]

i: 29; prime: 2;
i: 29; prime: 3;
i: 29; prime: 5;
i: 29; prime: 7;
i: 29; prime: 11;
i: 29; prime: 13;
i: 29; prime: 17;
i: 29; prime: 19;
i: 29; prime: 23;
i: 29; isPrime: true;
primes: [2 3 5 7 11 13 17 19 23 29]

```

### Stopping after the square root

```go
func main() {
    primes := []int{2}
    number := 29

    for i := 3; i <= number; i += 2 {
        square := int(math.Floor(math.Sqrt(float64(i))))
        
        isPrime := true
        for _, prime := range primes {
            if square < prime {
                isPrime = true
                break
            }
			
            if i%prime == 0 {
                isPrime = false
                break
            }
        }

        if isPrime {
            primes = append(primes, i)
        }
    }

    if primes[len(primes) - 1] == number {
        println(true)
    } else {
        println(false)
    }
}
```

#### Example

```css
i: 3; prime: 2;
i: 3; isPrime: true;
primes: [2 3]

i: 5; prime: 2;
i: 5; prime: 3;
i: 5; isPrime: true;
primes: [2 3 5]

i: 7; prime: 2;
i: 7; prime: 3;
i: 7; isPrime: true;
primes: [2 3 5 7]

i: 9; prime: 2;
i: 9; prime: 3;
i: 9; isPrime: false;
primes: [2 3 5 7]

i: 11; prime: 2;
i: 11; prime: 3;
i: 11; prime: 5;
i: 11; isPrime: true;
primes: [2 3 5 7 11]

i: 13; prime: 2;
i: 13; prime: 3;
i: 13; prime: 5;
i: 13; isPrime: true;
primes: [2 3 5 7 11 13]

i: 15; prime: 2;
i: 15; prime: 3;
i: 15; isPrime: false;
primes: [2 3 5 7 11 13]

i: 17; prime: 2;
i: 17; prime: 3;
i: 17; prime: 5;
i: 17; isPrime: true;
primes: [2 3 5 7 11 13 17]

i: 19; prime: 2;
i: 19; prime: 3;
i: 19; prime: 5;
i: 19; isPrime: true;
primes: [2 3 5 7 11 13 17 19]

i: 21; prime: 2;
i: 21; prime: 3;
i: 21; isPrime: false;
primes: [2 3 5 7 11 13 17 19]

i: 23; prime: 2;
i: 23; prime: 3;
i: 23; prime: 5;
i: 23; isPrime: true;
primes: [2 3 5 7 11 13 17 19 23]

i: 25; prime: 2;
i: 25; prime: 3;
i: 25; prime: 5;
i: 25; isPrime: false;
primes: [2 3 5 7 11 13 17 19 23]

i: 27; prime: 2;
i: 27; prime: 3;
i: 27; isPrime: false;
primes: [2 3 5 7 11 13 17 19 23]

i: 29; prime: 2;
i: 29; prime: 3;
i: 29; prime: 5;
i: 29; prime: 7;
i: 29; isPrime: true;
primes: [2 3 5 7 11 13 17 19 23 29]
```
