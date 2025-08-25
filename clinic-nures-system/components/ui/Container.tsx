export default function Container({ children, className = "" }) {
  return (
    <div className={`bg-white border-2 border-[#D9D9D9] rounded-[25px] p-8 shadow ${className}`}>
      {children}
    </div>
  );
}