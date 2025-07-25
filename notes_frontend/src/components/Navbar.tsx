"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <nav
      className="flex items-center justify-between px-6 py-3 border-b"
      style={{
        background: "var(--color-background, #fff)",
        color: "var(--color-foreground, #171717)",
        borderColor: "#e0e0e0",
      }}
    >
      <span className="font-bold text-lg" style={{ color: "#1976d2" }}>
        Notes App
      </span>
      <div className="flex items-center gap-2">
        {user && (
          <>
            <span className="text-sm">{user.email}</span>
            <button
              className="ml-3 rounded-md px-3 py-1 bg-[#ffb300] text-white hover:bg-[#ffa000] text-sm font-medium shadow"
              onClick={signOut}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
