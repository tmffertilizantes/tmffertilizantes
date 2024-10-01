import { useState } from "react";

interface Props {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function StatusButton(props: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className={`btn btn-outline-danger rounded-circle ms-2 btn-xs px-2 ${props.className}`}
        onClick={props.onClick}
      >
        <i className="nav-icon fe fe-trash"></i>
      </button>
    </>
  );
}
