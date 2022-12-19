interface Props {
	className?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function ShowButton(props: Props) {
  return (
    <button
      className={`btn btn-outline-primary btn-xs ${props.className}`}
      onClick={props.onClick}
    >
      Mostrar
    </button>
  );
}
