import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal);

const default_timer = 1500;
const background = "#19542c";
const color = "#fff";

export function AlertSuccessModel(text: string) {
  MySwal.fire({
    text: text,
    icon: "success",
    showConfirmButton: false,
    timer: default_timer,
  });
}

export function AlertItemCreated() {
  AlertSuccessModel("Item cadastrado com sucesso!");
}

export function AlertItemEdited() {
  AlertSuccessModel("Item alterado com sucesso!");
}

export function AlertItemRemoved() {
  AlertSuccessModel("Item removido com sucesso!");
}

export function AlertUserRemoved() {
  AlertSuccessModel("Usuário removido com sucesso!");
}

export function AlertError(text?: string, timer?: number) {
  MySwal.fire({
    text: text ?? "Ocorreu um erro, tente novamente!",
    icon: "error",
    showConfirmButton: false,
    timer: timer ?? default_timer,
  });
}
