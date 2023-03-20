export default function cx(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
