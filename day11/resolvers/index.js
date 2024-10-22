/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: {{{year}}}*/
/**
 * Resolve Index
 * @copyright {{{year}}} Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
const { GraphQLUpload } = require("graphql-upload");

const updateUserResolver = require("./update/updateUser");
const singleUserResolver = require("./single/singleUser");
const typeUserResolver = require("./type/typeUser");

const createLinkResolver = require("./create/createLink");
const typeLinkResolver = require("./type/typeLink");
const singleLinkResolver = require("./single/singleLink");
const deactivateAllLinksResolver = require("./delete/deactivateAllLinks");
const allMovie = require("./all/allMovie");
const allReview = require("./all/allReview");
const allDirector = require("./all/allDirector");
const allActor = require("./all/allActor");
const allMovieWithreview = require("./all/allMovieWithreview");
const createActorToGenre = require("./create/createActorToGenre");
const director = require("./create/director");
const review = require("./create/review");

// const calendarResolver = require('./custom/calendar');
// const noteResolver = require('./custom/note');
// const customImageResolver = require('./custom/image');
// const uploadFileMutationResolver = require('./custom/uploadFile');

// const connectionStepsResolver = require('./custom/connectionSteps');

module.exports = {
  Upload: GraphQLUpload,
  Query: {
    user: singleUserResolver,
    link: singleLinkResolver,
    movies: allMovie,
    reviews: allReview,
    directors: allDirector,
    actors: allActor,
    moviesWithReviewsAbove: allMovieWithreview,
    // ...calendarResolver.Query,
    // ...customImageResolver.Query,
    // ...noteResolver.Query,
    // ...connectionStepsResolver.Query
  },
  Mutation: {
    updateUser: updateUserResolver,
    createLink: createLinkResolver,
    deactivateAllLinks: deactivateAllLinksResolver,
    addActorToGenreMovies: createActorToGenre.Mutation.addActorToGenreMovies,

    // uploadFile: uploadFileMutationResolver,
    // ...calendarResolver.Mutation,
    // ...customImageResolver.Mutation,
    // ...noteResolver.Mutation,
  },

  // ...calendarResolver.Type,
  // ...noteResolver.Type,

  Movie: director.Movie,
  Review: review.Review,

  User: typeUserResolver,
  Link: typeLinkResolver,
};
