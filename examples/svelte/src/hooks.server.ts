import { liveChatApiServerUrl, liveChatApiKey } from "$lib/constant";

// Enter your configuration.
export const config = {
	llm: '',
	tts: '',
	stt: '',
	modelStyle: '',
	prompt: '',
	document: '',
	backgroundImage: '',
	mcpServers: [],
	introMessage: '',
	padding_left: 0.0, // -1.0 ~ 1.0
	padding_top: 0.0, // 0.0 ~ 1.0
	padding_height: 1.0 // 0.0 ~ 5.0
}
// ex
/*
const allConfig = await getAllConfig();
export const config = {
	llm: allConfig.llms[0].name,
	tts: allConfig.ttss[0].name,
	stt: allConfig.stts[0].name,
	modelStyle: allConfig.modelStyles[0].name,
	prompt: allConfig.prompts[0].prompt_id,
	document: allConfig.documents.length > 0 ? allConfig.documents[0].document_id : null,
	backgroundImage: allConfig.backgroundImages.length > 0 ? allConfig.backgroundImages[0].backgroundimage_id : null,
	mcpServers: (allConfig.mcpServers as Array<any>).map((value) => { return value.mcpserver_id }),
	introMessage: allConfig.prompts[0].intro_message,
	padding_left: 0.0,
	padding_top: 0.15,
	padding_height: 1.0
}
*/

async function getAllConfig() {
	const llms = await getLLMs(liveChatApiServerUrl, liveChatApiKey);
	const ttss = await getTTSs(liveChatApiServerUrl, liveChatApiKey);
	const stts = await getSTTs(liveChatApiServerUrl, liveChatApiKey);
	const modelStyles = await getModelStyles(liveChatApiServerUrl, liveChatApiKey);
	const backgroundImages = await getBackgroundImages(liveChatApiServerUrl, liveChatApiKey);
	const mcpServers = await getMcpServers(liveChatApiServerUrl, liveChatApiKey);
	const prompts = await getPrompts(liveChatApiServerUrl, liveChatApiKey);
	const documents = await getDocuments(liveChatApiServerUrl, liveChatApiKey);

	return {
		llms,
		ttss,
		stts,
		modelStyles,
		mcpServers,
		prompts,
		documents,
		backgroundImages
	}
}

/**
 * @param apiServer Perso AI Live Chat API Server
 * @param apiKey Perso AI Live Chat API Key
 * @returns JSON
 * [
 *   {
 *     "name": string
 *   }
 * ]
 */
async function getLLMs(apiServer: string, apiKey: string) {
	const response = await fetch(
		`${apiServer}/api/v1/settings/llm_type/`,
		{
			headers: {
				'PersoLive-APIKey': apiKey
			},
			method: 'GET'
		}
	);

	return await response.json();
}

/**
 * @param apiServer Perso AI Live Chat API Server
 * @param apiKey Perso AI Live Chat API Key
 * @returns JSON
 * [
 *   {
 *     "name": string,
 *     "service": string,
 *     "speaker": string
 *   }
 * ]
 */
async function getTTSs(apiServer: string, apiKey: string) {
	const response = await fetch(
		`${apiServer}/api/v1/settings/tts_type/`,
		{
			headers: {
				'PersoLive-APIKey': apiKey
			},
			method: 'GET'
		}
	)

	return await response.json();
}

/**
 * @param apiServer Perso AI Live Chat API Server
 * @param apiKey Perso AI Live Chat API Key
 * @returns JSON
 * [
 *   {
 *     "name": string,
 *     "service": string,
 *     "options": string
 *   }
 * ]
 */
async function getSTTs(apiServer: string, apiKey: string) {
	const response = await fetch(
		`${apiServer}/api/v1/settings/stt_type/`,
		{
			headers: {
				'PersoLive-APIKey': apiKey
			},
			method: 'GET'
		}
	)

	return await response.json();
}

/**
 * @param apiServer Perso AI Live Chat API Server
 * @param apiKey Perso AI Live Chat API Key
 * @returns JSON
 * [
 *   {
 *     "name": string,
 *     "model": string,
 *     "style": string
 *   }
 * ]
 */
async function getModelStyles(apiServer: string, apiKey: string) {
	const response = await fetch(
		`${apiServer}/api/v1/settings/modelstyle/`,
		{
			headers: {
				'PersoLive-APIKey': apiKey
			},
			method: 'GET'
		}
	)

	return await response.json();
}

/**
 * @param apiServer Perso AI Live Chat API Server
 * @param apiKey Perso AI Live Chat API Key
 * @returns JSON
 * [
 *   {
 *     "backgroundimage_id": string,
 *     "title": string,
 *     "image": string
 *     "created_at": string // ex) "2024-05-02T09:05:55.395Z"
 *   }
 * ]
 */
async function getBackgroundImages(apiServer: string, apiKey: string) {
	const response = await fetch(
		`${apiServer}/api/v1/background_image/`,
		{
			headers: {
				'PersoLive-APIKey': apiKey
			},
			method: 'GET'
		}
	)

	return await response.json();
}

/**
 * @param apiServer Perso AI Live Chat API Server
 * @param apiKey Perso AI Live Chat API Key
 * @returns JSON
 * [
 *   {
 *     "mcpserver_id": string,
 *     "name": string,
 *     "url": string
 *     "description": string"
 *   }
 * ]
 */
async function getMcpServers(apiServer: string, apiKey: string) {
	const response = await fetch(
		`${apiServer}/api/v1/settings/mcp_type/`,
		{
			headers: {
				'PersoLive-APIKey': apiKey
			},
			method: 'GET'
		}
	)

	return await response.json();
}

/**
 * @param apiServer Perso AI Live Chat API Server
 * @param apiKey Perso AI Live Chat API Key
 * @returns JSON
 * [
 *   {
 *     "name": string,
 *     "description": string,
 *     "prompt_id": string,
 *     "system_prompt": string,
 *     "require_document": boolean,
 *     "intro_message": string
 *   }
 * ]
 */
async function getPrompts(apiServer: string, apiKey: string) {
	const response = await fetch(
		`${apiServer}/api/v1/prompt/`,
		{
			headers: {
				'PersoLive-APIKey': apiKey
			},
			method: 'GET'
		}
	)

	return await response.json();
}

/**
 * @param apiServer Perso AI Live Chat API Server
 * @param apiKey Perso AI Live Chat API Key
 * @returns JSON
 * [
 *   {
 *     "document_id": string,
 *     "title": string,
 *     "description": string,
 *     "search_count": number,,
 *     "processed": boolean,
 *     "created_at": string, // ex) "2024-05-02T09:05:55.395Z",
 *     "updated_at": string // ex) "2024-05-02T09:05:55.395Z"
 *   }
 * ]
 */
async function getDocuments(apiServer: string, apiKey: string) {
	const response = await fetch(
		`${apiServer}/api/v1/document/`,
		{
			headers: {
				'PersoLive-APIKey': apiKey
			},
			method: 'GET'
		}
	)

	return await response.json();
}