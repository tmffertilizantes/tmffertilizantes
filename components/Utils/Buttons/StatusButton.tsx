interface Props {
	className?: string;
  active: boolean;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function StatusButton(props: Props) {
  const title = props.active ? "Desativar" : "Ativar"

  return (
    <button
      className={`btn ${props.active ?  "btn-outline-danger" : "btn-outline-success"} btn-xs ${props.className}`}
      onClick={props.onClick}
    >
      {title}
    </button>
  );
}
