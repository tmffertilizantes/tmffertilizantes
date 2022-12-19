import { useState } from "react";
import { Modal } from "react-bootstrap";


interface Props {
	show: boolean;
	onClose: () => void;
	onConfirm: () => void;
  children: React.ReactNode;
  editPost?: boolean;
  postTypeTitle: string;
}


export default function ModalAdd({ show, onClose, onConfirm, children, editPost, postTypeTitle }: Props) {

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editPost ? "Editar" : "Adicionar"} {postTypeTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
				{children}

        <button className="btn btn-primary me-2" onClick={onConfirm}>
        {editPost ? "Editar" : "Adicionar"}
        </button>
        <button className="btn btn-outline-white" onClick={onClose}>
          Fechar
        </button>
      </Modal.Body>
    </Modal>
  );
}
