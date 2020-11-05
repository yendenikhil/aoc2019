const decoder = new TextDecoder("utf-8");

export async function read(file: string) {
  const raw = await Deno.readFile(file);
  return decoder.decode(raw);
}

export function l(message: string) {
  console.log(message);
}

export const p = l

