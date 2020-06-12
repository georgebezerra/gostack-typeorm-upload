import { getCustomRepository, getRepository } from 'typeorm'

import AppError from '../errors/AppError'
import Category from '../models/Category'
import Transaction from '../models/Transaction'
import TransactionsRepository from '../repositories/TransactionsRepository'

interface Request{
  title: string,
  value: number,
  category: string,
  type: 'income' | 'outcome'
}

class CreateTransactionService {
  public async execute({ title, value, type, category } : Request): Promise<Transaction> {

    const categoryRepository = getRepository(Category)
    const transactionsRepository = getCustomRepository(TransactionsRepository)

    const { total } = await transactionsRepository.getBalance()

    if( type === 'outcome' && total < value ){
      throw new AppError('You do not have enought balance')
    }

//Verificar se a categoria já existe - "let" ao inveś de "const" é de propósito, para ser reescrito
    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    })

//Reescrendo o let, se a categoria não existe, crio. Com "const" não seria possível.
//Estou sobrescrevendo, verificando com o ID da categoria que será retornado com o findOne
//Se a category existe ou não. Existe? Buscar no DB e usar o ID que foi retornado
    if (!transactionCategory){
      transactionCategory = categoryRepository.create({
        title: category,
      })

      await categoryRepository.save(transactionCategory)
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    })

    await transactionsRepository.save(transaction)

    return transaction
  }
}

export default CreateTransactionService;
