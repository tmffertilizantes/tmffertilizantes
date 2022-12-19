import { ChangeEventHandler } from "react";
import { Form } from "react-bootstrap";

interface Props {
  label?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onChangeAsRadio?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
  type?: "radio" | "select";
}

export default function SelectLanguage(props: Props) {
  const languages = [
    {
      label: "Português",
      value: "pt-BR",
    },
    {
      label: "Ingês",
      value: "en-US",
    },
  ];

  return (
    <div className={props.className}>
      <label className="form-label">{props.label ?? "Idioma"}</label>

      {props.type === "radio" ? (
        <div>
          {languages.map((language) => (
            <Form.Check
              key={language.value}
              inline
              label={language.label}
              name="group1"
              type="radio"
              id={language.value}
              onChange={props.onChangeAsRadio}
              checked={props.value === language.value}
            />
          ))}
        </div>
      ) : (
        <Form.Select
          name="language"
          id="language"
          value={props.value}
          aria-label="Default select example"
          onChange={props.onChange}
        >
          {languages.map((language) => (
            <option key={language.value} value={language.value}>{language.label}</option>
          ))}
        </Form.Select>
      )}
    </div>
  );
}
