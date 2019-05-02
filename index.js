const readline = require('readline-sync')
const robots = {
	//userInput: require('./robots/user-input.js')
	text: require('./robots/text.js')
}
// Função que irá agrupar todas as opções
async function start() {
	// objeto que irá guardar todo o conteúdo
	const content = {
		maximumSentences: 7
	}

	//Termo
	content.searchTerm = askAndReturnSearchTerm()
	//Prefixo
	content.prefix = askAndReturnPrefix()

	//robots.userInput(content)
	await robots.text(content)

	function askAndReturnSearchTerm(){
		//return 'EXEMPLO DE TERMO'
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
	console.log(JSON.stringify(content, null, 4))
}

start()