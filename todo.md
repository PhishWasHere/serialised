<!-- colors -->
\x1b[35m> Ready!\x1b[0m = puple
\x1b[> Ready!\x1b[0m = yellow
\x1b[31m> Ready!\x1b[0m = red
\x1b[94m> Ready!\x1b[0m = blue

<!-- get follow list (make sure to not exceed api limit) -->
get token from md login api
use token to get follow list
(need to add timeout function to avoid api limits, want to avoid using db's or store data. temp arr's?)

<!-- compare last md update date to scraper data -->
foreach loop to check all manga, should be pretty easy...

<!-- create stack if manga is likely not updated on md -->
if updated on scraper but not on md, move to stack which will seve as res object.
will need to add a grace period, 1 week? or make 2 stacks, 1 for def not updated another for possibly

<!-- get the discord bot to work -->
setup / functions
    "/updated" for a general check
    "/follow-check" to check all items in follow list

<!--  -->