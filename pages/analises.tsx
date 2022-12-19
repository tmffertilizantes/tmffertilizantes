import { DateColumnFilter, NoFilter, PostType } from "@components";
import { NextPage } from "next";
import { useGlobal } from "@context/global";
import axios, { AxiosResponse } from "axios";
import LayoutDefault from "@components/Layouts/default";
import { ColumnFn } from "models/ColumnFn";
import useSWR from "swr";
import Select from "react-select";
import ModalExibirPost from "@components/postType/ModalExibirPost";
import ShowButton from "@components/Utils/Buttons/ShowButton";
import { useState } from "react";
import RemoveButton from "@components/Utils/Buttons/RemoveButton";
import { Col, Row, Spinner, Table } from "react-bootstrap";
import { Cidade } from "models/cidade";
import { AlertError } from "@components/Alerts/Alerts";
import { getUserLocation } from "@context/user";
import StatusButton from "@components/Utils/Buttons/StatusButton";

interface CustomComponent {
  post: any;
  setPost: Function;
}

interface Report {}

const Page: NextPage = () => {
  const { token = "" } = useGlobal();
  const url = `${process.env.API_URL}/analysis`;

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

  const fields = [
    {
      field: "serviceType",
      label: "Tipo de Serviço",
      placeholder: "Exemplo",
      disableEdit: true,
    },
    {
      field: "plot",
      label: "Plot",
      placeholder: "Exemplo",
      disableEdit: true,
    },
    {
      field: "arableArea",
      label: "Área",
      placeholder: "exemplo",
      disableEdit: true,
    },
    {
      field: "productionExpectation",
      label: "Expectativa de produção",
      placeholder: "Exemplo",
      disableEdit: true,
    },
    {
      field: "application",
      label: "Aplicação",
      placeholder: "Exemplo",
      disableEdit: true,
    },
    {
      field: "report",
      label: "Report",
      placeholder: "Exemplo",
      disableEdit: true,
    },
  ];

  const colunas =
    ({ onUpdate, onRemove, getPost, onStatusChange }: ColumnFn) =>
    () =>
      [
        {
          Header: "Produtor",
          accessor: "producer.name",
        },
        {
          Header: "Consultor",
          accessor: "consultant.user.name",
        },
        {
          Header: "Tipo de Serviço",
          accessor: "tipo_aplicacao",
          Cell: ({ value = "" }) => (
            <span className="p-2 rounded bg-light">
              {value.includes("SOLO")
                ? "Construção de Solo"
                : "Nutrição de Plantas"}
            </span>
          ),
        },
        {
          Header: "Data",
          accessor: "startDate",
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
                      if (new_current_post.consultant.user.stateId) {
                        const consultant_location = await getUserLocation(
                          new_current_post.consultant.user.stateId,
                          new_current_post.consultant.user.cityId
                        );

                        new_current_post = {
                          ...new_current_post,
                          consultant_location: consultant_location,
                        };
                      }

                      // pega a cidade e o estado do produtor
                      if (new_current_post.producer.stateId) {
                        const producer_location = await getUserLocation(
                          new_current_post.producer.stateId,
                          new_current_post.producer.cityId
                        );

                        new_current_post = {
                          ...new_current_post,
                          producer_location: producer_location,
                        };
                      }

                      //pega o nome da cultura
                      if (new_current_post.producer.cultureId) {
                        const producer_culture_raw = await axios.get(
                          `${process.env.API_URL}/culture/id/${new_current_post.producer.cultureId}`,
                          axios_options
                        );
                        const producer_culture =
                          producer_culture_raw.data.culture.name;

                        new_current_post = {
                          ...new_current_post,
                          producer_culture: producer_culture,
                        };
                      }

                      const pdf_url = await axios.get(
                        `${process.env.API_URL}/email_template/showAnalysisPdf/${new_current_post.id}`,
                        axios_options
                      );

                      new_current_post = {
                        ...new_current_post,
                        pdf_url: pdf_url.data.pdfPathName,
                      };

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

  function getFormatedNumber(number: number) {
    if (number) {
      return number.toFixed(2);
    }

    if (number == 0) {
      return 0;
    }

    return "-";
  }

  return (
    <LayoutDefault>
      <PostType
        removeAddButton
        dataConfig={{
          url,
          token,
          fetcherFn: (fetcherDataFn = () => {}, url = "", options = {}) =>
            axios
              .get(
                `${process.env.API_URL}/analysis?includes=consultant,producer,culture,investment,product`,
                options
              )
              .then(fetcherDataFn),
          fetcherDataFn: async (response: AxiosResponse) => {
            const analises_raw = response.data.analysiss;

            const producers_raw = await axios.get(
              `${process.env.API_URL}/producer?includes=culture`,
              axios_options
            );
            const producers = producers_raw.data.producers;

            const analises = analises_raw.map((analise: any) => {
              let tipo_aplicacao = "";

              if (analise.report.hasOwnProperty("realResult")) {
                tipo_aplicacao = "CONSTRUÇÃO DE SOLO";
              } else {
                tipo_aplicacao = "NUTRIÇÃO DE PLANTAS";
              }
              return {
                ...analise,
                producer: producers.filter(
                  (producer: any) => producer.id === analise.producerId
                )[0],
                tipo_aplicacao,
              };
            });

            console.log(analises);

            return analises;
          },
        }}
        tableConfig={{
          columnsFn: colunas,
        }}
        formConfig={{
          insertTitle: "Adicionar Análise",
          editTitle: null,
          fields,
        }}
        pageConfig={{
          pageTitle: "Análises",
        }}
      />

      <ModalExibirPost
        title="Análise"
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
            currentPost.consultant && (
              <div>
                <Row>
                  <Col>
                    <section>
                      <h4>Dados do consultor</h4>
                      <div>Nome: {currentPost.consultant.user.name}</div>
                      <div>Email: {currentPost.consultant.user.email}</div>
                      <div>
                        CPF: {currentPost.consultant.user.identification}
                      </div>
                      <div>Telefone: {currentPost.consultant.user.phone}</div>
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
                      <div>Revenda: {currentPost.consultant.formResale}</div>
                      <div>Região: {currentPost.consultant.formRegion}</div>
                    </section>
                  </Col>

                  <Col>
                    <section>
                      <h4>Dados do produtor</h4>
                      <div>Nome: {currentPost.producer.name}</div>
                      <div>CPF: {currentPost.producer.cpf}</div>
                      <div>Telefone: {currentPost.producer.telephone}</div>
                      <div>
                        Cidade:{" "}
                        {currentPost.producer_location
                          ? currentPost.producer_location.city
                          : ""}
                      </div>
                      <div>
                        Estado:{" "}
                        {currentPost.producer_location
                          ? currentPost.producer_location.state
                          : ""}
                      </div>
                      <div>Cultura: {currentPost.producer_culture}</div>
                      <div>Área: {currentPost.producer.area}</div>
                      <div>
                        Tecnologia no campo: {currentPost.producer.technology}
                      </div>
                    </section>
                  </Col>
                </Row>

                <hr />

                <section>
                  <h4>
                    Dados da análise -{" "}
                    {currentPost.tipo_aplicacao.includes("SOLO")
                      ? "Construção de Solo"
                      : "Nutrição de Plantas"}
                  </h4>
                  <div>
                    Data: {new Date(currentPost.startDate).toLocaleDateString()}
                  </div>
                  <div>Cultura: {currentPost.culture.name}</div>

                  {currentPost.tipo_aplicacao?.includes("PLANTAS") && (
                    <>
                      <div>Área cultivável(ha): {currentPost.arableArea}</div>
                      <div>
                        Expectativa de produçāo:{" "}
                        {currentPost.productionExpectation}
                      </div>
                      <div className="text-primary">
                        <strong>Fertilizante</strong>:{" "}
                        {currentPost.product.name}
                      </div>
                      <div>
                        Modo de aplicaçāo:{" "}
                        {currentPost.report.Dosage?.length > 0 &&
                          currentPost.report.Dosage[0]["description"]}
                      </div>
                      <div>
                        Dose recomendada (Kg/ha):{" "}
                        {currentPost.report.Dosage?.length > 0 &&
                          getFormatedNumber(
                            currentPost.report.Dosage[0]["value"]
                          )}
                      </div>

                      <hr />

                      {currentPost.report?.NutritionalRequirement && (
                        <>
                          <div>Requerimento Nutricional</div>

                          <Table className="mt-2" bordered hover>
                            <thead>
                              <tr>
                                <th>Parâmetro</th>
                                <th>Extração</th>
                                <th>Exportação</th>
                              </tr>
                            </thead>

                            <tbody>
                              <tr>
                                <td>Ca</td>
                                <td>
                                  {currentPost.report?.NutritionalRequirement
                                    ?.calcio?.extracao ?? "-"}
                                </td>
                                <td>
                                  {currentPost.report?.NutritionalRequirement
                                    ?.calcio?.exportacao ?? "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>Mg</td>
                                <td>
                                  {currentPost.report?.NutritionalRequirement
                                    ?.magnesio?.extracao ?? "-"}
                                </td>
                                <td>
                                  {currentPost.report?.NutritionalRequirement
                                    ?.magnesio?.exportacao ?? "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>K</td>
                                <td>
                                  {currentPost.report?.NutritionalRequirement
                                    ?.potassio?.extracao ?? "-"}
                                </td>
                                <td>
                                  {currentPost.report?.NutritionalRequirement
                                    ?.potassio?.exportacao ?? "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>P</td>
                                <td>
                                  {currentPost.report?.NutritionalRequirement
                                    ?.fosforo?.extracao ?? "-"}
                                </td>
                                <td>
                                  {currentPost.report?.NutritionalRequirement
                                    ?.fosforo?.exportacao ?? "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>S</td>
                                <td>
                                  {currentPost.report?.NutritionalRequirement
                                    ?.enxofre?.extracao ?? "-"}
                                </td>
                                <td>
                                  {currentPost.report?.NutritionalRequirement
                                    ?.enxofre?.exportacao ?? "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>N</td>
                                <td>
                                  {currentPost.report?.NutritionalRequirement
                                    ?.nitrogenio?.extracao ?? "-"}
                                </td>
                                <td>
                                  {currentPost.report?.NutritionalRequirement
                                    ?.nitrogenio?.exportacao ?? "-"}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </>
                      )}

                      {currentPost.report?.AditionalInformation && (
                        <>
                          <div>Informações adicionais</div>

                          <Table className="mt-2" bordered hover>
                            <thead>
                              <tr>
                                <th>Parâmetro</th>
                                <th>Kg/ha</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentPost.report.AditionalInformation?.map(
                                (
                                  item: {
                                    value: number;
                                    description: string;
                                  },
                                  index: number
                                ) => (
                                  <tr key={index}>
                                    <td>{item.description}</td>
                                    <td>{getFormatedNumber(item.value)}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </Table>
                        </>
                      )}
                    </>
                  )}

                  {currentPost.tipo_aplicacao?.includes("SOLO") && (
                    <>
                      <Table className="mt-2" bordered hover>
                        <thead>
                          <tr>
                            <th>Parâmetro</th>
                            <th>Solo</th>
                            <th>Desejado</th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                            <td>Ca** (%) na CTC</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil?.measureResult
                                  ?.Ca
                              )}
                            </td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.expectativeResult?.Ca
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Mg** (%) na CTC</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil?.measureResult
                                  ?.Mg
                              )}
                            </td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.expectativeResult?.Mg
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>K** (%) na CTC</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil?.measureResult?.K
                              )}
                            </td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.expectativeResult?.K
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Relação Ca/Mg</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.relationCaMgMeasure
                              )}
                            </td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.relationCaMgExpectative
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </Table>

                      {currentPost.report?.resultPlant
                        ?.NutritionalRequirement && (
                        <>
                          <div>Requerimento Nutricional</div>

                          <Table className="mt-2" bordered hover>
                            <thead>
                              <tr>
                                <th>Parâmetro</th>
                                <th>Extração</th>
                                <th>Exportação</th>
                              </tr>
                            </thead>

                            <tbody>
                              <tr>
                                <td>Ca</td>
                                <td>
                                  {currentPost.report?.resultPlant
                                    ?.NutritionalRequirement?.calcio
                                    ?.extracao ?? "-"}
                                </td>
                                <td>
                                  {currentPost.report?.resultPlant
                                    ?.NutritionalRequirement?.calcio
                                    ?.exportacao ?? "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>Mg</td>
                                <td>
                                  {currentPost.report?.resultPlant
                                    ?.NutritionalRequirement?.magnesio
                                    ?.extracao ?? "-"}
                                </td>
                                <td>
                                  {currentPost.report?.resultPlant
                                    ?.NutritionalRequirement?.magnesio
                                    ?.exportacao ?? "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>K</td>
                                <td>
                                  {currentPost.report?.resultPlant
                                    ?.NutritionalRequirement?.potassio
                                    ?.extracao ?? "-"}
                                </td>
                                <td>
                                  {currentPost.report?.resultPlant
                                    ?.NutritionalRequirement?.potassio
                                    ?.exportacao ?? "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>P</td>
                                <td>
                                  {currentPost.report?.resultPlant
                                    ?.NutritionalRequirement?.fosforo
                                    ?.extracao ?? "-"}
                                </td>
                                <td>
                                  {currentPost.report?.resultPlant
                                    ?.NutritionalRequirement?.fosforo
                                    ?.exportacao ?? "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>S</td>
                                <td>
                                  {currentPost.report?.resultPlant
                                    ?.NutritionalRequirement?.enxofre
                                    ?.extracao ?? "-"}
                                </td>
                                <td>
                                  {currentPost.report?.resultPlant
                                    ?.NutritionalRequirement?.enxofre
                                    ?.exportacao ?? "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>N</td>
                                <td>
                                  {currentPost.report?.resultPlant
                                    ?.NutritionalRequirement?.nitrogenio
                                    ?.extracao ?? "-"}
                                </td>
                                <td>
                                  {currentPost.report?.resultPlant
                                    ?.NutritionalRequirement?.nitrogenio
                                    ?.exportacao ?? "-"}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </>
                      )}
                    </>
                  )}
                </section>

                {currentPost.tipo_aplicacao?.includes("SOLO") && (
                  <>
                    <section>
                      <h4>
                        Produto Recomendado:{" "}
                        <span className="fw-normal">
                          {currentPost.product.name}
                        </span>
                      </h4>
                      Programa de formaçāo de perfil de solo
                      <Table className="mt-2" bordered hover>
                        <tbody>
                          <tr>
                            <td>Qtde Ca (kg) entregue</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.productRecommended?.QtdCa
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Qtde Mg (kg) entregue</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.productRecommended?.QtdMg
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Dose recomendada (kg/ha)</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.productRecommended?.dosage
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>KCL (Cloreto de Potássio) a aplicar kg/ha</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.productRecommended?.recommendedKCL
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <Table className="mt-2" bordered hover>
                        <thead>
                          <tr>
                            <th>Mineral</th>
                            <th>Qtd</th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                            <td>Ca</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.productRecommended?.minerals?.ca
                              )}
                            </td>
                          </tr>
                        </tbody>
                        <tbody>
                          <tr>
                            <td>Si</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.productRecommended?.minerals?.si
                              )}
                            </td>
                          </tr>
                        </tbody>
                        <tbody>
                          <tr>
                            <td>Mg</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.productRecommended?.minerals?.mg
                              )}
                            </td>
                          </tr>
                        </tbody>
                        <tbody>
                          <tr>
                            <td>B</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.productRecommended?.minerals?.b
                              )}
                            </td>
                          </tr>
                        </tbody>
                        <tbody>
                          <tr>
                            <td>S</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.productRecommended?.minerals?.s
                              )}
                            </td>
                          </tr>
                        </tbody>
                        <tbody>
                          <tr>
                            <td>N</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report?.resultSoil
                                  ?.productRecommended?.minerals?.n
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </section>

                    <hr />
                  </>
                )}

                {currentPost.report.realResult && (
                  <>
                    <section>
                      <h4>Cálculo Real:</h4>

                      <Table className="mt-2" bordered>
                        <tbody>
                          <tr>
                            <td>Dosagem</td>
                            <td>
                              {getFormatedNumber(
                                currentPost.report.realResult.realDosage
                              )}
                            </td>
                          </tr>

                          <tr>
                            <td>Teor Argila Desejado</td>
                            <td>
                              {
                                currentPost.report.realResult.realMeasureResult
                                  .teorArgila
                              }
                            </td>
                          </tr>

                          <tr>
                            <td>Mg Desejado</td>
                            <td>
                              {
                                currentPost.report.realResult.realMeasureResult
                                  .Mg
                              }
                            </td>
                          </tr>

                          <tr>
                            <td>Ca Desejado</td>
                            <td>
                              {
                                currentPost.report.realResult.realMeasureResult
                                  .Ca
                              }
                            </td>
                          </tr>

                          <tr>
                            <td>K Desejado</td>
                            <td>
                              {
                                currentPost.report.realResult.realMeasureResult
                                  .K
                              }
                            </td>
                          </tr>
                          <tr>
                            <td>Qtd Ca</td>
                            <td>{currentPost.report.realResult.qtdCa}</td>
                          </tr>
                          <tr>
                            <td>Qtd Mg</td>
                            <td>{currentPost.report.realResult.qtdMg}</td>
                          </tr>
                          <tr>
                            <td>KCL Recomendado</td>
                            <td>
                              {currentPost.report.realResult.recommendedKCL}
                            </td>
                          </tr>
                          {currentPost.report.realResult
                            .percentageFromPlant && (
                            <tr>
                              <td>Porcentagem da Planta:</td>
                              <td>
                                {getFormatedNumber(
                                  currentPost.report.realResult
                                    .percentageFromPlant
                                )}
                              </td>
                            </tr>
                          )}
                          <tr className="bg-primary text-light">
                            <td>Valor</td>
                            <td>
                              {
                                currentPost.report.realResult.realMeasureResult
                                  .V
                              }
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </section>

                    <hr />
                  </>
                )}
              </div>
            )
          )}
        </div>
      </ModalExibirPost>
    </LayoutDefault>
  );
};

export default Page;
