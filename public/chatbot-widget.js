!(async function () {
  const BTN_ID = "sb-btn";
  const IFRAME_ID = "sb-iframe";
  const MSG_BOX_ID = "sb-msg-box";

  const s = document.querySelector('script[data-name="SB-ChatBox"]');
  if (!s) {
    return;
  }
  const projectId = s.dataset.id;

  if (!projectId) {
    throw "data-id is required";
  }
  const baseUrl = "https://supabotai.com";
  const res = await fetch(`${baseUrl}/api/projects/${projectId}`);
  const project = await res.json();
  if (!res.ok) {
    throw res.statusText;
  }

  const xm = s.dataset.xMargin || "18";
  const ym = s.dataset.yMargin || "18";
  const p = project.theme?.position || "right";

  const btn = document.createElement("button");
  btn.id = BTN_ID;
  btn.style.backgroundColor = project.theme?.primary_color || "#6366F1";
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
  iframe.id = IFRAME_ID;
  iframe.src = `${baseUrl}/widget/chatbox/${s.dataset.id}`;
  iframe.style.position = "fixed";
  iframe.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  iframe.style.width = "100%";
  iframe.style.height = "620px";
  iframe.style.maxWidth = "400px";
  iframe.style.maxHeight = "80vh";
  iframe.style.borderRadius = "10px";
  iframe.style.boxShadow = "rgba(0, 0, 0, 0.15) 0px 8px 32px";
  iframe.style.zIndex = 100;
  iframe.style.backgroundColor = "#fff";
  iframe.style.border = "1px solid #E4E4E7";
  iframe.style.boxSizing = "border-box";
  iframe.style.zIndex = 110;
  iframe.style.bottom = `${64 + Number(ym) * 2}px`;
  if (p == "left") {
    iframe.style.transformOrigin = "left bottom";
    iframe.style.left = xm + "px";
  } else {
    iframe.style.transformOrigin = "right bottom";
    iframe.style.right = xm + "px";
  }

  const msgBox = document.createElement("div");
  msgBox.id = MSG_BOX_ID;
  msgBox.innerText = "Hi there 👋";
  msgBox.style.padding = "12px";
  msgBox.style.backgroundColor = "#fff";
  msgBox.style.color = "#000";
  msgBox.style.fontWeight = "600";
  msgBox.style.boxShadow = "rgba(0, 0, 0, 0.15) 0px 8px 32px";
  msgBox.style.borderRadius = "6px";
  msgBox.style.position = "fixed";
  msgBox.style.zIndex = 99;
  msgBox.style.bottom = `${64 + Number(ym) * 2}px`;
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

  document.body.append(btn);
  document.body.append(iframe);
  document.body.append(msgBox);

  const closeMessageBox = () => {
    msgBox.style.opacity = 0;
    msgBox.style.transform = "scale(.5)";
    msgBox.style.pointerEvents = "none";
  };

  setTimeout(() => {
    btn.style.transform = "scale(1)";
    btn.style.opacity = 1;
  }, 100);

  setTimeout(() => {
    msgBox.style.transform = "scale(1)";
    msgBox.style.opacity = 1;
  }, 600);

  setTimeout(() => {
    closeMessageBox();
  }, 5000);

  let chatboxOpen = false;

  const showChatbox = () => {
    btn.innerHTML = `<img src='${baseUrl}/x-icon.svg' alt='Chatbot Icon' style='width: 32px; height: 32px; object-fit: contain; padding: 0; margin: 0; pointer-events: none;' />`;
    iframe.style.opacity = 1;
    iframe.style.pointerEvents = "auto";
    iframe.style.transform = "scale(1)";
    chatboxOpen = true;
  };

  const hideChatbox = () => {
    btn.innerHTML = `<img src='${baseUrl}/chatbot-icon.svg' alt='Chatbot Icon' style='width: 32px; height: 32px; object-fit: contain; padding: 0; margin: 0; pointer-events: none;' />`;
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
})();
