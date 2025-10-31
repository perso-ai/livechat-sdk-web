<svelte:head>
    <style>
        p.title {
            font-size: 36px;
            font-weight: 800;
            margin-top: 38px;
            margin-bottom: 0px;
            line-height: 49px;
        }

        button.session {
            width: 380px;
            height: 56px;
            background-color: #644AFF;
            font-weight: 700;
            font-size: 16px;
            color: white;
            border-style: none;
            border-radius: 4px;
            margin-top: 24px;
        }
        button.session:disabled {
            background-color: #acabb2;
        }
        .input-method-container {
            display: flex;
            align-items: center;
            border: 1px;
            border-color: #979797;
            border-width: 1px;
            border-style: solid;
            margin-top: 18px;
            width: 1034px;
            height: 95px;
        }
        .transparent {
            background-color: transparent;
        }
        body {
            padding: 0px;
            margin: 0px;
        }
    </style>
</svelte:head>

<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
	import Video from './Video.svelte';
	import ChatLog from './ChatLog.svelte';
	import ChatStates from './ChatStates.svelte';
	import ChatInput from './ChatInput.svelte';
	import VoiceChat from './VoiceChat.svelte';
	import TTSTFInput from './TTSTFInput.svelte';
	import { type LiveChatConfig } from '$lib/livechat';

    export let liveChatConfig: LiveChatConfig;

    let session: PersoAILiveChat.Session;
    let unsubscribes: (() => void)[] = [];

    let chatStates: Set<PersoAILiveChat.ChatState> = new Set(); // 0: available 1: recording 2: analyzing 3: AI speaking
    let sessionState: number = 0; // 0: Initial state(or closed) 1: starting 2: started
    let sessionButton: HTMLButtonElement;

    let videoWidth: number;
    let videoHeight: number;

    let chatLog: Array<PersoAILiveChat.Chat> = [];

    let available: boolean = false;
    let processing: boolean = false;
    let recording: boolean = false;
    let chatStateDescriptionText: string = '';

    // If 'chatStates' has no ChatState, it is in the Available state
    $: available = chatStates.size === 0;

    // It is in a state where a response is being generated (LLM),
    // being converted into video (ANALYZING),
    // or the AI human is speaking (SPEAKING).
    $: processing = chatStates.has(PersoAILiveChat.ChatState.LLM) ||
        chatStates.has(PersoAILiveChat.ChatState.ANALYZING) ||
        chatStates.has(PersoAILiveChat.ChatState.SPEAKING);

    $: recording = chatStates.has(PersoAILiveChat.ChatState.RECORDING);

    $: resetChatStateDescriptionText(chatStates);

	onMount(async () => {
        videoWidth = liveChatConfig.chatbotWidth / (liveChatConfig.chatbotHeight / 540);
        videoHeight = 540;

        sessionState = 0;

        try {
            session = await PersoAILiveChat.createSession(
                liveChatConfig.persoLiveApiServerUrl,
                liveChatConfig.sessionId,
                liveChatConfig.chatbotWidth,
                liveChatConfig.chatbotHeight,
                liveChatConfig.enableVoiceChat,
                liveChatConfig.clientTools
            );

            sessionState = 2;
        } catch (e) {
            alert(e);
            sessionState = 0;
            return;
        }

        const unsubscribeChatLog = session.subscribeChatLog((log: Array<PersoAILiveChat.Chat>) => {
            chatLog = log;
        });
        const unsubscribeChatStates = session.subscribeChatStates((states) => {
            chatStates = states;
        });
        // this.removeSttResultCallback = session.setSttResultCallback((sttResult) => {
        //     if (sttResult !== '') {
        //         session.processChat(sttResult);
        //     } else {
        //         alert('Your voice was not recognized.');
        //     }
        // });
        const removeErrorHandler = session.setErrorHandler((error) => {
            if (error instanceof PersoAILiveChat.LLMError) {
                if (error.underlyingError instanceof PersoAILiveChat.ApiError) {
                    alert(error.underlyingError);
                } else if (error.underlyingError instanceof PersoAILiveChat.LLMStreamingResponseError) {
                    alert(error.underlyingError.description);
                }
            }
        });
        const removeOnClose = session.onClose((manualClosed) => {
            if (!manualClosed) {
                setTimeout(() => {
                    PersoAILiveChat.getSessionInfo(
                        liveChatConfig.persoLiveApiServerUrl, liveChatConfig.sessionId
                    )
                        .then((response: any) => {
                            alert(response.termination_reason);
                        });
                }, 500);
            }

            sessionState = 0;
        });
        unsubscribes.push(unsubscribeChatLog, unsubscribeChatStates,/* removeSttResultCallback,*/ removeErrorHandler, removeOnClose);

        if (liveChatConfig.introMessage !== null && liveChatConfig.introMessage.length > 0) {
            setTimeout(() => {
                session.processTTSTF(liveChatConfig.introMessage);
            }, 1000);
        }
	});

    onDestroy(() => {
        return () => {
            unsubscribes.forEach((unsubscribe) => {
                unsubscribe();
            })
        }
    });

    function onStopSessionClicked() {
        session.stopSession();
    }

    function onStopSpeechClicked() {
        session.clearBuffer();
    }

    function onMessageSubmit(message: string) {
        session.processChat(message);
    }

    function onTtstfMessageSubmit(message: string) {
        session.processTTSTF(message);
    }

    function onVoiceChatClicked() {
        if (available) {
            session.startVoiceChat();
        } else {
            session.stopVoiceChat();
        }
    }

    function onVideoReady(video: HTMLVideoElement) {
        session.setSrc(video);
    }

    async function resetChatStateDescriptionText(chatStates: Set<PersoAILiveChat.ChatState>) {
        const chatStatesTextArr = [];
        if (available) {
            chatStateDescriptionText = 'Available';
            return;
        }
        if (chatStates.has(PersoAILiveChat.ChatState.RECORDING)) {
            chatStatesTextArr.push('Recording');
        }
        if (chatStates.has(PersoAILiveChat.ChatState.LLM)) {
            chatStatesTextArr.push('LLM');
        }
        if (chatStates.has(PersoAILiveChat.ChatState.ANALYZING)) {
            chatStatesTextArr.push('Analyzing');
        }
        if (chatStates.has(PersoAILiveChat.ChatState.SPEAKING)) {
            chatStatesTextArr.push('AI Speaking');
        }

        chatStateDescriptionText = chatStatesTextArr.join(' / ');
    }
