import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const uploadInput = z.object({
  fileName: z.string().min(1).max(160),
  contentType: z.string().min(3).max(80),
  base64: z.string().min(10),
});

const TEN_YEARS = 315360000;

/** Admin-only product image upload. Returns a long-lived signed URL. */
export const uploadProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => uploadInput.parse(input))
  .handler(async ({ data, context }): Promise<{ url: string }> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const safe = data.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${Date.now()}-${safe}`;

    const { error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (error) throw new Error("Upload failed. Try a smaller image.");

    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("product-images")
      .createSignedUrl(path, TEN_YEARS);
    if (signErr || !signed) throw new Error("Could not create an image link.");

    return { url: signed.signedUrl };
  });
