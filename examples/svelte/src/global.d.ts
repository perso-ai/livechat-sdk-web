declare namespace PersoAILiveChat {
    declare function createSession(
        apiServer: string,
		sessionId: string,
		width: number,
		height: number,
		enableVoiceChat: boolean,
		clientTools: Array<ChatTool>
    ): Promise<Session>

    declare function getSessionInfo(
        apiServer: string,
		sessionId: string
    ): Promise<any>

    declare interface Session {
        processChat(message: string): Promise<void>;
        processTTSTF(message: string);
        startVoiceChat();
        stopVoiceChat();
        changeSize(width: number, height: number);
        clearBuffer(): Promise<void>;
        setSrc(videoElement: HTMLVideoElement);
        getLocalStream(): MediaStream;
        getRemoteStream(): MediaStream;
        stopSession();
        onClose(callback: (manualClosed: boolean) => void): () => void;
        subscribeChatStates(callback: (chatStates: Set<PersoAILiveChat.ChatState>) => void): () => void;
        subscribeChatLog(callback: (chatLog: Array<PersoAILiveChat.Chat>) => void): () => void;
        setSttResultCallback(callback: (text: string) => void): () => void;
        setErrorHandler(callback: (error: Error) => void): () => void;
        getSessionId(): string;
    }

    declare interface Chat {
        text: string;
        isUser: boolean;
        timestamp: Date;
    }

    declare enum ChatState {
        RECORDING = "RECORDING",
        LLM = "LLM",
        ANALYZING = "ANALYZING",
        SPEAKING = "SPEAKING"
    }

    declare class ChatTool {
        constructor(
            name: string,
            description: string,
            parameters: object,
            call: (arg: any) => object | Promise<object>,
            executeOnly: boolean = false
        );
        name: string;
        description: string;
        parameters: object;
        call: (arg: any) => object | Promise<object>;
        executeOnly: boolean;
    }

    declare class ApiError extends Error {
        private constructor();
        errorCode: number;
        code: string;
        detail: string;
        attr?: string;
    }

    declare class LLMError extends Error {
        private constructor();
        underlyingError: ApiError | LLMStreamingResponseError;
    }

    declare class LLMStreamingResponseError extends Error {
        private constructor();
        description: string;
    }
}

declare global {
  const PersoAILiveChat: typeof PersoAILiveChat;
}