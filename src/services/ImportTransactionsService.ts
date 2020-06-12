import { getCustomRepository, getRepository, In } from 'typeorm'
import csvParse from 'csv-parse' //manipular o arquivo csv
import fs from 'fs' //File System ajuda abrir, ler o arquivo csv

import Category from '../models/Category'
import Transaction from '../models/Transaction'
import TransactionsRepository from '../repositories/TransactionsRepository'

interface CSVTransaction {
  title: string
  type: 'income' | 'outcome'
  value: number
  category: string
}

//execute passaremos o path do arquivo vir parâmetro
class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const categoriesRepository = getRepository(Category)
    const transactionsRepository = getCustomRepository(TransactionsRepository)

//stream que lerá os arquivos csv
    const contactsReadStream = fs.createReadStream(filePath)

//instánciando csvParse que é que terá vários métodos
//from_line - entende que a primeira linha a ser lida é a linha 2
//Omite a linha 1 que é o título dos campos csv
    const parsers = csvParse({
      from_line: 2,
    })

//pipe = lerá as linhas conforme forem disponíveis
//o que no caso será a partir da linha 2
    const parseCSV = contactsReadStream.pipe(parsers)

    const categories: string[] = []
    const transactions: CSVTransaction[] = []

//trantando os espaços dentro do arquivo csv
    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim()
      )

//verificando se cada linha do csv  chega corretamente - caterogy não é obrigatório
//caso não tenha vindo as 3 linhs do csv, não será inserido no DB
      if ( !title || !type || !value ) return

/*cenário inadequado- ler as linhas cada arquivo csv e inserir cada campo no DB, mas
desta forma está abrindo e fechando uma conexão o tempo todo no Banco de dados */

/*bulk insert - mapeio todo o arquivo e salvo nas variáveis categories[] e
transactions [] para depois salvar no DB de uma vez só as 3 linhas do csv
desta forma se abre e fecha a conexão com DB de uma só vez, melhorando o
tempo de processamento */

//bulk insert - push para category = []
      categories.push(category)

//bulk insert - push para transactions = []
      transactions.push({ title, type, value, category })
    })

//Promise se faz necessário pois o parserCSV é assícrono
    await new Promise(resolve => parseCSV.on('end', resolve))

//bulk insert - método "In" do typeorm verifica se a categorias que estão sendo
//buscadas existem no banco de dados de uma vez só.
const existemtCategories = await categoriesRepository.find({
  where: {
    title: In(categories),
  }
})

//método In - mapear no DB se as categórias existem
const existemtCategoriesTitles = existemtCategories.map(
  (category: Category) => category.title
)

//Descobrindo quais as categorias que não estão no DB.
//Não existindo, inclui-las.
//Tirar as categorias duplicadas = mapeando pelo index e verem os que são iguais
const addCategoryTitles = categories
  .filter(category => !existemtCategoriesTitles.includes(category))
  .filter((value, index, self) => self.indexOf(value) === index)

//Instância - Inserindo as categorias que não existem no DB
const newCategories = categoriesRepository.create(
  addCategoryTitles.map(title => ({
    title,
  })),
)

await categoriesRepository.save(newCategories)

//pegando o return "newCategories" inseridas e as
//categories que já existem
const finalCategories = [...newCategories, ...existemtCategories]

//Para cada transaction, retorna um novo Object e
//find - mapear as newCategories com as existemtCategories no DB
const createdTransactions = transactionsRepository.create(
  transactions.map(transaction => ({
      title: transaction.title,
      type: transaction.type,
      value: transaction.value,
      category: finalCategories.find(
        category => category.title === transaction.category
      )
    }))
)

    await transactionsRepository.save(createdTransactions)

    //excluindo o arquivo do tmp
    await fs.promises.unlink(filePath)

    return createdTransactions

    console.log(categories)
    console.log(transactions)
    console.log(addCategoryTitles)
    console.log(existemtCategories)
    console.log(existemtCategoriesTitles)
  }
}

export default ImportTransactionsService;
