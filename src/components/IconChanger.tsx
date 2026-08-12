export const iconChanger = (icon: string, description?: string) => {
  return (
    <span className="icon">
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description || "Weather icon"}
      />
    </span>
  );
};