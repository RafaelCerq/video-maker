const algorithmia = require('algorithmia')
const algorithmiaApiKey =  require('../credentials/algorithmia.json').apiKey //APIKey fornecida no algorithmia
const sentenceBoundaryDetection = require('sbd')

const watsonApiKey = require('../credentials/watson-nlu.json').apikey
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js')

var nlu = new NaturalLanguageUnderstandingV1({
	iam_apikey: watsonApiKey,
	version: '2018-04-05',
	url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
})

//Função assíncrona
async function robot(content) {
	await fetchContentFromWikipedia(content)//await informa que a função é assincrona e necessita aguardar elas terminarem para dar continuidade
	sanitizeContent(content)
	breakContentIntoSentences(content)
	limitMaximumSentences(content)
	await featchKeywordsOfAllSentences(content)
	
	async function fetchContentFromWikipedia(content){
		const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey) //Retorna uma instancia atenticada do algorithmia
		const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2') //Após atenticação, chama o algoritmo que deseja utilizando o método algo
		const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm) //Método pipe envia input para o algoritmo instanciado esperando uma resposta
		const wikipediaContent = wikipediaResponse.get() //faz get da resposta para a variável
		//console.log(wikipediaContent)

		content.sourceContentOriginal = wikipediaContent.content
	}

	function sanitizeContent(content) {
		const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
		const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)

		content.sourceContentSanitized = withoutDatesInParentheses	

		function removeBlankLinesAndMarkdown(text) {
			const allLines = text.split('\n')

			const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
				if (line.trim().length === 0 || line.trim().startsWith('=')) {
					return false
				}
				return true
			})
			return withoutBlankLinesAndMarkdown.join(' ')
		}
	}

	function removeDatesInParentheses(text) {
		return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, '')
	}

	function breakContentIntoSentences(content) {
		content.sentences = []

		const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
		sentences.forEach((sentence) => {
			content.sentences.push({
				text: sentence,
				keywords: [],
				images: []
			})
		})
	}

	function limitMaximumSentences(content) {
		content.sentences = content.sentences.slice(0, content.maximumSentences)
	}

	async function featchKeywordsOfAllSentences(content) {
		for (const sentence of content.sentences) {
			sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)
		}
	}

	async function fetchWatsonAndReturnKeywords(sentence) {
		return new Promise((resolve, reject) => {
			nlu.analyze({
				text: sentence,
				features: {
					keywords: {}
				}
			}, (error, response) => {
				if (error) {
					throw error
				}

				const keywords = response.keywords.map((keyword) => {
					return keyword.text
				})

				resolve(keywords)
			})
		})
	}

}
module.exports = robot