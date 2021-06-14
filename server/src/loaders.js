import { findAuthorsByBookIdsLoader } from "./author";
import {findBooksByIdsLoader} from './book';
import {findUsersByIdsLoader} from './user';
import {findReviewsByIdsLoader} from './review'

export default () => ({
  findAuthorsByBookIdsLoader: findAuthorsByBookIdsLoader(),
  findBooksByIdsLoader: findBooksByIdsLoader(),
  findUsersByIdsLoader: findUsersByIdsLoader(),
  findReviewsByIdsLoader: findReviewsByIdsLoader()
})