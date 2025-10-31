export class SessionConfig {
	constructor(
		public persoLiveApiServerUrl: string,
		public sessionId: string,
		public chatbotWidth: number,
		public chatbotHeight: number,
		public enableVoiceChat: boolean,
		public clientTools: Array<PersoAILiveChatSDK.ChatTool>
	) {}
}

export async function createSession(
	liveChatConfig: SessionConfig
) {
	return await PersoAILiveChatSDK.createSession(
		liveChatConfig.persoLiveApiServerUrl,
		liveChatConfig.sessionId,
		liveChatConfig.chatbotWidth,
		liveChatConfig.chatbotHeight,
		liveChatConfig.enableVoiceChat,
		liveChatConfig.clientTools
	);
}