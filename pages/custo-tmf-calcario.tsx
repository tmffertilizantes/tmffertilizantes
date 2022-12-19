import { DateColumnFilter, NoFilter, PostType } from "@components";
import { NextPage } from "next";
import { useGlobal } from "@context/global";
import axios, { AxiosResponse } from "axios";
import LayoutDefault from "@components/Layouts/default";
import { useState } from "react";
import ModalExibirPost from "@components/postType/ModalExibirPost";
import { Col, Row, Spinner, Table } from "react-bootstrap";
import { ColumnFn } from "models/ColumnFn";
import ShowButton from "@components/Utils/Buttons/ShowButton";
import { AlertError } from "@components/Alerts/Alerts";
import { getUserLocation } from "@context/user";
import StatusButton from "@components/Utils/Buttons/StatusButton";

const Page: NextPage = () => {
  const { token = "" } = useGlobal();
  const url = `${process.env.API_URL}/core`;

  const [showModalExibir, setShowModalExibir] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>({});
  const [loadingModalContent, setLoadingModalContent] =
    useState<boolean>(false);

  function onCloseModalExibir() {
    setShowModalExibir(false);
  }

  function openModalExibir() {
    setShowModalExibir(true);
  }

  const colunas =
    ({ onUpdate, onRemove, getPost, onStatusChange }: ColumnFn) =>
    () =>
      [
        {
          Header: "Consultor",
          accessor: "user.name",
        },
        {
          Header: "Data",
          accessor: "createdAt",
          Filter: DateColumnFilter,
          filter: "dateBetween",
          Cell: ({ value = new Date() }) => (
            <span>{new Date(value).toLocaleDateString()}</span>
          ),
        },
        {
          Header: "",
          accessor: "id",
          Filter: NoFilter,
          Cell: ({ value = "" }) => {
            const currentPost = getPost(value);

            return (
              <div>
                <ShowButton
                  className="me-2"
                  onClick={async () => {
                    setLoadingModalContent(true);
                    setShowModalExibir(true);

                    try {
                      let new_current_post = await getPost(value);

                      // pega a cidade e o estado do consultor
                      if (new_current_post.user.stateId) {
                        const consultant_location = await getUserLocation(
                          new_current_post.user.stateId,
                          new_current_post.user.cityId
                        );

                        new_current_post = {
                          ...new_current_post,
                          consultant_location: consultant_location,
                        };
                      }

                      if(new_current_post.pdfLink[0]){
                        new_current_post = {
                          ...new_current_post,
                          pdf_url: new_current_post.pdfLink[0].pdfPathName,
                        };
                      } else {
                        new_current_post = {
                          ...new_current_post,
                          pdf_url: false,
                        };
                      }

                      setCurrentPost(new_current_post);
                    } catch (error) {
                      setShowModalExibir(false);
                      AlertError();
                    }

                    setLoadingModalContent(false);
                  }}
                />

                {currentPost && (
                  <StatusButton
                    active={currentPost["active"]}
                    onClick={() => onStatusChange(value, currentPost["active"])}
                  />
                )}
              </div>
            );
          },
        },
      ];

  const axios_options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return (
    <LayoutDefault>
      <PostType
        removeAddButton
        dataConfig={{
          url,
          token,
          fetcherFn: (fetcherDataFn = () => {}, url = "", options = {}) =>
            axios
              .get(`${process.env.API_URL}/core`, options)
              .then(fetcherDataFn),
          fetcherDataFn: async (response: AxiosResponse) => {
            const cores_raw = response.data.cores.data;

            const users_raw = await axios.get(
              `${process.env.API_URL}/user`,
              axios_options
            );
            const users = users_raw.data.users;

            const cores = cores_raw
              .map((core: any) => ({
                ...core,
                costCompetingRequest: JSON.parse(core.costCompetingRequest),
                costCompetingResult: JSON.parse(core.costCompetingResult),
                user: users.find((user: any) => user.id === core.userId),
              }))
              .filter((core: any) => core.costCompetingRequest !== null);

            const cores_sort = cores.sort(
              // @ts-ignore
              (a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            return cores_sort;
          },
        }}
        formConfig={{
          insertTitle: "Adicionar Custo",
          editTitle: "Editar Custo",
        }}
        tableConfig={{
          columnsFn: colunas,
        }}
        pageConfig={{
          pageTitle: "Custo TMF x Calcário",
        }}
      />

      <ModalExibirPost
        title="Custo TMF X Calcário"
        show={showModalExibir}
        onClose={onCloseModalExibir}
        pdf_url={currentPost.pdf_url}
        size="lg"
      >
        <div>
          {loadingModalContent ? (
            <div>
              <Spinner animation={"border"} variant="primary" />
            </div>
          ) : (
            currentPost.user && (
              <div>
                <Row>
                  <Col>
                    <section>
                      <h4>Dados do consultor</h4>
                      <div>Nome: {currentPost.user.name}</div>
                      <div>Email: {currentPost.user.email}</div>
                      <div>CPF: {currentPost.user.identification}</div>
                      <div>Telefone: {currentPost.user.phone}</div>
                      <div>
                        Cidade:{" "}
                        {currentPost.consultant_location
                          ? currentPost.consultant_location.city
                          : ""}
                      </div>
                      <div>
                        Estado:{" "}
                        {currentPost.consultant_location
                          ? currentPost.consultant_location.state
                          : ""}
                      </div>
                      <div>Revenda: {currentPost.formResale}</div>
                      <div>Região: {currentPost.formRegion}</div>
                    </section>
                  </Col>
                </Row>

                <hr />

                <Row>
                  <Col>
                    <Table size="sm" className="mt-2" bordered>
                      <thead>
                        <tr>
                          <th className="text-center bg-primary text-white">
                            <h4 className="text-white my-0">
                              <b>Custo TMF</b>
                            </h4>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            Recomendação TMF (ton/ha):{" "}
                            <span>
                              {currentPost.costCompetingRequest
                                .limestoneRecomendation ?? "-"}
                            </span>
                          </td>
                        </tr>

                        <tr className="text-center bg-light">
                          <td>
                            Custos Gerais <b>INSUMO</b>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div>
                              TMF (R$/ton):{" "}
                              <span>
                                {currentPost.costCompetingRequest.costInput
                                  ?.limestoneTon ?? "-"}
                              </span>
                            </div>
                            <div>
                              Frete (R$/ton):{" "}
                              {currentPost.costCompetingRequest.costInput
                                ?.shippingTon ?? "-"}
                            </div>
                          </td>
                        </tr>

                        <tr className="text-center">
                          <td>
                            <strong>
                              <div className="d-flex justify-content-between">
                                Custo Insumo:{" "}
                                <span>
                                  {currentPost.costCompetingResult.costInputTotal.toFixed(
                                    2
                                  ) ?? "-"}
                                </span>
                              </div>
                            </strong>
                          </td>
                        </tr>

                        <tr className="text-center bg-light">
                          <td>
                            Custos Gerais <b>APLICAÇÃO</b>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div>
                              Homem Hora (R$/hrs):{" "}
                              {currentPost.costCompetingRequest.costApplication
                                ?.manHour ?? "-"}
                            </div>
                            <div>
                              Horas trabalhadas (hrs/ha):{" "}
                              {currentPost.costCompetingRequest.costApplication
                                ?.hoursToApplication ?? "-"}
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div>
                              Diesel Trator Concha (L/h):{" "}
                              {currentPost.costCompetingRequest.costApplication
                                ?.dieselTractorShell ?? "-"}
                            </div>
                            <div>
                              Horas trabalhadas (hrs/ha):{" "}
                              {currentPost.costCompetingRequest.costApplication
                                ?.workedHoursTractorShell ?? "-"}
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div>
                              Diesel Trator Aplicador (L/h):{" "}
                              {currentPost.costCompetingRequest.costApplication
                                ?.dieselTractorApplicator ?? "-"}
                            </div>
                            <div>
                              Horas trabalhadas (hrs/ha):{" "}
                              {currentPost.costCompetingRequest.costApplication
                                ?.workedHoursTractorApplicator ?? "-"}
                            </div>
                          </td>
                        </tr>

                        <tr className="text-center">
                          <td>
                            <strong>
                              <div className="d-flex justify-content-between">
                                Custo Aplicação:{" "}
                                <span>
                                  {currentPost.costCompetingResult.costApplicationTotal.toFixed(
                                    2
                                  ) ?? "-"}
                                </span>
                              </div>
                            </strong>
                          </td>
                        </tr>

                        <tr className="text-center bg-primary text-light">
                          <td>
                            <strong>
                              <div className="d-flex justify-content-between">
                                Custo Total:{" "}
                                <span>
                                  {currentPost.costCompetingResult.finalResultTMF.toFixed(
                                    2
                                  ) ?? "-"}
                                </span>
                              </div>
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>

                  <Col>
                    <Table size="sm" className="mt-2" bordered>
                      <thead>
                        <tr>
                          <th className="text-center bg-primary text-white">
                            <h4 className="text-white my-0">
                              <b>Custo Calcário</b>
                            </h4>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            Recomendação Calcário (ton/ha):{" "}
                            <span>
                              {currentPost.costCompetingRequest
                                .competingLimestoneRecomendation ?? "-"}
                            </span>
                          </td>
                        </tr>

                        <tr className="text-center bg-light">
                          <td>
                            Custos Gerais <b>INSUMO</b>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div>
                              Calcário (R$/ton):{" "}
                              {currentPost.costCompetingRequest
                                .competingCostInput?.limestoneTon ?? "-"}
                            </div>
                            <div>
                              Frete (R$/ton):{" "}
                              {currentPost.costCompetingRequest
                                .competingCostInput?.shippingTon ?? "-"}
                            </div>
                            <div>
                              Perdas com Umidade/Vento (%):{" "}
                              {currentPost.costCompetingRequest
                                .competingCostInput
                                ?.windMoistureLossPercentage ?? "-"}
                            </div>
                            <div>
                              Eficiência PRNT Calcário (%):{" "}
                              {currentPost.costCompetingRequest
                                .competingCostInput
                                ?.limestoneEfficiencyPrntPercentage ?? "-"}
                            </div>
                          </td>
                        </tr>

                        <tr className="text-center">
                          <td>
                            <strong>
                              <div className="d-flex justify-content-between">
                                Custo Insumo:{" "}
                                <span>
                                  {currentPost.costCompetingResult.competingCostInputTotal.toFixed(
                                    2
                                  ) ?? "-"}
                                </span>
                              </div>
                            </strong>
                          </td>
                        </tr>

                        <tr className="text-center bg-light">
                          <td>
                            Custos Gerais <b>APLICAÇÃO</b>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div>
                              Homem Hora (R$/hrs):{" "}
                              {currentPost.costCompetingRequest
                                .competingCostApplication?.manHour ?? "-"}
                            </div>
                            <div>
                              Horas trabalhadas (hrs/ha):{" "}
                              {currentPost.costCompetingRequest
                                .competingCostApplication?.hoursToApplication ??
                                "-"}
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div>
                              Diesel Trator Concha (L/h):{" "}
                              {currentPost.costCompetingRequest
                                .competingCostApplication?.dieselTractorShell ??
                                "-"}
                            </div>
                            <div>
                              Horas trabalhadas (hrs/ha):{" "}
                              {currentPost.costCompetingRequest
                                .competingCostApplication
                                ?.workedHoursTractorShell ?? "-"}
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div>
                              Diesel Trator Aplicador (L/h):{" "}
                              {currentPost.costCompetingRequest
                                .competingCostApplication
                                ?.dieselTractorApplicator ?? "-"}
                            </div>
                            <div>
                              Horas trabalhadas (hrs/ha):{" "}
                              {currentPost.costCompetingRequest
                                .competingCostApplication
                                ?.workedHoursTractorApplicator ?? "-"}
                            </div>
                          </td>
                        </tr>

                        <tr className="text-center">
                          <td>
                            <strong>
                              <div className="d-flex justify-content-between">
                                Custo Aplicação:{" "}
                                <span>
                                  {currentPost.costCompetingResult.competingCostApplicationTotal.toFixed(
                                    2
                                  ) ?? "-"}
                                </span>
                              </div>
                            </strong>
                          </td>
                        </tr>

                        <tr className="text-center bg-light">
                          <td>
                            Custos Gerais <b>INCORPORAÇÃO</b>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div>
                              Homem Hora (R$/hrs):{" "}
                              {currentPost.costCompetingRequest
                                .competingCostIncorporation?.manHour ?? "-"}
                            </div>
                            <div>
                              Horas trabalhadas (hrs/ha):{" "}
                              {currentPost.costCompetingRequest
                                .competingCostIncorporation
                                ?.hoursToApplication ?? "-"}
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div>
                              Diesel Trator Grade (L/h):{" "}
                              {currentPost.costCompetingRequest
                                .competingCostIncorporation
                                ?.dieselTractorGrid ?? "-"}
                            </div>
                            <div>
                              Horas trabalhadas (hrs/ha):{" "}
                              {currentPost.costCompetingRequest
                                .competingCostIncorporation
                                ?.workedHoursTractorGrid ?? "-"}
                            </div>
                          </td>
                        </tr>

                        <tr className="text-center">
                          <td>
                            <strong>
                              <div className="d-flex justify-content-between">
                                Custo Aplicação:{" "}
                                <span>
                                  {currentPost.costCompetingResult.competingCostIncorporationTotal.toFixed(
                                    2
                                  ) ?? "-"}
                                </span>
                              </div>
                            </strong>
                          </td>
                        </tr>

                        <tr className="text-center bg-primary text-light">
                          <td>
                            <strong>
                              <div className="d-flex justify-content-between">
                                Custo Total:{" "}
                                <span>
                                  {currentPost.costCompetingResult.finalResultCompeting.toFixed(
                                    2
                                  ) ?? "-"}
                                </span>
                              </div>
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>

                <hr />
              </div>
            )
          )}
        </div>
      </ModalExibirPost>
    </LayoutDefault>
  );
};

export default Page;
