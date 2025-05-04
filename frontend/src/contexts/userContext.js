// We use context to share data globally across our app without manually passing props down through every component level.

/* 
- We created a UserContext, and we wrapped our app component in it.
- And then any component, no matter how deep can use user directly with:
- const { user } = useContext(UserContext);
- So no need to pass user={user} through 10 levels of props. :)
*/

import { createContext, useContext } from "react";

export const UserContext = createContext(null);

// Optional Shortcut hook to use context
export const useUser = () => useContext(UserContext);
