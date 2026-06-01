export default function RouteHeading({label}: {label : string}) {
  return (
    <div className="flex items-center ml-5">
      <h1 className="text-2xl text-red-600 font-bold">/</h1>
      <h1 className="text-2xl text-muted-foreground">{label}</h1>
    </div>
  );
}
