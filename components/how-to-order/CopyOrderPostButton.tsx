"use client";

import React, { useState } from "react";
import { FACEBOOK_ORDER_POST } from "@/lib/constants/howToOrder";

export default function CopyOrderPostButton() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const copyPost = async () => {
    setCopyError("");
    try {
      await navigator.clipboard.writeText(FACEBOOK_ORDER_POST);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error(error);
      setCopied(false);
      setCopyError("Could not copy. Select the text above and copy it manually.");
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={copyPost}
        className="bg-[#009473] hover:bg-[#028467] text-white font-semibold px-5 py-2.5 rounded-lg text-sm"
      >
        {copied ? "Copied" : "Copy Facebook / WhatsApp post"}
      </button>
      {copyError ? <p className="text-sm text-rose-600 mt-2">{copyError}</p> : null}
    </div>
  );
}
