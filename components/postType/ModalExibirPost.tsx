import { Modal } from "react-bootstrap";

interface Props {
  title?: string;
  size?: "lg" | "sm" | "xl" | undefined;
  pdf_url?: string;
  children: React.ReactNode;
  onClose: () => void;
  show: boolean;
}

export default function ModalExibirPost(props: Props) {
  return (
    <Modal show={props.show} onHide={props.onClose} size={props.size} >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {props.children}

        <div className="text-end">
          {props.pdf_url && (
            <a className="btn btn-primary me-2" target="_blank" rel="noreferrer" href={props.pdf_url}>
              <i className="nav-icon fe fe-external-link me-2"></i> Visualizar PDF
            </a>
          )}

          <button className="btn btn-outline-white" onClick={props.onClose}>
            Fechar
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
