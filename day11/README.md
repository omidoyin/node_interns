# day 11

## Instructions

- setup project
- clone to your github
- Read the documentation https://www.apollographql.com/docs/
- Create the following:

```
Create model

movies
- id
- title
- director_id
- main_genre
- status
- review

review
- id
- notes
- movie_id

director
- id
- name

actors
- id
- name

movie_actor
- id
- actor_id
- movie_id

genre
- id
- name

genre_movie
- id
- movie_id
- genre_id
```

- Create resolvers and make query for the 4 tables. Inside movies, we can get all actors in that movie

- Create a query in apollo to get all movies with reviews > # provided by user

- Create a mutation to add an actor to every movie for given genre

- Everything must be done by end of date
