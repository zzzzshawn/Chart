import html2canvas, { Options } from "html2canvas";


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

            // color for user chat
            element.querySelectorAll('[data-message-author-role="user"]').forEach((k)=> {
                const j = k as HTMLElement;
                j.style.backgroundColor = "white";
            })
        },
        ignoreElements: (element) => element.classList.contains('top-0'), // igonore the navbar
        scrollX: 0,
        scrollY: 0,
        scale: 0.2, // adjust bluryness
        backgroundColor: backgroundColor
    };
    return html2canvas(elementToRender, renderOptions);
}