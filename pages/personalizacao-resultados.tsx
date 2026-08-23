import LayoutDefault from "@components/Layouts/default";
import { useGlobal } from "@context/global";
import { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, Tab, ListGroup, Button, Spinner } from "react-bootstrap";

interface ResultSectionOrder {
  id: number;
  analysisType: "nutrition" | "fertility" | "tmfVsCompetitor" | "productionCost";
  sectionOrder: string[];
  createdAt: string;
  updatedAt: string;
}

const ANALYSIS_TYPE_LABELS: Record<ResultSectionOrder["analysisType"], string> = {
  nutrition: "Manutenção e Nutrição de Plantas",
  fertility: "Fertilidade e Construção de Perfil de Solo",
  tmfVsCompetitor: "Investimento TMF x Concorrente",
  productionCost: "Custo de Produção",
};

const SECTION_LABELS: Record<string, string> = {
  guarantees: "Garantias do produto",
  summary: "Resumo",
  recommendation: "Recomendação",
  nutrientsDelivered: "Nutrientes entregues",
  nutritionalRequirement: "Exigências nutricionais",
  productDescription: "Descrição do produto",
  comparisonHighlight: "Comparação em destaque",
  competitorCostDetail: "Detalhamento do custo concorrente",
  tmfInvestmentDetail: "Detalhamento do investimento TMF",
  comparisonDetail: "Detalhamento da comparação de produtividade/custo",
};

const DEFAULT_ORDER_BY_TYPE: Record<ResultSectionOrder["analysisType"], string[]> = {
  nutrition: [
    "guarantees",
    "summary",
    "nutrientsDelivered",
    "nutritionalRequirement",
    "productDescription",
  ],
  fertility: [
    "guarantees",
    "summary",
    "recommendation",
    "nutrientsDelivered",
    "nutritionalRequirement",
    "productDescription",
  ],
  tmfVsCompetitor: ["comparisonHighlight", "competitorCostDetail", "tmfInvestmentDetail"],
  productionCost: ["comparisonHighlight", "comparisonDetail"],
};

export default function PersonalizacaoResultados() {
  const { token = "" } = useGlobal();
  const url = `${process.env.API_URL}/resultSectionOrder`;

  const [rows, setRows] = useState<ResultSectionOrder[]>([]);
  const [activeType, setActiveType] = useState<ResultSectionOrder["analysisType"]>("nutrition");
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);

  const axiosOptions = { headers: { Authorization: `Bearer ${token}` } };

  async function fetchRows() {
    setLoading(true);
    const response = await axios.get(url, axiosOptions);
    setRows(response.data.resultSectionOrders || []);
    setLoading(false);
  }

  useEffect(() => {
    if (token) fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const activeRow = rows.find((row) => row.analysisType === activeType);

  function moveSection(index: number, direction: -1 | 1) {
    if (!activeRow) return;
    const newOrder = [...activeRow.sectionOrder];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];

    setRows((prev) =>
      prev.map((row) => (row.id === activeRow.id ? { ...row, sectionOrder: newOrder } : row))
    );
  }

  async function saveOrder(sectionOrder: string[]) {
    if (!activeRow) return;
    setSaving(true);
    const response = await axios.patch(
      `${url}/${activeRow.id}`,
      { sectionOrder },
      axiosOptions
    );
    const updated = response.data.resultSectionOrder;
    setRows((prev) => prev.map((row) => (row.id === updated.id ? updated : row)));
    setSaving(false);
  }

  function restoreDefault() {
    if (!activeRow) return;
    saveOrder(DEFAULT_ORDER_BY_TYPE[activeRow.analysisType]);
  }

  return (
    <LayoutDefault>
      <h1 className="h3 mb-4">Personalização de Resultados</h1>

      {isLoading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <Tabs
          activeKey={activeType}
          onSelect={(key) => key && setActiveType(key as ResultSectionOrder["analysisType"])}
          className="mb-3"
        >
          {(Object.keys(ANALYSIS_TYPE_LABELS) as ResultSectionOrder["analysisType"][]).map(
            (type) => {
              const row = rows.find((r) => r.analysisType === type);

              return (
                <Tab eventKey={type} title={ANALYSIS_TYPE_LABELS[type]} key={type}>
                  <ListGroup className="mt-3">
                    {row?.sectionOrder.map((sectionKey, index) => (
                      <ListGroup.Item
                        key={sectionKey}
                        className="d-flex justify-content-between align-items-center"
                      >
                        {SECTION_LABELS[sectionKey] || sectionKey}
                        <div>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            className="me-2"
                            disabled={index === 0}
                            onClick={() => moveSection(index, -1)}
                          >
                            ↑
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            disabled={index === row.sectionOrder.length - 1}
                            onClick={() => moveSection(index, 1)}
                          >
                            ↓
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  <div className="mt-3 d-flex gap-2">
                    <Button
                      variant="primary"
                      disabled={isSaving || !row}
                      onClick={() => row && saveOrder(row.sectionOrder)}
                    >
                      {isSaving ? "Salvando..." : "Salvar"}
                    </Button>
                    <Button variant="outline-secondary" disabled={isSaving || !row} onClick={restoreDefault}>
                      Restaurar padrão
                    </Button>
                  </div>
                </Tab>
              );
            }
          )}
        </Tabs>
      )}
    </LayoutDefault>
  );
}
