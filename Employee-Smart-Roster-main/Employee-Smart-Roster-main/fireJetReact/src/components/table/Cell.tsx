import "./Cell.css";
import "../../../public/styles/common.css";

export default function Cell({ className = "", text = "Text" }: CellProps) {
  return (
    <div className={`${className} table-cell`}>
      <div className="table-cell-text">{text}</div>
    </div>
  );
}

interface CellProps {
  className?: string;
  text?: React.ReactNode; 
}