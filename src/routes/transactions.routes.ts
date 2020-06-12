import { Router } from 'express';
import multer from 'multer'
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

//MULTER - Importando as configurações do upload
import uploadConfig from '../config/upload'

//MULTER - Instãnciando e passando as configurações de upload
const upload = multer(uploadConfig)

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository)

  const transactions = await transactionsRepository.find()
  const balance = await transactionsRepository.getBalance()

  return response.json({ transactions, balance })
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body

  const CreateTransaction = new CreateTransactionService()

  const transaction = await CreateTransaction.execute({
    title,
    value,
    type,
    category
  })


  return response.json(transaction)
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  const deleteTransaction = new DeleteTransactionService()

  await deleteTransaction.execute(id)

  return response.status(204).send()
});

/*MULTER - implementar o upload.single como um middleware na rota de importação
1 - route "import"
2 - chama middleware de upload.single
3 - chama função async */

transactionsRouter.post('/import',
upload.single('file'), async (request, response) => {
  const importTransactions = new ImportTransactionsService()

//Passando a variável que está dando nome ao arquivo
  const transactions = await importTransactions.execute(request.file.path)

  return response.json(transactions)
});

export default transactionsRouter;
