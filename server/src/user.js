import query from "./db";
import {groupBy, map} from 'ramda'
import DataLoader from "dataloader";

export const findUsersByIds = async (ids) => {
  const sql = `
  select *
  from hb.user
  where hb.user.id = ANY($1)
  `
  const params = [ids]

  try {
    const result = await query(sql, params);
    const rowsById = groupBy(user => user.id, result.rows);
    return map(id => rowsById[id] ? rowsById[id][0] : null, ids)
  } catch (e) {
    console.log(e)
    throw e;
  }
}
export const findUsersByIdsLoader = () => 
  new DataLoader(findUsersByIds)