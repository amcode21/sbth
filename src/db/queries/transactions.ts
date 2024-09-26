'use strict';

import db from '../index.js';
import { InsertTransaction, transactionsTable } from '../schema.js';

import takeUniqueOrThrow from '../../util/takeUniqueOrThrow.js';

export async function createTransaction(data: InsertTransaction) {
	return db
		.insert(transactionsTable)
		.values(data)
		.returning()
		.then(takeUniqueOrThrow);
}
