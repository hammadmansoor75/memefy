"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const SyncUser = () => {
  const { isSignedIn, user } = useUser();
  const [hasSynced, setHasSynced] = useState(false); // Track if the user is already synced

  useEffect(() => {
    if (isSignedIn && user && !hasSynced) {
      // Sync user to the backend
      console.log("Syncing user...");
      fetch("/api/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to sync user");
          }
          return res.json();
        })
        .then((data) => {
          console.log("User synced successfully:", data);
          setHasSynced(true); // Mark as synced
        })
        .catch((err) => {
          console.error("Error syncing user:", err);
        });
    }
  }, [isSignedIn, user, hasSynced]);

  return null; // This component does not render anything visible
};

export default SyncUser;
