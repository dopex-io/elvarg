async function basicUpload(params: {
  accountId: string;
  apiKey: string;
  requestBody: any;
  metadata?: Object;
  querystring?: string;
}) {
  const baseUrl = 'https://api.upload.io';

  const path = `/v2/accounts/${params.accountId}/uploads/binary`;

  const entries = (obj: Object) =>
    Object.entries(obj).filter(([, val]) => (val ?? null) !== null);

  const query = entries(params.querystring ?? {})
    .flatMap(([k, v]) => (Array.isArray(v) ? v.map((v2) => [k, v2]) : [[k, v]]))
    .map((kv) => kv.join('='))
    .join('&');

  const response = await fetch(
    `${baseUrl}${path}${query.length > 0 ? '?' : ''}${query}`,
    {
      method: 'POST',
      body: params.requestBody,
      headers: Object.fromEntries(
        entries({
          Authorization: `Bearer ${params.apiKey}`,
          'X-Upload-Metadata': JSON.stringify(params.metadata),
        })
      ),
    }
  );

  const result = await response.json();

  if (Math.floor(response.status / 100) !== 2)
    throw new Error(`Upload API Error: ${JSON.stringify(result)}`);

  return result;
}

export default basicUpload;
