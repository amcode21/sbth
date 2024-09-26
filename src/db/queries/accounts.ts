'use strict';

import { sql, eq } from 'drizzle-orm';

import db from '../index.js';
import { accountsTable, transactionsTable } from '../schema.js';

import takeUniqueOrThrow from '../../util/takeUniqueOrThrow.js';

export async function getAccountById(accountId: string) {
	return await db
		.select()
		.from(accountsTable)
		.where(eq(accountsTable.accountId, accountId))
		.then(takeUniqueOrThrow);
}

export async function getAccountBalance(accountId: string) {
	return await db
		.select({
			balance: sql<number>`
          COALESCE(SUM(
            CASE 
              WHEN ${transactionsTable.type} = 'deposit' THEN ${transactionsTable.amount}
              ELSE -${transactionsTable.amount}
            END
          ), 0)`.as('balance'),
		})
		.from(transactionsTable)
		.where(eq(transactionsTable.accountId, accountId))
		.then(takeUniqueOrThrow);
}
