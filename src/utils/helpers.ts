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
