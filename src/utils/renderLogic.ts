import html2canvas, { Options } from "html2canvas";

// generate the map
export const generateMapCanvas = (elementToRender: HTMLElement): Promise<HTMLCanvasElement> => {
    
    // gets the bg color of the site
    const backgroundColor = getComputedStyle(document.body).backgroundColor; 

    // create the canvas 
    const renderOptions: Partial<Options> = {
        // onclone: html2canvas fn: modifies DOM before it is rendered on canvas
        onclone: (_, element) => {
            // Remove horizontal margin
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
        ignoreElements: (element) => element.classList.contains('top-0'), // igonore the navbar
        scrollX: 0,
        scrollY: 0,
        scale: 0.2, // adjust bluryness
        backgroundColor: backgroundColor
    };
    return html2canvas(elementToRender, renderOptions);
}

// return the chat container
export const queryChatContainer = (): HTMLElement | null => {
    // find first chat then return the parent of it, basically the whole chat container
    let firstChat: HTMLElement | null = null;
    let chatContainer: HTMLElement | null = null;
    firstChat = document.querySelector('[data-testid^="conversation-turn-"]');
    if(firstChat){
        chatContainer = firstChat.parentElement;
    }

    return chatContainer
}

// return the parent of chat container ^^^
export const queryChatScrollContainer = (): HTMLElement | null  => {
    let chatContainer: HTMLElement | null = null;
    let scrollContainer: HTMLElement | null = null;
    chatContainer = queryChatContainer();
    if(chatContainer){
        scrollContainer = chatContainer.parentElement;
    }

    return scrollContainer;
}

// // return all chat
// export const queryAllChatElements = (): HTMLElement[] => {
//     const allChat: HTMLElement[] = [...document.querySelectorAll('[data-testid^="conversation-turn-"]')] as HTMLElement[]

//     return allChat
// }

// // return 1st child of chatContainer or null
// export const queryNavElement = (): HTMLElement | null => {
//     const chatContainer = queryChatContainer();
//     if(!chatContainer || chatContainer.childNodes.length === 0) return null;

//     return chatContainer.childNodes[0] as HTMLElement
// }