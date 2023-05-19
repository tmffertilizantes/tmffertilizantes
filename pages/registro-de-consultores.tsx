import LayoutDefault from "@components/Layouts/default";
import { PostType } from "@components/postType";
import { NoFilter } from "@components";

import { useGlobal } from "@context/global";
import axios, { AxiosResponse } from "axios";
import { ColumnFn } from "models/ColumnFn";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";

interface User {
  activatedAt?: string;
  active?: boolean;
  cityId?: number;
  createdAt?: string;
  email?: string;
  id?: number;
  identification?: string;
  name?: string;
  phone?: string;
  roleId?: number;
  stateId: number;
  status?: string;
  updatedAt?: string;
}

interface Consultor {
  formRegion?: string;
  formResale?: string;
  id?: number;
  resale?: string;
  resaleId?: number;
  regionId?: number;
  user: User;
  userId?: number;
}

export default function RegistroDeConsultores() {
  const { token = "" } = useGlobal();
  const url = `${process.env.API_URL}/consultant`;

  const [showModalFilter, setShowModalFilter] = useState(false);
  const [startDate, setStartDate] = useState<string>("2000-01-01");
  const [endDate, setEndDate] = useState<String | null>(null);

  const [loadingData, setLoadingData] = useState<boolean>(false);

  const [csvData, setCsvData] = useState("");

  const colunas =
    ({ onUpdate, onRemove, getPost, onStatusChange, reloadData }: ColumnFn) =>
    () =>
      [
        {
          Header: "Name",
          accessor: "name",
        },
        {
          Header: "Revenda",
          accessor: "resale",
        },
        {
          Header: "Produtores",
          accessor: "registered.producers",
          Filter: NoFilter,
        },
        {
          Header: "Nutrição de Plantas",
          accessor: "registered.plant_nutrition",
          Filter: NoFilter,
        },
        {
          Header: "Construção de Solo",
          accessor: "registered.solo_construct",
          Filter: NoFilter,
        },
        {
          Header: "Custo de Produção",
          accessor: "registered.production_cost",
          Filter: NoFilter,
        },
        {
          Header: "Custo TMF",
          accessor: "registered.tmf_cost",
          Filter: NoFilter,
        },
      ];

  function getTodayDate() {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate());
    var today = currentDate.toISOString().substring(0, 10);

    return today;
  }

  function getFileName() {
    let data_fim = endDate;

    if (!data_fim) {
      data_fim = getTodayDate();
    }

    return `Período de ${startDate} até ${data_fim}`;
  }

  return (
    <LayoutDefault>
      <PostType
        queryParams={`?start_date=${startDate ?? "2000-01-01"}&end_date=${
          endDate ?? getTodayDate()
        }`}
        clickDateButton={() => setShowModalFilter(true)}
        removeAddButton
        exportConsultantRegistrationButton
        csvData={csvData}
        dataConfig={{
          url,
          token,
          fetcherFn: (
            fetcherDataFn = () => {},
            url = `${process.env.API_URL}/consultant/report?start_date=${
              startDate ?? "2000-01-01"
            }&end_date=${endDate ?? getTodayDate()}`,
            options = {}
          ) =>
            axios
              .get(
                `${process.env.API_URL}/consultant/report?start_date=${
                  startDate ?? "2000-01-01"
                }&end_date=${endDate ?? getTodayDate()}`,
                options
              )
              .then(fetcherDataFn),
          fetcherDataFn: (response: AxiosResponse) => {
            const consultant = response.data.consultants;

            var data_for_csv = consultant.map((consultant: any) => {
              return {
                id: consultant.id,
                Nome: consultant.name ?? "",
                Revenda: consultant.resale ?? "",

                Produtores: consultant.registered.producers,
                "Nutrição de Plantas": consultant.registered.plant_nutrition,
                "Construção de Solo": consultant.registered.solo_construct,
                "Custo de Produção": consultant.registered.production_cost,
                "Custo TMF": consultant.registered.tmf_cost,
              };
            });

            setCsvData(data_for_csv);

            return consultant;
          },
        }}
        tableConfig={{
          columnsFn: colunas,
          asConsultantRegister: true,
        }}
        formConfig={{
          insertTitle: "Adicionar Consultor",
          editTitle: "Editar Consultor",
        }}
        pageConfig={{
          pageTitle: "Registro de Consultores",
        }}
      />

      <Modal className="modalExport" show={showModalFilter} size="sm">
        <Modal.Header>
          <Modal.Title>Defina um período</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-box">
            <label htmlFor="data">Data Início</label>

            <input
              type="date"
              name="data"
              id="data"
              className="form-control"
              value={startDate != "2000-01-01" ? startDate : ""}
              onChange={(event) => {
                setStartDate(event.target.value);
              }}
            />
          </div>

          <div className="input-box">
            <label htmlFor="data_final">Data Fim</label>

            <input
              type="date"
              name="data_final"
              id="data_final"
              className="form-control"
              defaultValue={getTodayDate()}
              onChange={(event) => {
                setEndDate(event.target.value);
              }}
            />
          </div>

          <div className="mt-4">
            <button
              className="btn btn-primary me-2"
              onClick={() => setShowModalFilter(false)}
            >
              {loadingData ? "Salvando..." : "Salvar"}
            </button>

            <button
              className="btn btn-outline-white"
              onClick={() => setShowModalFilter(false)}
            >
              Fechar
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </LayoutDefault>
  );
}
