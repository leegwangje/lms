"use client"
// src/app/layout.js
import React, {useState} from "react";

import Header from "@/app/layout/header";
import Footer from "@/app/layout/footer"; // Login.css 가져오기

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
    <body>
    <div>

      <div>
        <main>{children}</main>
      </div>

    </div>
    </body>
    </html>
  );
};

