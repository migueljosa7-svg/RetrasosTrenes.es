/**
 * Datos del titular para las páginas legales (LSSI-CE exige identificar al titular).
 * Configúralos en variables de entorno; los valores por defecto son marcadores que DEBES sustituir.
 */
export const LEGAL = {
  owner: process.env.NEXT_PUBLIC_LEGAL_OWNER ?? "[NOMBRE Y APELLIDOS / RAZÓN SOCIAL]",
  taxId: process.env.NEXT_PUBLIC_LEGAL_TAX_ID ?? "[NIF/CIF]",
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS ?? "[DOMICILIO, CP, CIUDAD, ESPAÑA]",
  email: process.env.NEXT_PUBLIC_LEGAL_EMAIL ?? "contacto@tudominio.es",
  updated: "8 de noviembre de 2026",
};
