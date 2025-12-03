
// src/lib/chatActions.ts
'use server';

import { supabase } from "./supabase/server";

export async function sendMessage(userId: string, message: string) {
  const { error } = await supabase
    .from("messages")
    .insert([{ user_id: userId, message }]);

  if (error) {
    console.error("Error sending message:", error.message);
    throw new Error(error.message);
  }
}
