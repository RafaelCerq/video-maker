const readline = require('readline-sync')
const state = require('./state.js')

function robot() {
	// objeto que irá guardar todo o conteúdo
	const content = {
		maximumSentences: 7
	}

	content.searchTerm = askAndReturnSearchTerm() //Termo
	content.prefix = askAndReturnPrefix() //Prefixo
	state.save(content) //Utilizar robo para guardar informações

	//robots.userInput(content)
	

	function askAndReturnSearchTerm(){
		//usar readline-sync para pegar input do isuario
		//question: método da biblioteca readline-sync que espera uma string
		return readline.question('Informe um termo para busca na Wikipedia: ')
	}

	function askAndReturnPrefix(){
		const prefixes = ['Quem e', 'O que e', 'A historia de']
		//KeyInSelect: método que retorna uma chave com resultado selecionado pelo usuario, esperando uma string ou array
		const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Escolha uma opção: ')
		const selectedPrefixText = prefixes[selectedPrefixIndex]

		//console.log(selectedPrefixText) 
		return selectedPrefixText
	}

	//console.log(content)
	//console.log(JSON.stringify(content, null, 4))
}

module.exports = robot
