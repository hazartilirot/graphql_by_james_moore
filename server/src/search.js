import query from "./db";
import {map} from "ramda";

const search = async (term) => {
  const books = await searchBooks(term);
  const users = await searchUser(term);
  const authors = await searchAuthors(term);
  const reviews = await searchReviews(term);
  return [...books, ...users, ...authors, ...reviews]
}

const fetchingData = async (__type, sql, params) => {
  try {
    const result = await query(sql, params)
    return map(obj => ({...obj, __type}), result.rows)
  } catch (e) {
    console.log(e)
    throw e;
  }
} 

/*the tokens field is tsvector type in database. tsvector type represents
a doc in a form optimized for text search; 
 the tsquery type similarly represents a text query*/
const searchBooks = async (term) => {
  const sql = `
    select * from hb.book
    where tokens @@ to_tsquery($1) 
  `
  const params = [term]
  return fetchingData('Book', sql, params)
}
const searchUser = async (term) => {
  const sql = `
    select * from hb.user
    where tokens @@ to_tsquery($1) 
  `
  const params = [term]
  
  return fetchingData('User', sql, params)
}
const searchReviews = async (term) => {
  const sql = `
    select * from hb.review
    where tokens @@ to_tsquery($1) 
  `
  const params = [term]
  return fetchingData('Review', sql, params)
}
const searchAuthors = async (term) => {
  const sql = `
    select * from hb.author
    where tokens @@ to_tsquery($1) 
  `
  const params = [term]
  return fetchingData('Author', sql, params)
}

export default search;