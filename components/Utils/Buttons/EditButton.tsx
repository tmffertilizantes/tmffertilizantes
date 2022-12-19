interface Props {
	className?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function EditButton(props: Props) {
  return (
    <button
      className={`btn btn-primary btn-xs ${props.className}`}
      onClick={props.onClick}
    >
      Editar
    </button>
  );
}
