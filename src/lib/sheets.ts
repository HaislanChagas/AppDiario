import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

function getPrivateKey() {
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!key) {
    throw new Error("GOOGLE_PRIVATE_KEY não definida.");
  }

  return key.replace(/\\n/g, "\n");
}

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: getPrivateKey(),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function getSheetsClient() {
  const auth = getAuth();
  return google.sheets({ version: "v4", auth });
}

export async function listarAbas() {
  const sheets = await getSheetsClient();

  const res = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
  });

  const abas =
    res.data.sheets?.map((sheet) => sheet.properties?.title || "") || [];
  return abas;
}

export async function lerCelula(aba: string, celula: string) {
  const sheets = await getSheetsClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `'${aba}'!${celula}`,
  });

  return res.data.values?.[0]?.[0] ?? "0";
}

export async function lerIntervalo(aba: string, intervalo: string) {
  const sheets = await getSheetsClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `'${aba}'!${intervalo}`,
  });

  return res.data.values || [];
}

export async function escreverCelula(
  aba: string,
  celula: string,
  valor: number
) {
  const sheets = await getSheetsClient();

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `'${aba}'!${celula}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[valor]],
    },
  });
}