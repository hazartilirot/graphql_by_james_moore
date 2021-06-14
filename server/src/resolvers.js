import {allBooks, findBookById, imageUrl} from './book';
import {authorsByBookId} from './author'
import {allReviews, createReview} from './review'
import gravatar from "gravatar";

const resolvers = {
  User: {
    imageUrl: (user, args) => gravatar.url(user.email, {s: args.size})
  },
  Book: {
    imageUrl: (book, object) => imageUrl(object.size, book.googleId),
    authors: (book, args, context) => {
      const {loaders: {findAuthorsByBookIdsLoader}} = context;
      return findAuthorsByBookIdsLoader.load(book.id);
      //return authorsByBookId(book.id) inefficient!
    },
    reviews: (book, args, context) => {
      const {loaders: {findReviewsByIdsLoader}} = context;
      return findReviewsByIdsLoader.load(book.id)
    }
  },
  Review: {
    book: (review, args, context) => {
      const {loaders: {findBooksByIdsLoader}} = context
      return findBooksByIdsLoader.load(review.bookId);
    },
    user: (review, args, context) => {
      const {loaders: {findUsersByIdsLoader}} = context;
      return findUsersByIdsLoader.load(review.userId)
    }
  },
  Query: {
    books: (root, args) => allBooks(args),
    reviews: (root, args) => allReviews(args),
    book: (root, args, context) => {
      const {loaders: {findBooksByIdsLoader}} = context;
      return findBooksByIdsLoader.load(args.id);
    }
  },
  Mutation: {
    createReview: (root, args) => {
      const {reviewInput} = args;
      return createReview(reviewInput)
    }
  }
};
export default resolvers;