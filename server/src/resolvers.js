import {
  allBooks, 
  imageUrl, 
  searchBook,
  createBook
} from './book';
import {allReviews, createReview} from './review'
import gravatar from "gravatar";
import search from './search'

const resolvers = {
  SearchBookResult: {
    imageUrl: (result, args) => imageUrl(args.size, result.id)
  },
  SearchResult: {
    __resolveType: obj => (obj.__type)
  },
  User: {
    imageUrl: (user, args) => gravatar.url(user.email, {s: args.size})
  },
  Book: {
    imageUrl: (book, args) => imageUrl(args.size, book.googleId),
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
    },
    searchBook: (root, {query}) => searchBook(query),
    search: (root, {query}) => search(query)
  },
  Mutation: {
    createReview: (root, {reviewInput}) => createReview(reviewInput),
    createBook: (root, {googleBookId}) => createBook(googleBookId)
  }
};
export default resolvers;