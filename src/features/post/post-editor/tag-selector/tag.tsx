export default function Tag({ name }: { name: string }) {
  return (
    <li data-name={name} className="flex flex-row items-center gap-0.5 rounded-full bg-blue-400 px-1 text-sm h-min text-nowrap hover:brightness-75">
      <span data-name={name}>{name}</span>
      <span data-name={name} className="text-white font-extrabold">
        x
      </span>
    </li>
  );
}
