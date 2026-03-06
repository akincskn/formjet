"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function saveProfile(data: {
  name: string;
  notification_email: string | null;
  telegram_chat_id: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const service = createServiceClient();
  const { error } = await service
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email ?? "",
      name: data.name,
      notification_email: data.notification_email,
      telegram_chat_id: data.telegram_chat_id,
    });

  if (error) throw new Error(error.message);
}
