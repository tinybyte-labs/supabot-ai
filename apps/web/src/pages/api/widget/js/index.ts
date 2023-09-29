import { defaultChatbotSettings } from "@/data/defaultChatbotSettings";
import { prisma } from "@acme/db";
import { BASE_DOMAIN } from "@/utils/constants";
import { ChatbotSettings } from "@/utils/validators";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*"); // replace this your actual origin
  res.setHeader("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  // specific logic for the preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const chatbotId = req.query.id as string;
  if (!chatbotId) {
    throw res.status(400).send("id query params is required");
  }
  const chatbot = await prisma.chatbot.findUnique({ where: { id: chatbotId } });
  if (!chatbot) {
    throw res.status(404).send("Chatbot not found!");
  }
  const settings = (chatbot.settings ?? {}) as ChatbotSettings;

  const SCRIPT_TEMPLATE = `
!(function() {
  function initialize() {
    const xm = ${settings.mx ?? 18};
    const ym = ${settings.my ?? 18};
    const p = "${(chatbot.settings as ChatbotSettings)?.position ?? "right"}";
    const style = document.createElement("style");
    style.id = "sb-style";
    style.innerHTML = \`
      :root {
        --sb-primary: ${
          settings.primaryColor ?? defaultChatbotSettings.primaryColor
        };
        --sb-primary-foreground: ${
          settings.primaryForegroundColor ??
          defaultChatbotSettings.primaryForegroundColor
        };
        ${
          settings.theme === "dark"
            ? `
        --sb-border: #27272a;
        --sb-background: #09090b;
        --sb-foreground: #ffffff;
        `
            : `
        --sb-border: #E4E4E7;
        --sb-background: #ffffff;
        --sb-foreground: #09090b;
        `
        }
      }
    \`
    const btn = document.createElement("button");
    btn.id = "sb-btn";
    btn.style.backgroundColor = "var(--sb-primary)";
    btn.style.color = "var(--sb-primary-foreground)";
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
    btn.style.transform = "scale(0)";
    btn.style.opacity = 0;
    if (p === "left") {
      btn.style.left = xm + "px";
    } else {
      btn.style.right = xm + "px";
    }
    btn.style.bottom = ym + "px";

    const iframe = document.createElement("iframe");
    iframe.id = "sb-iframe";
    iframe.src = "${BASE_DOMAIN}/widgets/c/${chatbot.id}";
    iframe.style.position = "fixed";
    iframe.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    iframe.style.width = "100%";
    iframe.style.height = "calc(100vh - 8rem)";
    iframe.style.maxWidth = "420px";
    iframe.style.maxHeight = "720px";
    iframe.style.borderRadius = "16px";
    iframe.style.boxShadow = "rgba(0, 0, 0, 0.15) 0px 8px 32px";
    iframe.style.zIndex = 100;
    iframe.style.backgroundColor = "var(--sb-background)";
    iframe.style.color = "var(--sb-foreground)";
    iframe.style.border = "1px solid var(--sb-border)";
    iframe.style.boxSizing = "border-box";
    iframe.style.zIndex = 110;
    iframe.style.bottom = \`\${64 + Number(ym) * 2}px\`;
    if (p == "left") {
      iframe.style.transformOrigin = "left bottom";
      iframe.style.left = xm + "px";
    } else {
      iframe.style.transformOrigin = "right bottom";
      iframe.style.right = xm + "px";
    }

    let msgBox;
    const closeMessageBox = () => {
      if(!msgBox) return;
      msgBox.style.opacity = 0;
      msgBox.style.transform = "scale(.5)";
      msgBox.style.pointerEvents = "none";
    };
    
    ${
      settings.greetingText
        ? `
      msgBox = document.createElement("div");
      msgBox.id = "sb-msg-box";
      msgBox.innerText = "${settings.greetingText}";
      msgBox.style.padding = "12px";
      msgBox.style.backgroundColor = "var(--sb-background)";
      msgBox.style.color = "var(--sb-foreground)";
      msgBox.style.border = "1px solid var(--sb-border)";
      msgBox.style.fontWeight = "600";
      msgBox.style.boxShadow = "rgba(0, 0, 0, 0.15) 0px 8px 32px";
      msgBox.style.borderRadius = "6px";
      msgBox.style.position = "fixed";
      msgBox.style.zIndex = 99;
      msgBox.style.bottom = \`\${64 + Number(ym) * 2}px\`;
      if (p === "left") {
        msgBox.style.left = xm + "px";
        msgBox.style.transformOrigin = "left bottom";
      } else {
        msgBox.style.right = xm + "px";
        msgBox.style.transformOrigin = "right bottom";
      }
      msgBox.style.transition = "all .3s ease 0s";
      msgBox.style.transform = "scale(.5)";
      msgBox.style.opacity = 0;
      msgBox.style.fontFamily =
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

      document.body.append(msgBox);

      setTimeout(() => {
        msgBox.style.transform = "scale(1)";
        msgBox.style.opacity = 1;
      }, 600);

      setTimeout(() => {
        closeMessageBox();
      }, 5000);
    `
        : ""
    }

    document.head.append(style);
    document.body.append(btn);
    document.body.append(iframe);

    setTimeout(() => {
      btn.style.transform = "scale(1)";
      btn.style.opacity = 1;
    }, 100);

    let chatboxOpen = false;

    const showChatbox = () => {
      btn.innerHTML = \`<svg width="512" height="512" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style='width: 32px; height: 32px;'>
      <path fill="currentColor" d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326a.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275a.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018a.751.751 0 0 1-.018-1.042L6.94 8L3.72 4.78a.75.75 0 0 1 0-1.06Z"/>
  </svg>\`;
      iframe.style.opacity = 1;
      iframe.style.pointerEvents = "auto";
      iframe.style.transform = "scale(1)";
      chatboxOpen = true;
    };

    const hideChatbox = () => {
      btn.innerHTML = \`<svg width="512" height="512" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" style='width: 32px; height: 32px;'>
      <path fill="currentColor" d="M1.5 0C.671 0 0 .67 0 1.5v8.993c0 .83.671 1.5 1.5 1.5h3.732l1.852 2.775a.5.5 0 0 0 .832 0l1.851-2.775H13.5c.829 0 1.5-.67 1.5-1.5V1.5c0-.83-.671-1.5-1.5-1.5h-12Z"/>
  </svg>\`;
      iframe.style.opacity = 0;
      iframe.style.pointerEvents = "none";
      iframe.style.transform = "scale(0)";
      chatboxOpen = false;
    };

    hideChatbox();

    btn.onclick = () => {
      if (!chatboxOpen) {
        showChatbox();
        closeMessageBox();
      } else {
        hideChatbox();
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
      if(event.data === "CLOSE_CHATBOX") {
        hideChatbox();
      }
    });
  }

  if(document.readyState === 'complete') {
    initialize();
  }else {
    window.addEventListener('load', initialize);
  }
})();
`.trim();

  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  return res.send(SCRIPT_TEMPLATE);
}
