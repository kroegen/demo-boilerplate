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
