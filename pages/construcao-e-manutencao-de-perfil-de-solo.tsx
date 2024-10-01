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

  const [csvData, setCsvData] = useState(null);
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
              <div className="text-end d-flex justify-content-end">
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
        csvData={csvData}
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

            const analises = analises_raw
              .map((analise: any) => {
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
              })
              .filter(
                (analise: any) =>
                  analise.tipo_aplicacao === "CONSTRUÇÃO DE SOLO"
              );

            var data_for_csv = analises.map((analise: any) => {
              let qtd_ca_entregue = "";
              let qtd_si_entregue = "";
              let qtd_mg_entregue = "";
              let qtd_b_entregue = "";
              let qtd_s_entregue = "";
              let qtd_n_entregue = "";

              let dosage_description = "";
              let dosage_value = "";

              let dose_recomendada = "";
              let kcl = "";

              // calculo real
              let teor_argila = "";
              let kcl_recomendado = "";
              let porcentagem_planta = "";

              let mg_desejado = "";
              let ca_desejado = "";
              let k_desejado = "";

              let calc_real_qtd_ca = "";
              let calc_real_qtd_mg = "";

              let valor_calculo = "";
              // fim calculo real

              // exprot - extract
              let calcio_export = "";
              let calcio_extract = "";

              let enxofre_export = "";
              let enxofre_extract = "";

              let fosforo_export = "";
              let fosforo_extract = "";

              let magnesio_export = "";
              let magnesio_extract = "";

              let nitrogenio_export = "";
              let nitrogenio_extract = "";

              let potassio_export = "";
              let potassio_extract = "";
              // fim export - extract

              // CTC
              let ca_ctc_solo = "";
              let ca_ctc_desejado = "";

              let mg_ctc_solo = "";
              let mg_ctc_desejado = "";

              let k_ctc_solo = "";
              let k_ctc_desejado = "";

              let relacao_ctc_solo = "";
              let relacao_ctc_desejado = "";
              // fim CTC

              // MINERAIS
              let mineral_ca = "";
              let mineral_si = "";
              let mineral_mg = "";
              let mineral_b = "";
              let mineral_s = "";
              let mineral_n = "";
              // FIM MINERAIS

              if (analise.tipo_aplicacao.includes("PLANTAS")) {
                if (analise.report.AditionalInformation) {
                  qtd_ca_entregue =
                    analise.report.AditionalInformation[0].value ?? "";
                  qtd_si_entregue =
                    analise.report.AditionalInformation[1].value ?? "";
                  qtd_mg_entregue =
                    analise.report.AditionalInformation[2].value ?? "";
                  qtd_b_entregue =
                    analise.report.AditionalInformation[3].value ?? "";
                  qtd_s_entregue =
                    analise.report.AditionalInformation[4].value ?? "";
                  qtd_n_entregue =
                    analise.report.AditionalInformation[5].value ?? "";
                }

                if (analise.report.Dosage) {
                  dosage_description =
                    analise.report.Dosage[0].description ?? "";
                  dosage_value = analise.report.Dosage[0].value ?? "";
                }

                calcio_export =
                  analise.report.NutritionalRequirement?.calcio?.exportacao ??
                  "";
                calcio_extract =
                  analise.report.NutritionalRequirement?.calcio?.extracao ?? "";

                enxofre_export =
                  analise.report.NutritionalRequirement?.enxofre?.exportacao ??
                  "";
                enxofre_extract =
                  analise.report.NutritionalRequirement?.enxofre?.extracao ??
                  "";

                fosforo_export =
                  analise.report.NutritionalRequirement?.fosforo?.exportacao ??
                  "";
                fosforo_extract =
                  analise.report.NutritionalRequirement?.fosforo?.extracao ??
                  "";

                magnesio_export =
                  analise.report.NutritionalRequirement?.magnesio?.exportacao ??
                  "";
                magnesio_extract =
                  analise.report.NutritionalRequirement?.magnesio?.extracao ??
                  "";

                nitrogenio_export =
                  analise.report.NutritionalRequirement?.nitrogenio
                    ?.exportacao ?? "";
                nitrogenio_extract =
                  analise.report.NutritionalRequirement?.nitrogenio?.extracao ??
                  "";

                potassio_export =
                  analise.report.NutritionalRequirement?.potassio?.exportacao ??
                  "";
                potassio_extract =
                  analise.report.NutritionalRequirement?.potassio?.extracao ??
                  "";
              }

              if (analise.tipo_aplicacao.includes("SOLO")) {
                if (analise.report.resultPlant?.NutritionalRequirement) {
                  calcio_export =
                    analise.report.resultPlant?.NutritionalRequirement.calcio
                      ?.exportacao ?? "";
                  calcio_extract =
                    analise.report.resultPlant?.NutritionalRequirement.calcio
                      ?.extracao ?? "";

                  enxofre_export =
                    analise.report.resultPlant?.NutritionalRequirement.enxofre
                      ?.exportacao ?? "";
                  enxofre_extract =
                    analise.report.resultPlant?.NutritionalRequirement.enxofre
                      ?.extracao ?? "";

                  fosforo_export =
                    analise.report.resultPlant?.NutritionalRequirement.fosforo
                      ?.exportacao ?? "";
                  fosforo_extract =
                    analise.report.resultPlant?.NutritionalRequirement.fosforo
                      ?.extracao ?? "";

                  magnesio_export =
                    analise.report.resultPlant?.NutritionalRequirement.magnesio
                      ?.exportacao ?? "";
                  magnesio_extract =
                    analise.report.resultPlant?.NutritionalRequirement.magnesio
                      ?.extracao ?? "";

                  nitrogenio_export =
                    analise.report.resultPlant?.NutritionalRequirement
                      .nitrogenio?.exportacao ?? "";
                  nitrogenio_extract =
                    analise.report.resultPlant?.NutritionalRequirement
                      .nitrogenio?.extracao ?? "";

                  potassio_export =
                    analise.report.resultPlant?.NutritionalRequirement.potassio
                      ?.exportacao ?? "";
                  potassio_extract =
                    analise.report.resultPlant?.NutritionalRequirement.potassio
                      ?.extracao ?? "";
                }

                if (analise.report.resultSoil) {
                  qtd_ca_entregue =
                    analise.report.resultSoil.productRecommended?.QtdCa;
                  qtd_mg_entregue =
                    analise.report.resultSoil.productRecommended?.QtdMg;

                  dose_recomendada =
                    analise.report.resultSoil.productRecommended?.dosage;
                  kcl =
                    analise.report.resultSoil.productRecommended
                      ?.recommendedKCL;

                  mineral_ca =
                    analise.report.resultSoil.productRecommended?.minerals?.ca;
                  mineral_si =
                    analise.report.resultSoil.productRecommended?.minerals?.si;
                  mineral_mg =
                    analise.report.resultSoil.productRecommended?.minerals?.mg;
                  mineral_b =
                    analise.report.resultSoil.productRecommended?.minerals?.b;
                  mineral_n =
                    analise.report.resultSoil.productRecommended?.minerals?.n;
                  mineral_s =
                    analise.report.resultSoil.productRecommended?.minerals?.s;

                  if (analise.report.resultSoil.expectativeResult) {
                    ca_ctc_desejado =
                      analise.report.resultSoil.expectativeResult.Ca;
                    mg_ctc_desejado =
                      analise.report.resultSoil.expectativeResult.K;
                    k_ctc_desejado =
                      analise.report.resultSoil.expectativeResult.Mg;
                  }

                  if (analise.report.resultSoil.measureResult) {
                    ca_ctc_solo = analise.report.resultSoil.measureResult.Ca;
                    mg_ctc_solo = analise.report.resultSoil.measureResult.K;
                    k_ctc_solo = analise.report.resultSoil.measureResult.Mg;
                  }

                  relacao_ctc_solo =
                    analise.report.resultSoil.relationCaMgMeasure;
                  relacao_ctc_desejado =
                    analise.report.resultSoil.relationCaMgExpectative;
                }

                if (analise.report.realResult) {
                  dosage_value = analise.report.realResult.realDosage;

                  teor_argila =
                    analise.report.realResult.realMeasureResult?.teorArgila;
                  ca_desejado = analise.report.realResult.realMeasureResult?.Ca;
                  k_desejado = analise.report.realResult.realMeasureResult?.K;
                  mg_desejado = analise.report.realResult.realMeasureResult?.Mg;
                  valor_calculo =
                    analise.report.realResult.realMeasureResult?.V;

                  kcl_recomendado = analise.report.realResult.recommendedKCL;
                  porcentagem_planta =
                    analise.report.realResult.percentageFromPlant;

                  calc_real_qtd_ca = analise.report.realResult.qtdCa;
                  calc_real_qtd_mg = analise.report.realResult.qtdMg;
                }
              }

              return {
                id: analise.id,
                Ativo: analise.active,
                "Tipo de Análise": analise.tipo_aplicacao,

                "Nome do Consultor": analise.consultant.user.name ?? "",
                "Email do Consultor": analise.consultant.user.email ?? "",
                "Cidade do Consultor": analise.consultant.user.city.name ?? "",
                "Estado do Consultor": analise.consultant.user.state.name ?? "",

                "Nome do Produtor": analise.producer.name ?? "",
                "Email do Produtor": analise.producer.email ?? "",
                "Cidade do Produtor": analise.producer.city.name ?? "",
                "Estado do Produtor": analise.producer.state.name ?? "",
                "Área do Produtor": analise.producer.area ?? "",
                "Tecnologia no Campo": analise.producer.technology ?? "",

                "Nome da Cultura": analise.culture.name ?? "",

                "Criado em": analise.createdAt,
                "Data de Início": analise.startDate,

                "Ca na CTC do Solo": parseFloat(ca_ctc_solo).toFixed(2) ?? "",
                "Ca na CTC Desejado":
                  parseFloat(ca_ctc_desejado).toFixed(2) ?? "",

                "Mg na CTC do solo": parseFloat(mg_ctc_solo).toFixed(2) ?? "",
                "Mg na CTC desejado":
                  parseFloat(mg_ctc_desejado).toFixed(2) ?? "",

                "K na CTC do solo": parseFloat(k_ctc_solo).toFixed(2) ?? "",
                "K na CTC desejado":
                  parseFloat(k_ctc_desejado).toFixed(2) ?? "",

                "Relação Ca/Mg do solo":
                  parseFloat(relacao_ctc_solo).toFixed(2) ?? "",
                "Relação Ca/Mg desejado":
                  parseFloat(relacao_ctc_desejado).toFixed(2) ?? "",

                "Extração de Calcio":
                  parseFloat(calcio_extract).toFixed(2) ?? "",
                "Exportação de Calcio":
                  parseFloat(calcio_export).toFixed(2) ?? "",

                "Extração de Magnesio":
                  parseFloat(magnesio_extract).toFixed(2) ?? "",
                "Exportação de Magnesio":
                  parseFloat(magnesio_export).toFixed(2) ?? "",

                "Extração de Potassio":
                  parseFloat(potassio_extract).toFixed(2) ?? "",
                "Exportação de Potassio":
                  parseFloat(potassio_export).toFixed(2) ?? "",

                "Extração de Fosforo":
                  parseFloat(fosforo_extract).toFixed(2) ?? "",
                "Exportação de Fosforo":
                  parseFloat(fosforo_export).toFixed(2) ?? "",

                "Extração de Enxofre":
                  parseFloat(enxofre_extract).toFixed(2) ?? "",
                "Exportação de Enxofre":
                  parseFloat(enxofre_export).toFixed(2) ?? "",

                "Extração de Nitrogenio":
                  parseFloat(nitrogenio_extract).toFixed(2) ?? "",
                "Exportação de Nitrogenio":
                  parseFloat(nitrogenio_export).toFixed(2) ?? "",

                Produto: analise.product.name ?? "",
                "Expectativa do Produto": analise.productionExpectation ?? "",

                "Qtde Ca(Kg) entregue":
                  parseFloat(qtd_ca_entregue).toFixed(2) ?? "",
                "Qtde Mg(Kg) entregue":
                  parseFloat(qtd_mg_entregue).toFixed(2) ?? "",
                "Qtde Si(Kg) entregue":
                  parseFloat(qtd_si_entregue).toFixed(2) ?? "",
                "Qtde B(Kg) entregue":
                  parseFloat(qtd_b_entregue).toFixed(2) ?? "",
                "Qtde S(Kg) entregue":
                  parseFloat(qtd_s_entregue).toFixed(2) ?? "",
                "Qtde N(Kg) entregue":
                  parseFloat(qtd_n_entregue).toFixed(2) ?? "",
                "Dose Recomendada":
                  parseFloat(dose_recomendada).toFixed(2) ?? "",
                KCL: parseFloat(kcl).toFixed(2) ?? "",

                "Mineral Ca": parseFloat(mineral_ca).toFixed(2) ?? "",
                "Mineral Si": parseFloat(mineral_si).toFixed(2) ?? "",
                "Mineral Mg": parseFloat(mineral_mg).toFixed(2) ?? "",
                "Mineral B": parseFloat(mineral_b).toFixed(2) ?? "",
                "Mineral S": parseFloat(mineral_s).toFixed(2) ?? "",
                "Mineral N": parseFloat(mineral_n).toFixed(2) ?? "",

                "Descrição da Dose": dosage_description ?? "",
                "Dosagem Real": parseFloat(dosage_value).toFixed(2) ?? "",

                "Teor Argila Desejado": teor_argila ?? "",
                "Mg Desejado": parseFloat(mg_desejado).toFixed(2) ?? "",
                "Ca Desejado": parseFloat(ca_desejado).toFixed(2) ?? "",
                "K Desejado": parseFloat(k_desejado).toFixed(2) ?? "",

                "Qtd Ca Real": parseFloat(calc_real_qtd_ca).toFixed(2) ?? "",
                "Qtd Mg Real": parseFloat(calc_real_qtd_mg).toFixed(2) ?? "",

                "KCL Recomendado": parseFloat(kcl_recomendado).toFixed(2) ?? "",
                "Porcentagem da Planta":
                  parseFloat(porcentagem_planta).toFixed(2) ?? "",

                "Valor Calculo": parseFloat(valor_calculo).toFixed(2) ?? "",
              };
            });

            setCsvData(data_for_csv);

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
          pageTitle: "Construção e manutenção de perfil de solo",
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
                </section>
              </div>
            )
          )}
        </div>
      </ModalExibirPost>
    </LayoutDefault>
  );
};

export default Page;