</script>

<div style='display: block; padding-left: 47px;'>
    <p class='title'>Perso AI Live Chat SDK demo</p>
	<div style='display: flex; margin-top: 84px;'>
        {#if session != null}
        <Video width={videoWidth} height={videoHeight} onVideoReady={onVideoReady} />
        {:else}
        <div class='border1px' style='display:flex; width:{videoWidth}px; height:{videoHeight}px;'></div>
        {/if}
        <ChatLog chatLog={chatLog} />
	</div>
	<div style='display: block;'>
		<button
            bind:this={sessionButton}
            class='session'
            on:click={sessionState === 2 ? onStopSessionClicked : null}
            disabled={sessionState === 2 ? false : true}
        >
            {sessionState === 2 ? 'STOP' : 'START'}
        </button>
	</div>
    <ChatStates
        enableStopSpeech={processing ? true : false}
        chatStateDescriptionText={chatStateDescriptionText}
        onStopSpeechClicked={onStopSpeechClicked}
    />
    <ChatInput
        enableSendButton={available ? true : false}
        onMessageSubmit={onMessageSubmit}
    />
    {#if liveChatConfig.enableVoiceChat}
    <VoiceChat
        enableButton={(available || recording) ? true : false}
        buttonText={recording ? 'Stop' : 'Start'}
        onVoiceChatClicked={onVoiceChatClicked}
    />
    {/if}
    <TTSTFInput
        enableSendButton={available ? true : false}
        onMessageSubmit={onTtstfMessageSubmit}
    />
    <br/>
</div>