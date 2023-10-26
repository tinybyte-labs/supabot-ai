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

    const btn = document.createElement("button");
    const iframe = document.createElement("iframe");
    const greetingBox = document.createElement("div");

    // Dom cleanup
    const oldBtn = document.getElementById("sb-btn");
    if(oldBtn) {
      oldBtn.remove();
    }
    const oldChatBox = document.getElementById("sb-chatbox");
    if(oldChatBox) {
      oldChatBox.remove();
    }
    const oldGreetingBox = document.getElementById("sb-greeting-box");
    if(oldGreetingBox) {
      oldGreetingBox.remove();
    }

    // Chatbot button styling
    btn.id = "sb-btn";
    btn.style.backgroundColor = "{{chatbot.settings.primaryColor}}";
    btn.style.color = "{{chatbot.settings.primaryForegroundColor}}";
    btn.style.position = "fixed";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.borderRadius = "32px";
    btn.style.width = "64px";
    btn.style.height = "64px";
    btn.style.border = "none";
    btn.style.outline = "none";
    btn.style.cursor = "pointer";
    btn.style.transition = "all 0.25s ease 0s";
    btn.style.userSelect = "none";
    btn.style.boxSizing = "border-box";
    btn.style.boxShadow = "rgba(0, 0, 0, 0.15) 0px 4px 8px";
    btn.style.zIndex = 90;
    btn.style.bottom = my + "px";
    if (position === "left") {
      btn.style.left = mx + "px";
    } else {
      btn.style.right = mx + "px";
    }
    btn.style.pointerEvents = "none";
    btn.style.transform = "scale(0)";
    btn.style.opacity = 0;

    const chatboxPath = localStorage.getItem("{{chatbot.id}}.chatbox-path");

    // Iframe/Chatbox window styling
    iframe.id = "sb-chatbox";
    iframe.src = chatboxPath ? "{{widgetsBaseUrl}}" + chatboxPath : "{{widgetsBaseUrl}}/c/{{chatbot.id}}";
    iframe.style.position = "fixed";
    iframe.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    iframe.style.width = "100%";
    iframe.style.height = "calc(100vh - 8rem)";
    iframe.style.maxWidth = "420px";
    iframe.style.maxHeight = "720px";
    iframe.style.borderRadius = "16px";
    iframe.style.boxShadow = "0px 8px 32px -5px rgba(0, 0, 0, 0.15), 0 0px 1px 1px rgba(0, 0, 0, 0.1)";
    iframe.style.zIndex = 100;
    iframe.style.backgroundColor = "#ffffff";
    iframe.style.color = "#000000";
    iframe.style.boxSizing = "border-box";
    iframe.style.zIndex = 110;
    iframe.style.bottom = (64 + my * 2) + "px";
    if (position == "left") {
      iframe.style.transformOrigin = "left bottom";
      iframe.style.left = mx + "px";
    } else {
      iframe.style.transformOrigin = "right bottom";
      iframe.style.right = mx + "px";
    }

    const greetingText = "{{chatbot.settings.greetingText}}";
    if(greetingText) {
      // Greeting Box styling
      greetingBox.id = "sb-greeting-box";
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
    
    document.body.append(btn);
    document.body.append(iframe);
    document.body.append(greetingBox);

    let chatboxOpen = localStorage.getItem("chatbox-open") === "true";

    const applyChatboxOpenState = () => {
      btn.innerHTML = xIcon;
      btn.style.pointerEvents = "auto";
      btn.style.opacity = 1;
      btn.style.transform = "scale(1)";

      iframe.style.pointerEvents = "auto";
      iframe.style.opacity = 1;
      iframe.style.transform = "scale(1)";

      greetingBox.style.opacity = 0;
      greetingBox.style.transform = "scale(.5)";
      greetingBox.style.pointerEvents = "none";
    }
    
    const applyChatboxCloseState = () => {
      btn.innerHTML = chatbotIcon;
      iframe.style.opacity = 0;
      iframe.style.pointerEvents = "none";
      iframe.style.transform = "scale(0)";
    }
    
    const openChatbox = () => {
      localStorage.setItem("chatbox-open", "true")
      applyChatboxOpenState()
      chatboxOpen = true;
    };
    
    const closeChatbox = () => {
      localStorage.setItem("chatbox-open", "false")
      applyChatboxCloseState()
      chatboxOpen = false;
    };

    if(chatboxOpen) {
      applyChatboxOpenState();
    } else {
      applyChatboxCloseState();

      setTimeout(() => {
        btn.style.pointerEvents = "auto";
        btn.style.opacity = 1;
        btn.style.transform = "scale(1)";
      }, 100);

      setTimeout(() => {
        greetingBox.style.transform = "scale(1)";
        greetingBox.style.opacity = 1;
      }, 600);

      setTimeout(() => {
        greetingBox.style.opacity = 0;
        greetingBox.style.transform = "scale(.5)";
        greetingBox.style.pointerEvents = "none";
      }, 5000);
    }

    btn.onclick = () => {
      if (chatboxOpen) {
        closeChatbox();
      } else {
        openChatbox();
      }
    };

    let hovering = false;
    btn.onmousedown = () => {
      btn.style.transform = "scale(0.9)";
    };
    btn.onmouseup = () => {
      if (hovering) {
        btn.style.transform = "scale(1.1)";
      } else {
        btn.style.transform = "scale(1)";
      }
    };
    btn.onmouseover = () => {
      btn.style.transform = "scale(1.1)";
      hovering = true;
    };
    btn.onmouseleave = () => {
      btn.style.transform = "scale(1)";
      hovering = false;
    };
    window.addEventListener('message', function(event) {
      console.log(event)
      if(event.data === "CLOSE_CHATBOX") {
        closeChatbox();
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
