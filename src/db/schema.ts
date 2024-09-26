'use strict';
import { sql } from 'drizzle-orm';
import {
	uuid,
	text,
	integer,
	timestamp,
	pgTable,
	pgView,
} from 'drizzle-orm/pg-core';

type TransactionType = 'deposit' | 'withdraw';

export const accountsTable = pgTable('accounts', {
	accountId: uuid('account_id')
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
});

export const transactionsTable = pgTable('transactions', {
	id: uuid('id')
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	type: text('type').$type<TransactionType>().notNull(),
	amount: integer('amount').notNull(),
	accountId: uuid('account_id').references(() => accountsTable.accountId, {
		onDelete: 'set null',
	}),
	timestamp: timestamp('timestamp').notNull(),
});

export const accountsWithBalanceView = pgView('accounts_with_balance').as(
	(qb) => {
		return qb
			.select({
				accountId: accountsTable.accountId,
				balance: sql<number>`COALESCE(SUM(CASE
        WHEN ${transactionsTable.type} = 'deposit' THEN ${transactionsTable.amount}
        ELSE -${transactionsTable.amount}
      END), 0)`.as('balance'),
			})
			.from(accountsTable)
			.leftJoin(
				transactionsTable,
				sql`${accountsTable.accountId} = ${transactionsTable.accountId}`
			)
			.groupBy(accountsTable.accountId);
	}
);

export type InsertTransaction = typeof transactionsTable.$inferInsert;
export type SelectTransaction = typeof transactionsTable.$inferSelect;
