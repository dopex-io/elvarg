const imageUpload = async (data: {
  file: string;
  api_key: string;
  upload_preset: string;
}) => {
  const urlEncodedDataPairs = [];

  // Turn the data object into an array of URL-encoded key/value pairs.
  for (const [name, value] of Object.entries(data)) {
    urlEncodedDataPairs.push(
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
    );
  }

  // Combine the pairs into a single string and replace all %-encoded spaces to
  // the '+' character; matches the behavior of browser form submissions.
  const urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

  return fetch('https://api.cloudinary.com/v1_1/dxitdndu3/image/upload', {
    body: urlEncodedData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })
    .then((res) => res.json())
    .then((data) => data);
};

export default imageUpload;
