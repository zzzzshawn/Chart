import html2canvas, { Options } from "html2canvas";

export const generateMapCanvas = (elementToRender: HTMLElement): Promise<HTMLCanvasElement> => {
    
    const backgroundColor = getComputedStyle(document.body).backgroundColor; 

    const renderOptions: Partial<Options> = {
        onclone: (_, element) => {
            let chatWidth = 0;
            element.querySelectorAll(".mx-auto").forEach((k)=> {
                const j = k as HTMLElement;
                j.style.marginLeft = "0px";
                j.style.marginRight = "0px";
                chatWidth = j.offsetWidth;
            });
            element.style.width = `${chatWidth}px`;
            if(chatWidth === 0){
                element.style.width = "fit-content";
            }
        },
        ignoreElements: (element) => element.classList.contains('top-0'),
        scrollX: 0,
        scrollY: 0,
        scale: 0.2,
        backgroundColor: backgroundColor
    };
    return html2canvas(elementToRender, renderOptions);
}

export const queryChatContainer = (): HTMLElement | null => {
    let firstChat: HTMLElement | null = null;
    let chatContainer: HTMLElement | null = null;
    firstChat = document.querySelector('[data-testid^="conversation-turn-"]');
    if(firstChat){
        chatContainer = firstChat.parentElement;
    }

    return chatContainer
}

export const queryChatScrollContainer = (): HTMLElement | null  => {
    let chatContainer: HTMLElement | null = null;
    let scrollContainer: HTMLElement | null = null;
    chatContainer = queryChatContainer();
    if(chatContainer){
        scrollContainer = chatContainer.parentElement;
    }

    return scrollContainer;
}
