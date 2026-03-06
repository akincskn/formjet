import { nanoid } from "nanoid";
import type { FormField } from "@/types/database";

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: Omit<FormField, "id">[];
}

// Helper so each template call gets fresh unique IDs
function withIds(fields: Omit<FormField, "id">[]): FormField[] {
  return fields.map((f) => ({ ...f, id: `field_${nanoid(8)}` }));
}

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "blank",
    name: "Boş Form",
    description: "Sıfırdan başlayın",
    icon: "✏️",
    fields: [],
  },
  {
    id: "contact",
    name: "İletişim Formu",
    description: "Ad, e-posta, telefon ve mesaj",
    icon: "💬",
    fields: [
      { type: "text",     label: "Ad Soyad",  placeholder: "Adınızı girin",         required: true  },
      { type: "email",    label: "E-posta",   placeholder: "ornek@eposta.com",       required: true  },
      { type: "tel",      label: "Telefon",   placeholder: "+90 555 000 00 00",      required: false },
      { type: "textarea", label: "Mesaj",     placeholder: "Mesajınızı yazın...",    required: true  },
    ],
  },
  {
    id: "appointment",
    name: "Randevu Formu",
    description: "Tarih ve saat seçimli randevu",
    icon: "📅",
    fields: [
      { type: "text",     label: "Ad Soyad",  placeholder: "Adınızı girin",    required: true  },
      { type: "tel",      label: "Telefon",   placeholder: "+90 555 000 00 00", required: true  },
      { type: "date",     label: "Tarih",     placeholder: "",                  required: true  },
      { type: "select",   label: "Saat",      placeholder: "Saat seçin",        required: true,
        options: ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"] },
      { type: "textarea", label: "Not",       placeholder: "Eklemek istediğiniz bir not...", required: false },
    ],
  },
  {
    id: "feedback",
    name: "Geri Bildirim Formu",
    description: "Puanlama ve yorum",
    icon: "⭐",
    fields: [
      { type: "text",     label: "Ad Soyad",   placeholder: "Adınızı girin",       required: true  },
      { type: "email",    label: "E-posta",    placeholder: "ornek@eposta.com",     required: false },
      { type: "select",   label: "Puan",       placeholder: "Puan seçin",           required: true,
        options: ["1 — Çok kötü", "2 — Kötü", "3 — Orta", "4 — İyi", "5 — Mükemmel"] },
      { type: "textarea", label: "Yorumunuz",  placeholder: "Görüşlerinizi paylaşın...", required: false },
    ],
  },
  {
    id: "order",
    name: "Sipariş Formu",
    description: "Ürün seçimli sipariş",
    icon: "🛒",
    fields: [
      { type: "text",     label: "Ad Soyad",  placeholder: "Adınızı girin",      required: true  },
      { type: "tel",      label: "Telefon",   placeholder: "+90 555 000 00 00",   required: true  },
      { type: "select",   label: "Ürün",      placeholder: "Ürün seçin",          required: true,
        options: ["Ürün A", "Ürün B", "Ürün C"] },
      { type: "number",   label: "Adet",      placeholder: "1",                   required: true  },
      { type: "textarea", label: "Adres",     placeholder: "Teslimat adresiniz...", required: true },
    ],
  },
  {
    id: "event",
    name: "Etkinlik Kayıt",
    description: "Katılım türü seçimli kayıt",
    icon: "🎟️",
    fields: [
      { type: "text",   label: "Ad Soyad",       placeholder: "Adınızı girin",    required: true  },
      { type: "email",  label: "E-posta",        placeholder: "ornek@eposta.com", required: true  },
      { type: "tel",    label: "Telefon",        placeholder: "+90 555 000 00 00", required: false },
      { type: "select", label: "Katılım Türü",   placeholder: "Seçin",            required: true,
        options: ["Yüz yüze", "Online", "Hibrit"] },
    ],
  },
  {
    id: "application",
    name: "Başvuru Formu",
    description: "CV linki ve mesaj içeren başvuru",
    icon: "📋",
    fields: [
      { type: "text",     label: "Ad Soyad",   placeholder: "Adınızı girin",           required: true  },
      { type: "email",    label: "E-posta",    placeholder: "ornek@eposta.com",         required: true  },
      { type: "tel",      label: "Telefon",    placeholder: "+90 555 000 00 00",        required: false },
      { type: "url",      label: "CV Linki",   placeholder: "https://linkedin.com/in/...", required: false },
      { type: "textarea", label: "Mesaj",      placeholder: "Kendinizi tanıtın...",     required: true  },
    ],
  },
];

// Returns a template's fields with freshly generated IDs (safe to mutate in state)
export function getTemplateFields(templateId: string): { name: string; fields: FormField[] } {
  const tpl = FORM_TEMPLATES.find((t) => t.id === templateId);
  if (!tpl) return { name: "", fields: [] };
  return { name: tpl.id === "blank" ? "" : tpl.name, fields: withIds(tpl.fields) };
}
