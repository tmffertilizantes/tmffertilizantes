import { Form } from "react-bootstrap";

interface Props {
  className?: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  value?: string;
}

export default function SelectTechnology(props: Props) {
  return (
    <div className={props.className}>
      <label className="form-label">Uso de tecnologia no campo</label>

      <Form.Select name="tecnologia" id="tecnologia" value={props.value} aria-label="" onChange={props.onChange}>
        <option value="Baixo investimento">Baixo investimento</option>
        <option value="Médio investimento">Médio investimento</option>
        <option value="Alto investimento">Alto investimento</option>
      </Form.Select>
    </div>
  );
}
