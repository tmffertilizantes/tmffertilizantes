interface Props {
	className?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function RemoveButton(props: Props) {
  return (
    <button
      className={`btn btn-danger btn-xs ${props.className}`}
      onClick={props.onClick}
    >
      Remover
    </button>
  );
}
