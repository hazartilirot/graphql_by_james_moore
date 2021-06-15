import query from './db';
import {groupBy, map, pathOr} from 'ramda'
import DataLoader from "dataloader";
import axios from "axios";
import stripTags from "striptags";

export const searchBook = async (query) => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
  try {
    const result = await axios.get(url)
    const items = pathOr([], ['data', 'items'], result);
    return map(book => ({id: book.id, ...book.volumeInfo}) , items);
  } catch (e) {
    console.log(e)
    throw e;
  }
}

export const findBooksByIds = async (ids) => {
  const sql = `
  select *
  from hb.book
  where hb.book.id = ANY($1)
  `
  const params = [ids]

  try {
    const result = await query(sql, params);
    const rowsById = groupBy(book => book.id, result.rows)
    return map(id => rowsById[id] ? rowsById[id][0] : null, ids)
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export const findBooksByIdsLoader = () =>
  new DataLoader(findBooksByIds)

const ORDER_BY = {
  ID_DESC: 'id desc',
  RATING_DESC: 'rating desc'
}
export const allBooks = async (args) => {
  const orderBy = ORDER_BY[args.orderBy]
  
  const sql = `select * from hb.book order by ${orderBy}`;
  
  try {
    const result = await query(sql);
    return result.rows;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export const imageUrl = (size, id) =>
  `http://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=${size === 'SMALL' ? 5 : 1}&source=gbs_api`

export const createBook = async (googleBookId) => {
  const book = await findBookByGoogleId(googleBookId);
/*if a property doesn't have a value there would be a substitute (by default)*/
  const {
    title = '', 
    subtitle = '', 
    description = '', 
    authors = [], 
    pageCount = 0,
  } = book
  
  const sql = `select * from hb.create_book($1, $2, $3, $4, $5, $6)`
  
  const params = [
    googleBookId,
    stripTags(title), 
    stripTags(subtitle), 
    stripTags(description), 
    authors, 
    pageCount
  ]
  
  try {
    const result = await query(sql, params);
    return result.rows[0]
  } catch (e) {
    console.log(e);
    throw e;
  }
}

const findBookByGoogleId = async (googleBookId) => {
  const url = `https://www.googleapis.com/books/v1/volumes/${googleBookId}`
  try {
    const result = await axios(url)
    const book = pathOr({}, ['data'], result);
    return {...book, ...book.volumeInfo}
  } catch (e) {
    console.log(e)
    throw e;
  }
}