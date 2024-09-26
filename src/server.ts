import express from 'express';

import { createTransaction } from './db/queries/transactions.js';
import { getAccountBalance } from './db/queries/accounts.js';
import { InsertTransaction } from './db/schema.js';

interface Transaction {
	id: string;
	type: 'deposit' | 'withdraw_request' | 'withdraw';
	amount: number;
	accountId: string;
	timestamp: string;
}

interface AccountBalance {
	accountId: string;
	balance: number;
}

const app = express();

app.use(express.json());

app.post('/transaction', async (req, res) => {
	const transaction: Transaction = req.body;
	const formatted: InsertTransaction = {
		...req.body,
		timestamp: new Date(transaction.timestamp),
	};

	try {
		switch (transaction.type) {
			case 'deposit': {
				await createTransaction(formatted);

				res.status(200).end();

				break;
			}

			case 'withdraw_request': {
				const accountBalance = await getAccountBalance(
					transaction.accountId
				);

				if (accountBalance.balance >= transaction.amount) {
					res.status(201).end();
				} else {
					res.status(402).end();
				}

				break;
			}

			case 'withdraw': {
				const accountBalance = await getAccountBalance(
					transaction.accountId
				);

				if (accountBalance.balance - transaction.amount < 0) {
					return res.status(400).json({
						message: 'Insufficient funds for transaction',
						transaction,
					});
				}

				await createTransaction(formatted);

				res.status(200).end();

				break;
			}

			default:
				res.status(400).json({
					message: 'Invalid transaction type',
					transaction,
				});
		}
	} catch (e) {
		console.error(e);

		res.status(500).json({
			message: 'Internal server error',
		});
	}
});

app.get('/account/:accountId', async (req, res) => {
	const { accountId } = req.params;

	try {
		const accountBalance = await getAccountBalance(accountId);

		res.status(200).json({ accountId, balance: accountBalance.balance });
	} catch (e) {
		console.error(e);

		res.status(500).json({
			message: 'Internal server error',
		});
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

export default app;
