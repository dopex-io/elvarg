export default function handler(req, res) {
  const keeper_pk = process.env['KEEPER_PK'];
  const isKeeperValid = keeper_pk && validPk(keeper_pk);

  if (!isKeeperValid) {
    return response.status(503).json({ error: 'Invalid pk for keeper' });
  }
  res.status(200).json({ name: 'John Doe', isKeeperValid: isKeeperValid });
}
