# GhostWriter

This program is meant to "rewrite" text. It goes through original text, creating a data structure like this:

word: cat, following words: ate, jumped

word: ate, following words: all, some, my

word: jumped, following words: down, on

And so on. Then it rewrites sentences based on probability and randomness like this:

Cat _ _ -> Cat jumped _ -> Cat jumped on

# Current version

- Don't change words less than 4 characters long to keep basic structure.
- Keep every nth word
- Following word must have n same last letters: Cat jumpED = Cat _ -> Cat playED

# To do

- Still requires more work on basic sentence forming
- Words like "isn't" are registered as: isn, t (/\w+|\s+|[^\s\w]+/g), regex might need some work
