import { WIDGETS_BASE_URL } from "@/utils/constants";
import { Chatbot } from "@acme/db";
import Handlebars from "handlebars";
import { minify } from "terser";

export const getScript = async (chatbot: Chatbot) => {
  const code = template({ chatbot, widgetsBaseUrl: WIDGETS_BASE_URL });
  var result = await minify(code, { sourceMap: false });
  return result.code ?? "";
};

const template = Handlebars.compile(
  `
!(function() {
  function initialize() {
    const mx = {{chatbot.settings.mx}} || 0;
    const my = {{chatbot.settings.my}} || 0;
    const position = "{{chatbot.settings.position}}" || "right";

    const chatbotIcon = \`<svg width="512" height="512" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" style='width: 32px; height: 32px;'><path fill="currentColor" d="M1.5 0C.671 0 0 .67 0 1.5v8.993c0 .83.671 1.5 1.5 1.5h3.732l1.852 2.775a.5.5 0 0 0 .832 0l1.851-2.775H13.5c.829 0 1.5-.67 1.5-1.5V1.5c0-.83-.671-1.5-1.5-1.5h-12Z"/></svg>\`;

    const xIcon = \`<svg width="512" height="512" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style='width: 32px; height: 32px;'><path fill="currentColor" d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326a.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275a.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018a.751.751 0 0 1-.018-1.042L6.94 8L3.72 4.78a.75.75 0 0 1 0-1.06Z"/></svg>\`;

    const fontFamily = \`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"\`;

    const domCleanUp = () => {
      document.getElementById("sb-btn")?.remove();
      document.getElementById("sb-chatbox")?.remove();
      document.getElementById("sb-greeting-box")?.remove();
      document.getElementById("sb-styles")?.remove();
    }
    domCleanUp();

    const btnEl = document.createElement("button");
    const chatboxEl = document.createElement("iframe");
    const greetingBox = document.createElement("div");
    const overlayEl = document.createElement("div");
    const styleEl = document.createElement("style");

    styleEl.id = "sb-styles"
    styleEl.innerHTML = \`
      .chatbox-open.fullscreen-chatbox {
        overflow: hidden;
      }
      #sb-btn {
        background-color: {{chatbot.settings.primaryColor}};
        color: {{chatbot.settings.primaryForegroundColor}};
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 9999px;
        width: 64px;
        height: 64px;
        border: none;
        outline: none;
        cursor: pointer;
        transition: transform 0.25s ease 0s;
        user-select: none;
        box-sizing: border-box;
        box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 8px;
        z-index: 90;
        bottom: \${my}px;
        right: \${mx}px;
      }
      .chatbox-position-left #sb-btn {
        left: \${mx}px;
        right: none;
      }
      #sb-btn:hover {
        transform: scale(1.1);
      }
      #sb-btn:active {
        transform: scale(0.9);
      }
      .chatbox-open.fullscreen-chatbox #sb-btn {
        display: none;
      }
      #sb-chatbox {
        display: none;
        border: none;
        position: fixed;
        z-index: 999;
        box-sizing: border-box;
        height: calc(100vh - 8rem);
        width: 100%;
        max-width: 420px;
        max-height: 720px;
        border-radius: 16px;
        box-shadow: 0px 8px 32px -5px rgba(0, 0, 0, 0.15), 0 0px 1px 1px rgba(0, 0, 0, 0.1);
        bottom: \${64 + my * 2}px;
        right: \${mx}px;
      }
      .chatbox-open #sb-chatbox {
        pointer-events: auto;
        display: block;
      }
      .chatbox-position-left #sb-chatbox {
        left: \${mx}px;
        right: none;
      }
      .chatbox-open.fullscreen-chatbox #sb-chatbox {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: calc(100vw - 4rem);
        height: calc(100vh - 8rem);
        max-width: 960px;
        max-height: 100%;
      }
      #sb-overlay {
        display: none;
      }
      .chatbox-open.fullscreen-chatbox #sb-overlay {
        display: block;
        position: fixed;
        inset: 0;
        background-color: rgba(0,0,0,0.2);
        z-index: 990;
      }
      @media only screen and (max-width: 640px) {
        #sb-overlay {
          display: none !important;
        }
        .chatbox-open {
          overflow: hidden !important;
        }
        #sb-chatbox {
          inset: 0 !important;
          transform: none !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 0 !important;
          max-height: 100% !important;
          max-width: 100% !important;
          box-shadow: none !important;
        }
      }
    \`

    document.documentElement.classList.add(\`chatbox-position-\${position}\`)

    btnEl.id = "sb-btn";
    btnEl.innerHTML = chatbotIcon;

    const chatboxPath = localStorage.getItem("{{chatbot.id}}.chatbox-path");

    chatboxEl.id = "sb-chatbox";
    chatboxEl.src = chatboxPath ? "{{widgetsBaseUrl}}" + chatboxPath : "{{widgetsBaseUrl}}/c/{{chatbot.id}}";

    overlayEl.id = "sb-overlay";

    const greetingText = "{{chatbot.settings.greetingText}}";
    greetingBox.id = "sb-greeting-box";

    if(greetingText) {
      // Greeting Box styling
      greetingBox.innerText = greetingText;
      greetingBox.style.padding = "12px";
      greetingBox.style.backgroundColor = "#ffffff";
      greetingBox.style.color = "#000000";
      greetingBox.style.fontWeight = "600";
      greetingBox.style.boxShadow = "0px 8px 32px -5px rgba(0, 0, 0, 0.15), 0 0px 1px 1px rgba(0, 0, 0, 0.1)";
      greetingBox.style.borderRadius = "6px";
      greetingBox.style.position = "fixed";
      greetingBox.style.zIndex = 99;
      greetingBox.style.bottom = (64 + my * 2) + "px";
      if (position === "left") {
        greetingBox.style.left = mx + "px";
        greetingBox.style.transformOrigin = "left bottom";
      } else {
        greetingBox.style.right = mx + "px";
        greetingBox.style.transformOrigin = "right bottom";
      }
      greetingBox.style.fontFamily = fontFamily;
      greetingBox.style.transition = "all .3s ease 0s";
      greetingBox.style.transform = "scale(.5)";
      greetingBox.style.opacity = 0;
    }
    
    let chatboxOpen = localStorage.getItem("chatbox-open") === "true";
    
    const enterFullScreen = () => {
      chatboxEl.classList.add("full-screen");
      document.documentElement.classList.add("fullscreen-chatbox");
    }
    
    const existFullScreen = () => {
      document.documentElement.classList.remove("fullscreen-chatbox");
    }

    const addOpenClasses = () => {
      btnEl.innerHTML = xIcon;
      document.documentElement.classList.add("chatbox-open");
    }

    const removeOpenClasses = () => {
      document.documentElement.classList.remove("chatbox-open");
      btnEl.innerHTML = chatbotIcon;
    }
    
    const openChatbox = () => {
      localStorage.setItem("chatbox-open", "true")
      chatboxOpen = true;
      addOpenClasses();
    };
    
    const closeChatbox = () => {
      localStorage.setItem("chatbox-open", "false")
      chatboxOpen = false;
      removeOpenClasses()
    };

    if(chatboxOpen) {
      addOpenClasses();
    } else {
      removeOpenClasses();
    }

    btnEl.onclick = () => {
      if (chatboxOpen) {
        closeChatbox();
      } else {
        openChatbox();
      }
    };

    document.head.append(styleEl);
    document.body.append(btnEl);
    document.body.append(greetingBox);
    document.body.append(overlayEl);
    document.body.append(chatboxEl);

    window.addEventListener('message', function(event) {
      if(event.data === "CLOSE_CHATBOX") {
        closeChatbox();
      }
      if(event.data === "ENTER_FULLSCREEN_CHATBOX") {
        enterFullScreen();
      }
      if(event.data === "EXIT_FULLSCREEN_CHATBOX") {
        existFullScreen();
      }
      if(event.data?.source === "page-navigation") {
        localStorage.setItem("{{chatbot.id}}.chatbox-path", event.data.payload?.pathname ?? "");
      }
    });
  }

  if(document.readyState === 'complete') {
    initialize();
  } else {
    window.addEventListener('load', initialize);
  }
})();
`,
);
