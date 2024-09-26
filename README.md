# Notes

I think that this was a fairly simple challenge, but could become much more complex depending on how far I chose to take it. As the time constraint was 2-8 hours, my implementation is fairly trivial. I use the following:

-   Node.js
-   TypeScript
-   PostgreSQL
-   Drizzle ORM

The mentioned technologies are essentially the entirety of my backend stack. Node.js and TypeScript are from the boilerplate given, while PostgreSQL and Drizzle are my own choices since I've been using them recently.

Because of my use of PostgreSQL, the program also expects the following environment variables:

-   `DATABASE_URL` - a valid PostgreSQL database URL, used for database operations and migrations with drizzle

I would have liked to optimize transaction creation a bit more, particularly with casting timestamp from a string to a Date for every creation request, even if it's a withdrawal request for which the cast doesn't matter. I left it as such for readability purposes though. I believe there's a good middleground between absolute performance and readability for future engineers I'd be working with or who'd be maintaining the code themselves.

_I did have to modify the test cases to use a static UUID as well, since I had a foreign key constraint that the account ID had to be pre-existing, but the tests do not create a new account as there is no route to create a new account._
