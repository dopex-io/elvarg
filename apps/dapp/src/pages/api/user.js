export default function handler(req, res) {
  const keeper_pk = process.env['KEEPER_PK'];
  res
    .status(200)
    .json({ name: 'John Doe', keeper_pk: keeper_pk.substring(0, 3) });
}
