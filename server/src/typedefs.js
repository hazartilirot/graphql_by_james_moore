const typeDefs = `
schema {
  query: Query
  mutation: Mutation
}
type Query {
  books(orderBy: BooksOrderBy = RATING_DESC): [Book]
  reviews(orderBy: ReviewsOrderBy = ID_DESC): [Review]
  book(id: ID!): Book
}
type Mutation {
  createReview(reviewInput: ReviewInput!): Review
}
input ReviewInput {
  bookId: ID!
  rating: Float!
  name: String!
  email: String!
  title: String
  comment: String
}
enum ReviewsOrderBy {
  ID_DESC
  ID_ASC
}
enum BooksOrderBy {
  RATING_DESC
  ID_DESC
}
type Book {
  id: ID!
  title: String!
  description: String!
  imageUrl(size: ImageSize = LARGE): String!
  rating: Float
  subtitle: String
  ratingCount: Int
  authors: [Author!]
  reviews: [Review]
}
enum ImageSize {
  SMALL, LARGE
}
type Author {
  id: ID!
  name: String!
}
type Review {
  id: ID!
  rating: Int
  title: String
  comment: String
  book: Book
  user: User
}
type User {
  id: ID!
  name: String
  imageUrl(size: Int = 50): String
}
`
export default typeDefs;