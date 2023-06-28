import type { User, UserCreds } from "@/api/services/interfaces";

export function getRandomUserCreds(users: User[]): UserCreds {
  if (users.length > 0) {
    const usersCreds = users.map((user: User) => ({
      username: user.username,
      password: user.password,
    }));
    const randomIndex = Math.floor(Math.random() * usersCreds.length);

    return usersCreds[randomIndex];
  } else {
    return {
      username: "",
      password: "",
    };
  }
}

// https://stackoverflow.com/questions/71873824/copy-text-to-clipboard-cannot-read-properties-of-undefined-reading-writetext
export function unsecuredCopyToClipboard(text: string) {
  const textArea = document.createElement("textarea");

  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Unable to copy to clipboard", err);
  }

  document.body.removeChild(textArea);
}

export function findParentElementByClassName(
  el: Element | null,
  className: string
): Element | null {
  if (!el) return null;

  while (el.parentNode) {
    if (el.classList.contains(className)) {
      return el;
    } else {
      return findParentElementByClassName(el.parentElement, className);
    }
  }

  return null;
}

export function debounce(fn: Function, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}
