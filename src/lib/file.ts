export async function covertToBufferString(stream: AsyncIterable<any>): Promise<string> {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString();
}

export async function parseCSVFormData(file: FormDataEntryValue): Promise<string[]> {
  if (!(file instanceof Blob)) {
    throw new Error('Unable to process file');
  }

  const stream = file.stream() as unknown as AsyncIterable<any>;

  if (file.type !== 'text/csv') {
    throw new Error('The file is of the incorrect expected type (CSV)');
  }

  const bufferString = await covertToBufferString(stream);

  return bufferString.split(',\n').map((data) => data.trim());
}
